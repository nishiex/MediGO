import React from 'react';
import { cn } from '../../utils/formatters';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  options = [],
  children,
  required,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-xl border bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none backdrop-blur-sm cursor-pointer",
            "border-slate-200 dark:border-slate-800 shadow-sm",
            "focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white dark:focus:bg-slate-900",
            "disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        >
          {children || options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <p className="text-xs text-rose-500 font-medium animate-fadeIn">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
