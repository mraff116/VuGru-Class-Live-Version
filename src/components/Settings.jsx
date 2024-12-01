import { useForm } from 'react-hook-form';
import { User, Mail, Building, Phone, Download } from 'lucide-react';
import { exportProject } from '../utils/exportProject';
import PropTypes from 'prop-types';

function Settings() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleExport = () => {
    const success = exportProject();
    if (!success) {
      console.error('Failed to export project');
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
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Your name"
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
                className="w-full bg-[#333] text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Your email"
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

        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

Settings.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string
  })
};

export default Settings;