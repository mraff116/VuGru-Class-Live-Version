import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Helper function to safely convert Firestore Timestamp to ISO string
function convertTimestampToISO(timestamp) {
  if (!timestamp) return undefined;
  if (timestamp.toDate instanceof Function) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp).toISOString();
  }
  return undefined;
}

// Helper function to convert dates to Firestore timestamps
function convertDatesToTimestamps(obj) {
  if (!obj) return obj;
  
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertDatesToTimestamps(item));
  }
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      result[key] = Timestamp.fromDate(new Date(value));
    } else if (typeof value === 'object') {
      result[key] = convertDatesToTimestamps(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Clean object by removing undefined and null values
function cleanObject(obj) {
  if (!obj) return obj;
  
  const cleaned = Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  return cleaned;
}

// Helper function to ensure comment has all required fields
function normalizeComment(comment, userData) {
  return {
    ...comment,
    authorType: comment.authorType || userData?.userType || 'unknown',
    readBy: comment.readBy || [comment.authorId],
  };
}

export async function registerUser(email, password, userData) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDataToSave = cleanObject({
    ...userData,
    id: user.uid,
    email: user.email,
    createdAt: serverTimestamp()
  });

  await setDoc(doc(db, 'users', user.uid), userDataToSave);

  return {
    ...userData,
    id: user.uid,
    email: user.email,
  };
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  const data = userDoc.data();
  return {
    ...data,
    id: userDoc.id,
    createdAt: convertTimestampToISO(data.createdAt)
  };
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getCurrentUserData(user) {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    ...data,
    id: userDoc.id,
    createdAt: convertTimestampToISO(data.createdAt)
  };
}

export async function updateUserProfile(userId, updates) {
  try {
    const userRef = doc(db, 'users', userId);
    const cleanedUpdates = cleanObject(updates);
    await updateDoc(userRef, cleanedUpdates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function deleteUserAccount(password) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Re-authenticate user before deletion
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete user data from Firestore
    await deleteDoc(doc(db, 'users', user.uid));

    // Delete user's projects
    const projectsRef = collection(db, 'projects');
    const q = query(
      projectsRef,
      where('clientId', '==', user.uid)
    );
    const projectsSnapshot = await getDocs(q);
    
    for (const doc of projectsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Delete Firebase Auth user
    await deleteUser(user);

    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}

export async function createProject(projectData) {
  try {
    const projectToCreate = cleanObject({
      ...projectData,
      createdAt: serverTimestamp(),
      lastUpdate: serverTimestamp(),
      date: Timestamp.fromDate(new Date(projectData.date)),
      comments: []
    });

    const docRef = await addDoc(collection(db, 'projects'), projectToCreate);
    console.log('Project created with ID:', docRef.id);
    
    return {
      ...projectToCreate,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export function subscribeToProjects(userId, userType, callback) {
  const projectsRef = collection(db, 'projects');
  const q = query(
    projectsRef, 
    where(userType === 'videographer' ? 'videographerId' : 'clientId', '==', userId)
  );

  return onSnapshot(q, async (snapshot) => {
    try {
      // Get user data for normalizing comments
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : null;

      const projects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: convertTimestampToISO(data.createdAt),
          lastUpdate: convertTimestampToISO(data.lastUpdate),
          date: convertTimestampToISO(data.date),
          comments: (data.comments || []).map(comment => ({
            ...normalizeComment(comment, userData),
            createdAt: convertTimestampToISO(comment.createdAt)
          }))
        };
      });

      callback(projects);
    } catch (error) {
      console.error('Error processing projects:', error);
      callback([]);
    }
  }, (error) => {
    console.error('Error subscribing to projects:', error);
    callback([]);
  });
}

export async function updateProject(projectId, updates) {
  try {
    const projectRef = doc(db, 'projects', projectId);
    
    // If updating comments, ensure they all have required fields
    if (updates.comments) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      updates.comments = updates.comments.map(comment => normalizeComment(comment, userData));
    }

    const cleanedUpdates = cleanObject(updates);
    const updatesWithTimestamps = convertDatesToTimestamps({
      ...cleanedUpdates,
      lastUpdate: serverTimestamp()
    });

    await updateDoc(projectRef, updatesWithTimestamps);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId) {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function getVideographers() {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('userType', '==', 'videographer'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: convertTimestampToISO(data.createdAt)
    };
  });
}