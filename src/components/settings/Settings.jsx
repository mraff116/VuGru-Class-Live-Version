import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Building, Phone, Download, Trash2, CheckCircle } from 'lucide-react';
import { exportProject } from '../../utils/exportProject';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, deleteUserAccount } from '../../services/firebase';
import DeleteAccountModal from '../modals/DeleteAccountModal';

function Settings() {
  const { user, logout } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [password, setPassword] = useState('');
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUserProfile(user.id, {
        company: data.company,
        phone: data.phone
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleExport = () => {
    const success = exportProject();
    if (!success) {
      console.error('Failed to export project');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError('');
      await deleteUserAccount(password);
      await logout();
    } catch (error) {
      setDeleteError('Failed to delete account. Please check your password and try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Settings</h1>
        <button
          onClick={handleExport}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Project
        </button>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center text-green-300">
          <CheckCircle className="w-5 h-5 mr-2" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-orange-400 text-lg mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                {...register('name')}
                type="text"
                disabled
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-orange-400 text-lg mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                disabled
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-orange-400 text-lg mb-2">
              Company Name
            </label>
            <div className="relative">
              <input
                {...register('company')}
                type="text"
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Your company"
              />
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-orange-400 text-lg mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                {...register('phone')}
                type="tel"
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Your phone"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Account
          </button>
        </div>
      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-white text-center mb-6">
              Confirm Account Deletion
            </h3>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
                {deleteError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-orange-400 text-sm font-medium mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#333] text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={!password.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;