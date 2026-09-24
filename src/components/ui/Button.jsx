import React from 'react';
import { cn } from '../../utils/formatters';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

  const variants = {
    primary: "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 focus:ring-teal-500 border border-transparent",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20 focus:ring-slate-700 border border-slate-800",
    outline: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:ring-teal-500",
    ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 focus:ring-slate-400",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500",
    subtle: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200/50 dark:border-teal-800/40"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5 font-semibold",
    icon: "p-2.5 rounded-xl"
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
