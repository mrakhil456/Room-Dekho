import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Search, Heart } from 'lucide-react';
import { authAPI } from '../services/api';
import { login } from '../store/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(name, email, password, role);
      const { token, user } = response.data;

      // Dispatch to Redux store
      dispatch(login({ token, user }));

      // Navigate based on role
      const dashboardPath = user.role === 'tenant' ? '/tenant' : 
                           user.role === 'landlord' ? '/landlord' : '/admin';
      navigate(dashboardPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page min-h-[calc(100vh-72px)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:min-h-[700px] lg:grid-cols-2">
        <section className="auth-visual relative hidden flex-col justify-between p-10 text-white lg:flex xl:p-14">
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tight text-white">RoomDekho<span className="text-amber-300">.</span></Link>
            <p className="mt-20 max-w-md text-4xl font-bold leading-tight xl:text-5xl">A better place to begin your next chapter.</p>
            <p className="mt-5 max-w-md leading-7 text-slate-200">Join a community making room-finding clearer, simpler, and more personal.</p>
          </div>
          <div className="relative z-10 grid gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><ShieldCheck className="h-5 w-5 text-emerald-300" /><span className="text-sm font-medium">Browse verified rooms</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><Search className="h-5 w-5 text-amber-300" /><span className="text-sm font-medium">Explore places that fit your budget</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 p-3"><Heart className="h-5 w-5 text-rose-300" /><span className="text-sm font-medium">Keep your favorite rooms together</span></div>
          </div>
        </section>
        <section className="flex items-center justify-center p-5 sm:p-10">
          <div className="auth-panel w-full max-w-md rounded-2xl p-6 sm:border-0 sm:p-2 sm:shadow-none">
            <Link to="/" className="mb-7 inline-block text-xl font-black tracking-tight text-slate-900 lg:hidden">RoomDekho<span className="text-amber-500">.</span></Link>
            <div className="mb-7">
              <p className="section-kicker mb-2">Join RoomDekho</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">Create your RoomDekho account and find your next home.</p>
            </div>
            {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Full name</label>
                <div className="relative"><User aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-4 text-sm" placeholder="Your name" /></div>
              </div>
              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email address</label>
                <div className="relative"><Mail aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-4 text-sm" placeholder="you@example.com" /></div>
              </div>
              <div>
                <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative"><Lock aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-12 text-sm" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <div>
                <label htmlFor="register-confirm-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm password</label>
                <div className="relative"><Lock aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="register-confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input w-full rounded-xl border py-3 pl-11 pr-12 text-sm" placeholder="Repeat your password" /><button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-slate-700">I am joining as a</legend>
                <div className="grid grid-cols-2 gap-2">
                  {['tenant', 'landlord'].map((r) => (
                    <label key={r} className="role-option flex cursor-pointer items-center justify-center rounded-xl border p-2.5 text-sm font-semibold capitalize transition-colors">
                      <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={loading} className="primary-btn w-full py-3 text-base">
                {loading ? 'Creating account…' : 'Create account'}
                {!loading && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-bold text-amber-700 hover:underline">Sign in</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
