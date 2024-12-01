import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/navigation/Sidebar';
import QuoteRequest from './components/forms/QuoteRequest';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Projects from './components/projects/Projects';
import Settings from './components/settings/Settings';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <Routes>
          <Route path="/" element={<PrivateRoute><Projects /></PrivateRoute>} />
          <Route path="/quote-request" element={<PrivateRoute><QuoteRequest /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;