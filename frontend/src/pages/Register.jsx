import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create an Account</h1>
        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Username"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
            placeholder="johndoe"
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            placeholder="Min. 6 characters"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
