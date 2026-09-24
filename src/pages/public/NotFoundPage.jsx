import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Pill, Home, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-lg">
          <Pill className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            404
          </h1>
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-1">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            The page or medicine link you requested does not exist or has been relocated.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
          <Link to="/medicines">
            <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
              Find Medicines
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
