import PropTypes from 'prop-types';
import { AlertTriangle, Trash2 } from 'lucide-react';

function DeleteAccountModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h3 className="text-2xl font-semibold text-white text-center mb-2">
          Delete Account?
        </h3>
        
        <p className="text-gray-400 text-center mb-6">
          This action cannot be undone. All your data will be permanently deleted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteAccountModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DeleteAccountModal;