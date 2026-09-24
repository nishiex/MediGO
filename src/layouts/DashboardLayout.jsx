import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DemoSwitcher } from '../components/common/DemoSwitcher';
import { Button } from '../components/ui/Button';
import { 
  Pill, 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  PlusCircle, 
  Clock, 
  Users, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ChevronRight, 
  Bell, 
  CheckCircle2 
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/pharmacy/dashboard' || path === '/admin/dashboard' || path === '/user/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Define sidebar navigation items based on role
  let navItems = [];

  if (role === 'user') {
    navItems = [
      { label: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
      { label: 'My Reservations', path: '/user/reservations', icon: ClipboardList },
      { label: 'Search Medicines', path: '/medicines', icon: Search }
    ];
  } else if (role === 'pharmacy') {
    navItems = [
      { label: 'Pharmacy Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard },
      { label: 'Medicine Inventory', path: '/pharmacy/medicines', icon: Package },
      { label: 'Add New Medicine', path: '/pharmacy/medicines/new', icon: PlusCircle },
      { label: 'Reservation Queue', path: '/pharmacy/reservations', icon: Clock }
    ];
  } else if (role === 'admin') {
    navItems = [
      { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Pharmacies', path: '/admin/pharmacies', icon: Store },
      { label: 'Global Inventory', path: '/admin/medicines', icon: Package },
      { label: 'All Reservations', path: '/admin/reservations', icon: ClipboardList },
      { label: 'Users Directory', path: '/admin/users', icon: Users }
    ];
  }

  const roleColors = {
    user: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
    pharmacy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  Medi<span className="text-teal-600 dark:text-teal-400">Go</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  {role} Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User badge */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Authorized User'}
              </p>
              <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border mt-0.5 ${roleColors[role] || roleColors.user}`}>
                {role}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            Back to Public Site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{role}</span>
              <span>/</span>
              <span className="capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/medicines">
              <Button variant="outline" size="sm" leftIcon={<Search className="w-3.5 h-3.5" />}>
                Find Medicines
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <DemoSwitcher />
    </div>
  );
};
