import PropTypes from 'prop-types';
import Collapsible from '../common/Collapsible';

function MessageHistory({ messages, showMessages, setShowMessages }) {
  // Sort messages by date, newest first
  const sortedMessages = [];

  // Add project creation
  sortedMessages.push({
    type: 'event',
    content: 'Project created',
    date: messages.createdAt
  });

  // Add status changes and messages
  if (messages.lastMessage) {
    sortedMessages.push({
      type: 'message',
      content: messages.lastMessage,
      date: messages.lastUpdate || messages.createdAt
    });
  }

  // Add comments
  if (messages.comments?.length) {
    messages.comments.forEach(comment => {
      sortedMessages.push({
        type: 'comment',
        content: comment.text,
        author: comment.author,
        date: comment.createdAt
      });
    });
  }

  // Sort by date, newest first
  sortedMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Collapsible
      title="Messages"
      preview={sortedMessages[0]?.content}
      defaultOpen={showMessages}
      className="mb-4"
      headerClassName="p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
      onChange={setShowMessages}
    >
      {sortedMessages.map((message, index) => (
        <div 
          key={index}
          className={`p-3 rounded-lg ${
            message.type === 'event' 
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-[#1a1a1a]'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            {message.author && (
              <span className="text-orange-400 text-sm font-medium">
                {message.author}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(message.date).toLocaleString()}
            </span>
          </div>
          <p className="text-white">{message.content}</p>
        </div>
      ))}
    </Collapsible>
  );
}

MessageHistory.propTypes = {
  messages: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    lastMessage: PropTypes.string,
    lastUpdate: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    }))
  }).isRequired,
  showMessages: PropTypes.bool.isRequired,
  setShowMessages: PropTypes.func.isRequired
};

export default MessageHistory;