import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reservationApi } from '../../api/reservationApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  ChevronLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Pill, 
  CheckCircle2, 
  Printer, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReservationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      try {
        const res = await reservationApi.getReservationById(id);
        setReservation(res.reservation);
      } catch (err) {
        toast({
          title: 'Not Found',
          description: 'Could not load reservation details.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <EmptyState
        title="Pass Not Found"
        description="This reservation pass could not be retrieved."
        actionLabel="Back to Reservations"
        onAction={() => navigate('/user/reservations')}
      />
    );
  }

  const statusVariant = {
    Confirmed: 'primary',
    Pending: 'warning',
    Collected: 'success',
    Cancelled: 'danger',
    Expired: 'default'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link to="/user/reservations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700">
          <ChevronLeft className="w-4 h-4" />
          Back to Passes
        </Link>
        <Button size="sm" variant="outline" onClick={handlePrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
          Print Pass
        </Button>
      </div>

      {/* Digital Pass Card */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-teal-500/10 overflow-hidden">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white text-center relative">
          <Badge variant="primary" size="sm" className="bg-white/20 text-white border-white/30 mb-2">
            Digital Pharmacy Counter Pass
          </Badge>
          <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest my-2">
            {reservation.reservationCode}
          </div>
          <p className="text-xs text-teal-100">
            Show this code or tell your phone number at the counter
          </p>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status & Timing */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs text-slate-400 block">Status</span>
              <Badge variant={statusVariant[reservation.status] || 'default'} size="md" dot className="mt-1">
                {reservation.status}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Expires</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(reservation.expiresAt)}
              </span>
            </div>
          </div>

          {/* Medicine Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reserved Item
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{reservation.medicineName}</h3>
                  <p className="text-xs text-slate-400">Quantity: {reservation.quantity} unit(s)</p>
                </div>
              </div>
              <div className="text-right font-black text-teal-600 dark:text-teal-400 text-base">
                {formatCurrency(reservation.totalPrice)}
              </div>
            </div>
          </div>

          {/* Pharmacy Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pickup Pharmacy Location
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Building2 className="w-4 h-4 text-teal-500" />
                <span>{reservation.pharmacyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Hill Road, Bandra West, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 22 2640 1234</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {reservation.patientNotes && (
            <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <strong>Patient Note:</strong> "{reservation.patientNotes}"
            </div>
          )}

          {/* Important instructions */}
          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/40 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300">
              <ShieldCheck className="w-4 h-4" />
              Pickup Instructions
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
              <li>Visit the pharmacy counter during operational store hours.</li>
              <li>Provide your digital code <code className="font-mono font-bold text-teal-600">{reservation.reservationCode}</code>.</li>
              <li>Pay the exact amount of {formatCurrency(reservation.totalPrice)} directly via cash/UPI/card.</li>
              <li>If the medicine requires a doctor's prescription, bring the prescription copy.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
