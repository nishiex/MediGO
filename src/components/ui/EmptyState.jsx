import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No data found",
  description = "There are no records matching your current filter or request.",
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className || ''}`}>
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="subtle" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
