import { useState } from 'react';
import PropTypes from 'prop-types';
import { Clock, Calendar, DollarSign, User, MessageCircle, Trash2, MessageSquare, Eye, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QuoteResponseModal } from '../quotes/QuoteResponseModal';
import { QuoteDetailsModal } from '../quotes/QuoteDetailsModal';
import { CommentModal } from '../comments/CommentModal';
import MessageHistory from './MessageHistory';
import UnreadBadge from '../messages/UnreadBadge';

function ProjectCard({ project, onUpdateProject, onDeleteProject }) {
  const [showResponse, setShowResponse] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { user } = useAuth();

  // Calculate unread messages that are intended for the current user
  const unreadCount = project.comments?.filter(comment => {
    // Skip if the current user is the author
    if (comment.authorId === user?.id) return false;
    
    // For videographer messages, only show unread badge to client
    if (comment.authorType === 'videographer' && user?.userType === 'client') {
      return !comment.readBy?.includes(user?.id);
    }
    
    // For client messages, only show unread badge to videographer
    if (comment.authorType === 'client' && user?.userType === 'videographer') {
      return !comment.readBy?.includes(user?.id);
    }
    
    return false;
  }).length || 0;

  const handleResponse = (response) => {
    if (!user) return;

    const updates = {
      status: response.type === 'accept' ? 'quoted' :
              response.type === 'decline' ? 'declined' :
              'awaiting_info',
      lastMessage: response.message,
      lastUpdate: new Date().toISOString(),
      quotedPrice: response.quotedPrice,
      estimatedDuration: response.estimatedDuration,
      includedServices: response.includedServices
    };
    
    onUpdateProject(project.id, updates);
    setShowResponse(false);
  };

  const handleAddComment = (comment) => {
    if (!user) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: comment,
      createdAt: new Date().toISOString(),
      author: user.name,
      authorId: user.id,
      authorType: user.userType,
      readBy: [user.id]
    };

    onUpdateProject(project.id, {
      comments: [...(project.comments || []), newComment],
      lastUpdate: new Date().toISOString()
    });
    setShowCommentModal(false);
  };

  const handleOpenMessages = () => {
    // Mark all messages as read when opening
    if (unreadCount > 0) {
      const updatedComments = project.comments.map(comment => ({
        ...comment,
        readBy: [...new Set([...(comment.readBy || []), user.id])]
      }));
      
      onUpdateProject(project.id, {
        comments: updatedComments
      });
    }
    setShowMessages(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'quoted':
        return 'bg-purple-500/20 text-purple-300';
      case 'accepted':
        return 'bg-green-500/20 text-green-300';
      case 'declined':
        return 'bg-red-500/20 text-red-300';
      case 'awaiting_info':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'awaiting_info':
        return 'Awaiting Response';
      case 'quoted':
        return 'Quote Sent';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <>
      <div className="bg-[#2a2a2a] rounded-lg p-6 hover:bg-[#333] transition-colors group relative">
        <UnreadBadge count={unreadCount} />
        
        <div className="flex justify-between items-start mb-4">
          <h3 
            className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors cursor-pointer"
            onClick={() => setShowDetails(true)}
          >
            {project.projectName}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            <button
              onClick={onDeleteProject}
              className="text-gray-400 hover:text-red-400 transition-colors p-1"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          className="cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(project.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2" />
                <span>{project.clientName}</span>
              </div>
            </div>
            <div className="space-y-2">
              {project.quotedPrice && (
                <div className="flex items-center text-gray-300">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{project.quotedPrice}</span>
                </div>
              )}
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <span>{project.estimatedDuration || project.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(project.includedServices || project.deliverables).map((service) => (
              <span
                key={service}
                className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <MessageHistory 
          messages={project}
          showMessages={showMessages}
          setShowMessages={handleOpenMessages}
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {user?.userType === 'videographer' && project.status === 'pending' && (
            <button
              onClick={() => setShowResponse(true)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Prepare Quote
            </button>
          )}

          {user?.userType === 'client' && (
            <>
              {project.status === 'quoted' && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Quote
                </button>
              )}
              {project.status === 'awaiting_info' && (
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Respond
                </button>
              )}
              <button
                onClick={() => setShowCommentModal(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Comment
              </button>
            </>
          )}
        </div>
      </div>

      {showResponse && (
        <QuoteResponseModal
          project={project}
          onClose={() => setShowResponse(false)}
          onSubmit={handleResponse}
        />
      )}

      {showDetails && (
        <QuoteDetailsModal
          project={project}
          onClose={() => setShowDetails(false)}
          onUpdateProject={onUpdateProject}
        />
      )}

      {showCommentModal && (
        <CommentModal
          onClose={() => setShowCommentModal(false)}
          onSubmit={handleAddComment}
        />
      )}
    </>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    quotedPrice: PropTypes.string,
    estimatedDuration: PropTypes.string,
    location: PropTypes.string,
    includedServices: PropTypes.arrayOf(PropTypes.string),
    deliverables: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      authorId: PropTypes.string.isRequired,
      authorType: PropTypes.string.isRequired,
      readBy: PropTypes.arrayOf(PropTypes.string)
    }))
  }).isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired
};

export default ProjectCard;