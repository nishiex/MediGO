import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, User, Store, Shield, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { resetMockDB } from '../../api/mockData';
import { useNavigate } from 'react-router-dom';

export const DemoSwitcher = () => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRoleSwitch = (targetRole, targetUrl) => {
    switchDemoRole(targetRole);
    toast({
      title: `Switched to ${targetRole.toUpperCase()} Mode`,
      description: `Logged in as demo ${targetRole}.`,
      type: 'info'
    });
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const handleResetData = () => {
    resetMockDB();
    toast({
      title: 'Database Reset',
      description: 'Mock data restored to original seed values.',
      type: 'success'
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Pill Trigger */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-2 flex flex-col gap-2 transition-all duration-300">
        <div className="flex items-center justify-between px-2 gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Demo Role Switcher</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {role || 'Guest'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-xs animate-fadeIn">
            {/* User switch */}
            <button
              onClick={() => handleRoleSwitch('user', '/user/dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                role === 'user' ? 'bg-teal-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              <div>
                <div className="font-semibold leading-tight">Patient / User</div>
                <div className="text-[10px] opacity-75">Search & reserve medicines</div>
              </div>
            </button>

            {/* Pharmacy switch */}
            <button
              onClick={() => handleRoleSwitch('pharmacy', '/pharmacy/dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                role === 'pharmacy' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Store className="w-4 h-4" />
              <div>
                <div className="font-semibold leading-tight">Medical / Pharmacy</div>
                <div className="text-[10px] opacity-75">Inventory & reservation queue</div>
              </div>
            </button>

            {/* Admin switch */}
            <button
              onClick={() => handleRoleSwitch('admin', '/admin/dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                role === 'admin' ? 'bg-purple-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <div>
                <div className="font-semibold leading-tight">Super Admin</div>
                <div className="text-[10px] opacity-75">Audit pharmacies & platform stats</div>
              </div>
            </button>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between px-1">
              <button
                onClick={handleResetData}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 transition-colors py-1"
                title="Reset mock database to initial data"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Mock DB
              </button>

              {user && (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
