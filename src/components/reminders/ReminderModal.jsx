import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Send } from 'lucide-react';

function ReminderModal({ projectName, status, onClose, onSubmit }) {
  const [message, setMessage] = useState(
    status === 'quoted' 
      ? `Hi, I noticed you haven't responded to the quote for "${projectName}" yet. Would you like to review it and let me know if you'd like to proceed?`
      : `Hi, I'm following up on the project "${projectName}". Could you please provide the requested information so we can move forward?`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-yellow-500">
            Send Reminder
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-400 text-sm font-medium mb-2">
              Reminder Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#333] text-white rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Reminder
          </button>
        </form>
      </div>
    </div>
  );
}

ReminderModal.propTypes = {
  projectName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ReminderModal;