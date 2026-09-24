import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reservationApi } from '../../api/reservationApi';
import { formatCurrency } from '../../utils/formatters';
import { Building2, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReservationModal = ({
  isOpen,
  onClose,
  medicine,
  pharmacy,
  onSuccess
}) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [patientNotes, setPatientNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);

  if (!medicine) return null;

  const targetPharmacy = pharmacy || medicine.pharmacy || {
    id: medicine.pharmacyId || 'p1',
    name: medicine.pharmacyName || 'Apollo 24/7 Pharmacy',
    address: 'Hill Road, Bandra West, Mumbai'
  };

  const totalPrice = (medicine.price || 0) * quantity;
  const maxStock = medicine.stock || 1;

  const handleReserve = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or select a demo role to reserve medicines.',
        type: 'warning'
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await reservationApi.createReservation({
        medicineId: medicine.id,
        pharmacyId: targetPharmacy.id,
        quantity: parseInt(quantity, 10),
        patientNotes
      });

      setReservationResult(res.reservation);
      toast({
        title: 'Reservation Confirmed!',
        description: `Your reservation code is ${res.reservation.reservationCode}. Pick up within 24 hours.`,
        type: 'success'
      });

      if (onSuccess) onSuccess(res.reservation);
    } catch (err) {
      toast({
        title: 'Reservation Failed',
        description: err.response?.data?.message || 'Unable to place reservation. Please check stock.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReservationResult(null);
    setQuantity(1);
    setPatientNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={reservationResult ? "Reservation Confirmed!" : "Reserve Medicine for Pickup"}
      description={reservationResult ? "Present this digital pass at the pharmacy counter" : "Zero payment required online. Pay directly at the pharmacy counter."}
      maxWidth="max-w-md"
    >
      {reservationResult ? (
        <div className="space-y-6 text-center animate-fadeIn py-2">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Pickup Pass Code</span>
            <div className="text-3xl font-black tracking-widest text-teal-600 dark:text-teal-400 my-1 font-mono">
              {reservationResult.reservationCode}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Valid until: <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(reservationResult.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} tomorrow</span>
            </p>
          </div>

          <div className="text-left space-y-2 text-xs bg-teal-50/50 dark:bg-teal-950/30 p-3.5 rounded-xl border border-teal-200/50 dark:border-teal-800/40 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Medicine:</span>
              <span className="font-semibold">{medicine.name} (x{reservationResult.quantity})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pickup Pharmacy:</span>
              <span className="font-semibold">{targetPharmacy.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Payable:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">{formatCurrency(reservationResult.totalPrice)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                handleClose();
                navigate('/user/reservations');
              }}
            >
              My Reservations
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReserve} className="space-y-4">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {medicine.name}
              </h4>
              <Badge variant="primary" size="sm">{formatCurrency(medicine.price)} / unit</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {medicine.dosage} • {medicine.genericName}
            </p>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-teal-500" />
                {targetPharmacy.name}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {medicine.stock} units available
              </span>
            </div>
          </div>

          {/* Rx Notice if required */}
          {medicine.requiresPrescription && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Prescription Required:</strong> You must present a valid medical prescription at the counter during pickup.
              </span>
            </div>
          )}

          {/* Quantity selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Quantity to Reserve
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={maxStock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(maxStock, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 text-center font-bold text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 py-2 bg-transparent"
              />
              <button
                type="button"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40"
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                disabled={quantity >= maxStock}
              >
                +
              </button>

              <div className="ml-auto text-right">
                <span className="text-xs text-slate-400 block">Total Est.</span>
                <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <Textarea
            label="Special Instructions / Patient Note (Optional)"
            placeholder="E.g. Will pick up around 5 PM, please keep original packaging."
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
            rows={2}
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>Reserved stock is held for <strong>24 hours</strong> before auto-release.</span>
          </div>

          <div className="pt-3 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={loading}
            >
              Confirm Reservation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
