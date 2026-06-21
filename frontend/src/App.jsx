import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import PropertyDetail from './pages/PropertyDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateProperty /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
