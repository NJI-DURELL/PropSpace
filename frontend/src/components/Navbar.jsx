import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-tight">PropSpace</Link>
      <div className="flex gap-4 items-center text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">My Listings</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/create" className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-50">
              + Add Property
            </Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-50">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
