import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, FileText, Calendar, DollarSign, User, Mail, MapPin, Clock, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QuoteResponseModal } from './QuoteResponseModal';
import { InfoRequestModal } from './InfoRequestModal';
import { CommentModal } from '../comments/CommentModal';
import ClientResponse from '../responses/ClientResponse';
import ReminderButton from '../reminders/ReminderButton';
import ReminderModal from '../reminders/ReminderModal';

export function QuoteDetailsModal({ project, onClose, onUpdateProject }) {
  const { user } = useAuth();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showInfoRequestModal, setShowInfoRequestModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleQuoteSubmit = (response) => {
    if (onUpdateProject) {
      onUpdateProject(project.id, {
        status: response.type === 'accept' ? 'quoted' :
                response.type === 'decline' ? 'declined' :
                'awaiting_info',
        lastMessage: response.message,
        lastUpdate: new Date().toISOString(),
        quotedPrice: response.quotedPrice,
        estimatedDuration: response.estimatedDuration,
        includedServices: response.includedServices
      });
      setShowQuoteModal(false);
      onClose();
    }
  };

  const handleQuoteResponse = (accepted) => {
    if (onUpdateProject) {
      onUpdateProject(project.id, {
        status: accepted ? 'accepted' : 'declined',
        lastMessage: accepted ? 'Quote accepted by client' : 'Quote declined by client',
        lastUpdate: new Date().toISOString()
      });
      onClose();
    }
  };

  const handleInfoRequest = (message) => {
    if (onUpdateProject) {
      onUpdateProject(project.id, {
        status: 'awaiting_info',
        lastMessage: message,
        lastUpdate: new Date().toISOString()
      });
      setShowInfoRequestModal(false);
      onClose();
    }
  };

  const handleAddComment = (comment) => {
    if (!user || !onUpdateProject) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: comment,
      createdAt: new Date().toISOString(),
      author: user.name,
      authorId: user.id
    };

    onUpdateProject(project.id, {
      comments: [...(project.comments || []), newComment],
      lastUpdate: new Date().toISOString()
    });
    setShowCommentModal(false);
  };

  const handleClientResponse = (response) => {
    if (!user || !onUpdateProject) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: response,
      createdAt: new Date().toISOString(),
      author: user.name,
      authorId: user.id
    };

    onUpdateProject(project.id, {
      comments: [...(project.comments || []), newComment],
      status: 'pending',
      lastMessage: response,
      lastUpdate: new Date().toISOString()
    });
  };

  const handleSendReminder = (message) => {
    if (!user || !onUpdateProject) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: message,
      createdAt: new Date().toISOString(),
      author: user.name,
      authorId: user.id,
      type: 'reminder'
    };

    onUpdateProject(project.id, {
      comments: [...(project.comments || []), newComment],
      lastMessage: message,
      lastUpdate: new Date().toISOString()
    });
  };

  // Sort messages by date, newest first
  const messages = [];

  // Add project creation
  messages.push({
    type: 'event',
    content: 'Project created',
    date: project.createdAt
  });

  // Add status changes and messages
  if (project.lastMessage) {
    messages.push({
      type: 'message',
      content: project.lastMessage,
      date: project.lastUpdate || project.createdAt
    });
  }

  // Add comments
  if (project.comments?.length) {
    project.comments.forEach(comment => {
      messages.push({
        type: comment.type || 'comment',
        content: comment.text,
        author: comment.author,
        date: comment.createdAt
      });
    });
  }

  // Sort by date, newest first
  messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const showReminderButton = user?.userType === 'videographer' && 
    (project.status === 'quoted' || project.status === 'awaiting_info');

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-[#2a2a2a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-[#2a2a2a] p-6 border-b border-gray-700 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{project.projectName}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                project.status === 'quoted' ? 'bg-purple-500/20 text-purple-300' :
                project.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                project.status === 'declined' ? 'bg-red-500/20 text-red-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Description
              </h3>
              <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-4">
                <p className="text-white">{project.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-4">
                Project Requirements
              </h3>
              <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Completion Date</p>
                        <p>{new Date(project.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <User className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Client Name</p>
                        <p>{project.clientName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Mail className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Client Email</p>
                        <p>{project.clientEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p>{project.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Required Services</p>
                  <div className="flex flex-wrap gap-2">
                    {project.deliverables.map((service) => (
                      <span
                        key={service}
                        className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {project.quotedPrice && (
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-400">Quoted Price</p>
                      <p>{project.quotedPrice}</p>
                    </div>
                  </div>
                )}

                {project.estimatedDuration && (
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-400">Estimated Duration</p>
                      <p>{project.estimatedDuration}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-4">
                Message History
              </h3>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.type === 'event' 
                        ? 'bg-blue-500/20 text-blue-300'
                        : message.type === 'reminder'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      {message.author && (
                        <span className="text-orange-400 font-medium">
                          {message.author}
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(message.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white">{message.content}</p>
                  </div>
                ))}
              </div>

              {showReminderButton && (
                <ReminderButton
                  lastUpdate={project.lastUpdate}
                  onSendReminder={() => setShowReminderModal(true)}
                />
              )}

              {user?.userType === 'client' && project.status === 'awaiting_info' && (
                <ClientResponse onSubmit={handleClientResponse} />
              )}
            </div>

            {user?.userType === 'videographer' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Prepare Quote
                </button>
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  Send Message
                </button>
              </div>
            )}

            {user?.userType === 'client' && project.status === 'quoted' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleQuoteResponse(true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept Quote
                </button>
                <button
                  onClick={() => handleQuoteResponse(false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Decline Quote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuoteModal && (
        <QuoteResponseModal
          project={project}
          onClose={() => setShowQuoteModal(false)}
          onSubmit={handleQuoteSubmit}
        />
      )}

      {showInfoRequestModal && (
        <InfoRequestModal
          onClose={() => setShowInfoRequestModal(false)}
          onSubmit={handleInfoRequest}
        />
      )}

      {showCommentModal && (
        <CommentModal
          onClose={() => setShowCommentModal(false)}
          onSubmit={handleAddComment}
        />
      )}

      {showReminderModal && (
        <ReminderModal
          projectName={project.projectName}
          status={project.status}
          onClose={() => setShowReminderModal(false)}
          onSubmit={handleSendReminder}
        />
      )}
    </>
  );
}

QuoteDetailsModal.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    clientEmail: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    quotedPrice: PropTypes.string,
    estimatedDuration: PropTypes.string,
    deliverables: PropTypes.arrayOf(PropTypes.string).isRequired,
    createdAt: PropTypes.string.isRequired,
    lastMessage: PropTypes.string,
    lastUpdate: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      type: PropTypes.string
    }))
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func
};