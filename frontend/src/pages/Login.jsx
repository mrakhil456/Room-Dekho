import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authAPI } from '../services/api';
import { login } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    if (!role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending login request with role:', role);
      const response = await authAPI.login(email.trim().toLowerCase(), password, role);
      const { token, user } = response.data;

      console.log('Login successful:', { token, user, userRole: user.role });

      // Verify the returned user role matches the selected role
      if (user.role !== role) {
        console.warn('User role mismatch! Selected:', role, 'Received:', user.role);
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      // Dispatch to Redux store
      dispatch(login({ token, user }));

      // Navigate based on role
      const dashboardPath = user.role === 'tenant' ? '/tenant' : 
                           user.role === 'landlord' ? '/landlord' : '/admin';
      
      console.log('Navigating to:', dashboardPath);
      
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 0);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="tenant@example.com"
              />
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="password123"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">Login as</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {['tenant', 'landlord', 'admin'].map((r) => (
                <label key={r} className="flex flex-col items-center space-y-1 p-2 sm:p-3 border-2 rounded-xl cursor-pointer hover:border-blue-300 transition-all group">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 border-2 rounded-full peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all"></div>
                  <span className="font-medium text-xs sm:text-sm capitalize">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`primary-btn w-full py-2 sm:py-3 text-base sm:text-lg font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;