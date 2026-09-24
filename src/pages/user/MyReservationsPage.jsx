import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationApi } from '../../api/reservationApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton, TableRowSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  ClipboardList, 
  Building2, 
  Calendar, 
  Eye, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Pill 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MyReservationsPage = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationApi.getMyReservations();
      setReservations(res.reservations || []);
    } catch (err) {
      toast({
        title: 'Error loading reservations',
        description: err.response?.data?.message || 'Please try again later.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? The locked stock will be returned to the pharmacy inventory.')) {
      return;
    }

    setCancellingId(reservationId);
    try {
      await reservationApi.cancelReservation(reservationId);
      toast({
        title: 'Reservation Cancelled',
        description: 'Stock has been unlocked.',
        type: 'info'
      });
      fetchReservations();
    } catch (err) {
      toast({
        title: 'Cancellation Failed',
        description: err.response?.data?.message || 'Could not cancel reservation.',
        type: 'error'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const statusVariant = {
    Confirmed: 'primary',
    Pending: 'warning',
    Collected: 'success',
    Cancelled: 'danger',
    Expired: 'default'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            My Digital Pickup Passes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track and present your reserved medicine passes at partner pharmacy counters.
          </p>
        </div>

        <Link to="/medicines">
          <Button variant="primary" size="sm">
            Reserve Another Medicine
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'confirmed', 'collected', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table / Cards */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filteredReservations.length === 0 ? (
          <EmptyState
            title="No reservations found"
            description="You don't have any reservations under the selected status filter."
            actionLabel="Browse Available Medicines"
            onAction={() => window.location.href = '/medicines'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Pass Code</th>
                  <th className="p-4">Medicine Name</th>
                  <th className="p-4">Pharmacy Store</th>
                  <th className="p-4">Qty & Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Reserved</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReservations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-black text-teal-600 dark:text-teal-400">
                      {item.reservationCode}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-400">{item.dosage}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span>{item.pharmacyName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.quantity} unit(s)
                      </span>
                      <div className="text-teal-600 dark:text-teal-400 font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[item.status] || 'default'} size="sm" dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/user/reservations/${item.id}`}>
                          <Button size="sm" variant="subtle" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                            Pass
                          </Button>
                        </Link>
                        {item.status === 'Confirmed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            onClick={() => handleCancelReservation(item.id)}
                            isLoading={cancellingId === item.id}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
