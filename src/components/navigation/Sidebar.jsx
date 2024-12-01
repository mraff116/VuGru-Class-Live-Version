import { Link } from 'react-router-dom';
import { FolderOpen, Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-[#2a2a2a] fixed top-0 left-0 h-screen flex flex-col">
      <div className="p-6 flex-1 flex flex-col h-full overflow-hidden">
        <Link to="/" className="flex items-center mb-12">
          <Camera className="text-blue-500 w-8 h-8" />
          <span className="text-white text-2xl ml-2 font-bold">VuGru</span>
        </Link>

        <Link
          to="/quote-request"
          className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-3 rounded-lg mb-8 text-center hover:opacity-90 transition-opacity"
        >
          Create Project +
        </Link>

        <nav className="flex-1 space-y-4">
          <Link
            to="/"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <FolderOpen className="w-6 h-6 mr-3" />
            Projects
          </Link>

          <Link
            to="/settings"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <Settings className="w-6 h-6 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="pt-6 border-t border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400 capitalize">{user?.userType}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center text-gray-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-6 h-6 mr-3" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    userType: PropTypes.oneOf(['videographer', 'client'])
  })
};

export default Sidebar;