import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Send } from 'lucide-react';

export function InfoRequestModal({ onClose, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-orange-500">
            Request Additional Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-orange-400 text-sm font-medium mb-2">
              What additional information do you need?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please specify what additional details you need from the client..."
              className="w-full bg-[#333] text-white rounded-lg p-4 min-h-[160px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

InfoRequestModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};