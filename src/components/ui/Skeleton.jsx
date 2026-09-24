import React from 'react';
import { cn } from '../../utils/formatters';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80",
        className
      )}
      {...props}
    />
  );
};

export const MedicineCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 bg-white/60 dark:bg-slate-900/60 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-28 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton className="w-full h-4" />
        </td>
      ))}
    </tr>
  );
};
