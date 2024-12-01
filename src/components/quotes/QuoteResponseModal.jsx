import { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, MessageCircle, DollarSign } from 'lucide-react';
import { InfoRequestModal } from './InfoRequestModal';

export function QuoteResponseModal({ project, onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [includedServices, setIncludedServices] = useState(project.deliverables);
  const [showInfoRequest, setShowInfoRequest] = useState(false);

  const handleSubmit = (type) => {
    if (type === 'info') {
      setShowInfoRequest(true);
      return;
    }

    onSubmit({
      type,
      message,
      quotedPrice: type === 'accept' ? quotedPrice : undefined,
      estimatedDuration: type === 'accept' ? estimatedDuration : undefined,
      includedServices: type === 'accept' ? includedServices : undefined,
    });
  };

  const handleInfoRequest = (infoMessage) => {
    onSubmit({
      type: 'info',
      message: infoMessage,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-lg w-full">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
            Prepare Quote Response
          </h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-2">{project.projectName}</h4>
            <p className="text-gray-400">{project.description}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-orange-400 text-sm font-medium mb-2">
                  Quoted Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Enter your quote amount"
                    className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-orange-400 text-sm font-medium mb-2">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g., 2-3 weeks"
                  className="w-full bg-[#333] text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-orange-400 text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add details about your quote or included services..."
                  className="w-full bg-[#333] text-white rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('accept')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Send Quote
              </button>
              <button
                onClick={() => handleSubmit('decline')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Decline
              </button>
              <button
                onClick={() => setShowInfoRequest(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Request Info
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-gray-400 hover:text-white transition-colors w-full"
          >
            Cancel
          </button>
        </div>
      </div>

      {showInfoRequest && (
        <InfoRequestModal
          onClose={() => setShowInfoRequest(false)}
          onSubmit={handleInfoRequest}
        />
      )}
    </>
  );
}

QuoteResponseModal.propTypes = {
  project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    deliverables: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};