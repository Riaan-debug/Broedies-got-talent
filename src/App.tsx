import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AudienceVoting from './pages/AudienceVoting';
import DisplayScreen from './pages/DisplayScreen';
import ActRegistration from './pages/ActRegistration';
import LandingPage from './pages/LandingPage';

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-theatrical flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-secondary-200 font-semibold">🎭 Loading the show...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-theatrical flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-sparkle">🚫</div>
          <h1 className="text-3xl font-bold text-secondary-200 mb-2 text-glow">Access Denied</h1>
          <p className="text-secondary-300 mb-4 font-semibold">You need admin privileges to access this page.</p>
          <a
            href="/"
            className="btn-spotlight"
          >
            🎭 Go to Main Page
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/vote" element={<AudienceVoting />} />
            <Route path="/display" element={<DisplayScreen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<ActRegistration />} />
            
            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

