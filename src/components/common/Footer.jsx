import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Medi<span className="text-teal-600 dark:text-teal-400">Go</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time medicine inventory discovery and 0-waiting digital counter pickup network for modern healthcare consumers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Pharmacy Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/medicines" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Search Medicines
                </Link>
              </li>
              <li>
                <Link to="/medicines?category=Antibiotics" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Antibiotics & Rx
                </Link>
              </li>
              <li>
                <Link to="/medicines?category=Chronic+Care" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Chronic Care
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Partner Pharmacy Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              For Pharmacies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/register?type=pharmacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Register as Pharmacy Partner
                </Link>
              </li>
              <li>
                <Link to="/pharmacy/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Live Stock Management
                </Link>
              </li>
              <li>
                <Link to="/pharmacy/reservations" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Counter Pickup Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Healthcare Helpline
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>24/7 Hotline: 1800-MEDIGO-HELP</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-500" />
                <span>support@medigo.health</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-500" />
                <span>Coverage in Mumbai, Delhi & Bangalore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MediGo Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for frictionless healthcare.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
