import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from './ProjectCard';
import { FolderPlus } from 'lucide-react';
import { DeleteProjectModal } from '../modals/DeleteProjectModal';
import { subscribeToProjects, updateProject, deleteProject } from '../../services/firebase';

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToProjects(
      user.id,
      user.userType,
      (updatedProjects) => {
        setProjects(updatedProjects);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleUpdateProject = async (projectId, updates) => {
    try {
      await updateProject(projectId, updates);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-orange-400 hover:text-orange-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-orange-500">
            {user?.userType === 'videographer' ? 'Quote Requests' : 'My Projects'}
          </h1>
          {user?.userType === 'videographer' && (
            <p className="text-gray-400 mt-2">
              Review and manage incoming project requests
            </p>
          )}
        </div>
        {user?.userType === 'client' && (
          <Link
            to="/quote-request"
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FolderPlus className="w-5 h-5 mr-2" />
            New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            {user?.userType === 'videographer' 
              ? 'No Quote Requests Yet'
              : 'No Projects Yet'
            }
          </h2>
          <p className="text-gray-400 mb-6">
            {user?.userType === 'videographer'
              ? 'New quote requests will appear here'
              : 'Create your first project to get started'
            }
          </p>
          {user?.userType === 'client' && (
            <Link
              to="/quote-request"
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={() => setProjectToDelete(project)}
            />
          ))}
        </div>
      )}

      {projectToDelete && (
        <DeleteProjectModal
          projectName={projectToDelete.projectName}
          onConfirm={handleDeleteProject}
          onClose={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
}

export default Projects;