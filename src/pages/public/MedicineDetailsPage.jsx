import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicineApi } from '../../api/medicineApi';
import { ReservationModal } from '../../components/common/ReservationModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Pill, 
  Building2, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Phone, 
  AlertTriangle, 
  ChevronLeft, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { formatCurrency, getAvailabilityBadge } from '../../utils/formatters';

export const MedicineDetailsPage = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await medicineApi.getMedicineById(id);
      setMedicine(res.medicine);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch medicine details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleOpenReserve = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsReserveModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="w-40 h-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Medicine Not Found"
          description={error || "The medicine details you requested are not available."}
          actionLabel="Back to Search"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const primaryBadge = getAvailabilityBadge(medicine.stock);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Back */}
      <div>
        <Link to="/medicines" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Medicine Catalog
        </Link>
      </div>

      {/* Main Medicine Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="md">{medicine.category}</Badge>
              <Badge variant={primaryBadge.variant} size="md" dot>{primaryBadge.label}</Badge>
            </div>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {formatCurrency(medicine.price)}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Pill className="w-8 h-8 text-teal-500 shrink-0" />
              {medicine.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Generic Name: <span className="text-slate-800 dark:text-slate-200">{medicine.genericName}</span> • Dosage: <span className="text-slate-800 dark:text-slate-200">{medicine.dosage}</span>
            </p>
          </div>

          {/* Rx requirement */}
          {medicine.requiresPrescription ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm mb-0.5">Doctor Prescription Required (Rx)</strong>
                This medicine falls under Schedule H / Prescription Only drugs. A valid registered doctor's prescription is required at the counter upon pickup.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Over The Counter (OTC) - No prescription strictly required.</span>
            </div>
          )}

          {/* Description & Clinical Specs */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Description & Uses
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {medicine.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Manufacturer</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.manufacturer}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Formulation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.form}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Expiry Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.expiryDate || '12/2026'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Reserve Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-900/60 border border-teal-200/60 dark:border-teal-900/60 shadow-lg space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Reserve</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Lock Stock for 24 Hours
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Reserve your medicine at the counter of your chosen pharmacy. Pay directly upon pickup.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero online convenience fee</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>Guaranteed 24H hold window</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="primary"
            className="w-full shadow-lg shadow-teal-500/25"
            onClick={() => handleOpenReserve(medicine.pharmacy || { id: medicine.pharmacyId, name: medicine.pharmacyName })}
            disabled={medicine.stock <= 0}
          >
            {medicine.stock > 0 ? 'Reserve at Primary Store' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Pharmacy Stock Comparison List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Check Nearby Pharmacies Holding Stock
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare inventory quantities and distances across verified pharmacies in Mumbai
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Pharmacy Store</th>
                <th className="p-4">Location / Distance</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(medicine.otherPharmacies || []).map((pharm) => {
                const badge = getAvailabilityBadge(pharm.stock);
                return (
                  <tr key={pharm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-500 shrink-0" />
                        <div>
                          <div>{pharm.name}</div>
                          <span className="text-[11px] font-normal text-slate-500">{pharm.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{pharm.address} <strong className="text-teal-600 dark:text-teal-400">({pharm.distance})</strong></span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={badge.variant} size="sm" dot>
                        {badge.label} ({pharm.stock} units)
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(pharm.price)}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant={pharm.stock > 0 ? 'primary' : 'outline'}
                        disabled={pharm.stock <= 0}
                        onClick={() => handleOpenReserve(pharm)}
                      >
                        {pharm.stock > 0 ? 'Reserve Here' : 'Sold Out'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reserve Modal */}
      {selectedPharmacy && (
        <ReservationModal
          isOpen={isReserveModalOpen}
          onClose={() => {
            setIsReserveModalOpen(false);
            setSelectedPharmacy(null);
          }}
          medicine={medicine}
          pharmacy={selectedPharmacy}
          onSuccess={() => {
            fetchDetails();
          }}
        />
      )}
    </div>
  );
};
