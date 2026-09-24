import React from 'react';
import { cn } from '../../utils/formatters';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors select-none";

  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700",
    primary: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60",
    blue: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60"
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-teal-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    purple: "bg-purple-500",
    blue: "bg-sky-500"
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 rounded-md gap-1.5",
    md: "text-xs px-2.5 py-1 rounded-full gap-1.5",
    lg: "text-sm px-3.5 py-1.5 rounded-full gap-2 font-medium"
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
