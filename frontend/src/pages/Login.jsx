import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Search, Heart } from 'lucide-react';
import { authAPI } from '../services/api';
import { login } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await authAPI.login(email.trim().toLowerCase(), password, role);
      const { token, user } = response.data;

      // Verify the returned user role matches the selected role
      if (user.role !== role) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      // Dispatch to Redux store
      dispatch(login({ token, user }));

      // Navigate based on role
      const dashboardPath = user.role === 'tenant' ? '/tenant' : 
                           user.role === 'landlord' ? '/landlord' : '/admin';
      
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <main className="auth-page min-h-[calc(100vh-72px)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 lg:min-h-[650px] lg:grid-cols-2">
        <section className="auth-visual relative hidden flex-col justify-between p-10 text-white lg:flex xl:p-14">
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tight text-white">RoomDekho<span className="text-amber-300">.</span></Link>
            <p className="mt-20 max-w-md text-4xl font-bold leading-tight xl:text-5xl">Find a place that feels like yours.</p>
            <p className="mt-5 max-w-md leading-7 text-slate-200">Thoughtful room discovery, verified listings, and an easier move—right here in RoomDekho.</p>
          </div>
          <div className="relative z-10 grid gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><ShieldCheck className="h-5 w-5 text-emerald-300" /><span className="text-sm font-medium">Explore verified listings</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><Search className="h-5 w-5 text-amber-300" /><span className="text-sm font-medium">Find a room that fits your life</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><Heart className="h-5 w-5 text-rose-300" /><span className="text-sm font-medium">Save and compare your favorites</span></div>
          </div>
        </section>
        <section className="flex items-center justify-center p-5 sm:p-10">
          <div className="auth-panel w-full max-w-md rounded-2xl p-6 sm:border-0 sm:p-2 sm:shadow-none">
            <Link to="/" className="mb-8 inline-block text-xl font-black tracking-tight text-slate-900 lg:hidden">RoomDekho<span className="text-amber-500">.</span></Link>
            <div className="mb-8">
              <p className="section-kicker mb-2">Welcome back</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to RoomDekho</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">Pick up where you left off and find your next home.</p>
            </div>
            {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-4 text-sm" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-12 text-sm" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-slate-700">Sign in as</legend>
                <div className="grid grid-cols-3 gap-2">
                  {['tenant', 'landlord', 'admin'].map((r) => (
                    <label key={r} className="role-option flex cursor-pointer items-center justify-center rounded-xl border p-2.5 text-xs font-semibold capitalize transition-colors sm:text-sm">
                      <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={loading} className="primary-btn w-full py-3 text-base">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-600">New to RoomDekho? <Link to="/register" className="font-bold text-amber-700 hover:underline">Create an account</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;