import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Pill, User, Store, Lock, Mail, Phone, MapPin, FileText, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'pharmacy' ? 'pharmacy' : 'user';

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  // Pharmacy extra fields
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all required fields.');
      return;
    }

    if (role === 'pharmacy' && (!pharmacyName || !licenseNumber)) {
      setError('Pharmacy name and Drug License Number are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        address,
        role,
        ...(role === 'pharmacy' ? { pharmacyName, licenseNumber } : {})
      };

      const res = await register(payload);
      toast({
        title: 'Account Created Successfully!',
        description: `Welcome to MediGo, ${res.user.name}.`,
        type: 'success'
      });

      if (res.user.role === 'pharmacy') {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-2xl shadow-teal-500/10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/25">
            <Pill className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create your MediGo Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join India's real-time medicine availability & pickup network
          </p>
        </div>

        {/* Account Type Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              role === 'user' 
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient / Individual</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('pharmacy')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              role === 'pharmacy' 
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Medical / Pharmacy</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={role === 'pharmacy' ? "Owner / Manager Name" : "Full Name"}
              required
              placeholder="e.g. Sairaj Rawool"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          {/* Pharmacy specific fields */}
          {role === 'pharmacy' && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Pharmacy Verification Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Pharmacy Store Name"
                  required
                  placeholder="e.g. Apollo 24/7 Bandra"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  leftIcon={<Store className="w-4 h-4" />}
                />
                <Input
                  label="Drug License Number"
                  required
                  placeholder="e.g. MH-MZ2-109283"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  leftIcon={<FileText className="w-4 h-4" />}
                />
              </div>
            </div>
          )}

          <Textarea
            label={role === 'pharmacy' ? "Store Street Address & Area" : "Delivery / Home Address"}
            placeholder="e.g. 14/B, Hill Road, Bandra West, Mumbai"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
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
            Create {role === 'pharmacy' ? 'Pharmacy Partner Account' : 'Patient Account'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
