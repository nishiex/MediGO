import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { 
  Pill, 
  Search, 
  User, 
  Store, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  ClipboardList, 
  LayoutDashboard, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                Medi<span className="text-teal-600 dark:text-teal-400">Go</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                Live Stock & Rx
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/medicines"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/medicines') 
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Medicine
            </Link>

            {/* Role specific quick link */}
            {role === 'user' && (
              <Link
                to="/user/reservations"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/user/reservations') 
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                My Passes
              </Link>
            )}

            {role === 'pharmacy' && (
              <Link
                to="/pharmacy/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/pharmacy/dashboard') 
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                Pharmacy Portal
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/admin/dashboard') 
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    role === 'pharmacy' 
                      ? '/pharmacy/dashboard' 
                      : role === 'admin' 
                      ? '/admin/dashboard' 
                      : '/user/dashboard'
                  }
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-teal-500/50 transition-all text-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">
                      {role}
                    </span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/medicines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Find Medicine
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                to={
                  role === 'pharmacy' 
                    ? '/pharmacy/dashboard' 
                    : role === 'admin' 
                    ? '/admin/dashboard' 
                    : '/user/dashboard'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
              >
                Go to Dashboard ({role})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">Register Account</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
