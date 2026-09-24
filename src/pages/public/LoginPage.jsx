import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Pill, User, Store, Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'pharmacy' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preset demo credentials for quick fill
  const demoAccounts = {
    user: { email: 'user@medigo.com', password: 'password123', label: 'Patient Demo' },
    pharmacy: { email: 'pharmacy@medigo.com', password: 'password123', label: 'Medical Store Demo' },
    admin: { email: 'admin@medigo.com', password: 'password123', label: 'Admin Demo' }
  };

  const handleQuickFill = (roleType) => {
    setActiveTab(roleType);
    setEmail(demoAccounts[roleType].email);
    setPassword(demoAccounts[roleType].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login({ email, password });
      toast({
        title: `Welcome back, ${res.user.name}!`,
        description: `Logged in as ${res.user.role}.`,
        type: 'success'
      });

      // Redirect to appropriate dashboard or previously visited URL
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'pharmacy') {
        navigate('/pharmacy/dashboard', { replace: true });
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-2xl shadow-teal-500/10 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/25">
            <Pill className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign in to MediGo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your account type or click a quick-fill demo button below
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('user'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
              activeTab === 'user' 
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('pharmacy'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
              activeTab === 'pharmacy' 
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Medical</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
              activeTab === 'admin' 
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Demo Autofill Bar */}
        <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Fill Demo Credentials:</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickFill(activeTab)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Fill {demoAccounts[activeTab].label}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder={activeTab === 'pharmacy' ? 'pharmacy@medigo.com' : 'user@medigo.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to {activeTab === 'pharmacy' ? 'Pharmacy Portal' : activeTab === 'admin' ? 'Admin Console' : 'Patient Account'}
          </Button>
        </form>

        {/* Register CTA */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to={`/register?type=${activeTab}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
            Register as a {activeTab === 'pharmacy' ? 'Medical Store' : 'Patient'}
          </Link>
        </div>
      </div>
    </div>
  );
};
