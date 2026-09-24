import React, { useState, useEffect } from 'react';
import { pharmacyApi } from '../../api/pharmacyApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Clock, 
  Search, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  ShieldAlert, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PharmacyReservationsPage = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchCode, setSearchCode] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await pharmacyApi.getPharmacyReservations();
      setReservations(res.reservations || []);
    } catch (err) {
      toast({
        title: 'Error loading queue',
        description: err.response?.data?.message || 'Could not fetch customer reservations.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setProcessingId(id);
    try {
      await pharmacyApi.updateReservationStatus(id, newStatus);
      toast({
        title: `Order ${newStatus}`,
        description: `Pass status has been marked as ${newStatus}.`,
        type: newStatus === 'Collected' ? 'success' : 'info'
      });
      fetchReservations();
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: err.response?.data?.message || 'Could not update status.',
        type: 'error'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = reservations.filter((r) => {
    const matchStatus = filterStatus === 'all' || r.status.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch = searchCode.trim() === '' || 
      r.reservationCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.medicineName.toLowerCase().includes(searchCode.toLowerCase());
    return matchStatus && matchSearch;
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Clock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Store Counter Pickup Queue
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verify digital reservation codes upon customer arrival, collect payment, and hand over medicines.
        </p>
      </div>

      {/* Filter and Pass Code Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pass Code Search */}
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by Pass Code (e.g. MED-8910) or Patient..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'confirmed', 'collected', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservation Queue List */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No pickup reservations found"
            description="There are currently no active customer reservations matching your filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Pass Code</th>
                  <th className="p-4">Patient Info</th>
                  <th className="p-4">Reserved Item</th>
                  <th className="p-4">Total Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Placed / Expiry</th>
                  <th className="p-4 text-right">Counter Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => {
                  const isProcessing = processingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-black text-sm text-teal-600 dark:text-teal-400">
                        {item.reservationCode}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.userName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{item.userPhone || '+91 98765 43210'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{item.medicineName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Quantity: <strong className="text-slate-700 dark:text-slate-200">{item.quantity} unit(s)</strong>
                        </div>
                        {item.patientNotes && (
                          <div className="text-[10px] text-teal-600 dark:text-teal-400 italic mt-0.5 max-w-xs truncate">
                            Note: "{item.patientNotes}"
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-white text-sm">
                        {formatCurrency(item.totalPrice)}
                      </td>
                      <td className="p-4">
                        <Badge variant={statusVariant[item.status] || 'default'} size="sm" dot>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        <div>{formatDate(item.createdAt)}</div>
                        <span className="text-[10px] text-slate-400">Hold: 24h</span>
                      </td>
                      <td className="p-4 text-right">
                        {item.status === 'Confirmed' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              isLoading={isProcessing}
                              onClick={() => handleUpdateStatus(item.id, 'Collected')}
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            >
                              Collect & Handover
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              isLoading={isProcessing}
                              onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                              leftIcon={<XCircle className="w-3.5 h-3.5" />}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">
                            {item.status === 'Collected' ? 'Fulfilled ✓' : 'Closed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
