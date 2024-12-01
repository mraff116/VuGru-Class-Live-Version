export const STORAGE_KEYS = {
  USERS: 'vugru_users',
  CURRENT_USER: 'vugru_current_user',
  PROJECTS: 'vugru_projects'
};

export function getStoredUsers() {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting stored users:', error);
    return [];
  }
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function storeUser(userData) {
  try {
    const users = getStoredUsers();
    const existingUserIndex = users.findIndex(u => u.email === userData.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userData;
    } else {
      users.push(userData);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error storing user:', error);
    throw new Error('Failed to store user data');
  }
}

export function setCurrentUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
    throw new Error('Failed to set current user');
  }
}

export function removeCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}