import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ShieldCheck, ChevronRight, Pill } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, getAvailabilityBadge } from '../../utils/formatters';

export const MedicineCard = ({
  medicine,
  onReserve,
  highlightStore = null
}) => {
  const badge = getAvailabilityBadge(medicine.stock);
  const displayPharmacy = highlightStore || medicine.pharmacy;

  return (
    <div className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="purple" size="sm">
            {medicine.category}
          </Badge>
          <Badge variant={badge.variant} size="sm" dot>
            {badge.label} ({medicine.stock})
          </Badge>
        </div>

        {/* Medicine Name & Generic */}
        <Link to={`/medicines/${medicine.id}`} className="block group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-teal-500 shrink-0" />
            <span className="line-clamp-1">{medicine.name}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {medicine.genericName} • {medicine.dosage}
          </p>
        </Link>

        {/* Prescription Tag & Description */}
        <div className="mt-3 flex items-center gap-2">
          {medicine.requiresPrescription ? (
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Rx Required
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
              OTC (Over the Counter)
            </span>
          )}
        </div>

        {/* Pharmacy Info if attached */}
        {displayPharmacy && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{displayPharmacy.name}</span>
            </div>
            {displayPharmacy.distance && (
              <div className="flex items-center gap-1 text-slate-500 shrink-0">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{displayPharmacy.distance}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Price & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 dark:text-slate-500 block">Price</span>
          <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
            {formatCurrency(medicine.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/medicines/${medicine.id}`}>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </Link>
          <Button
            size="sm"
            variant={medicine.stock > 0 ? 'primary' : 'outline'}
            disabled={medicine.stock <= 0}
            onClick={() => onReserve && onReserve(medicine)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            {medicine.stock > 0 ? 'Reserve' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};
