import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ClipboardList, Search, Building2, User, Phone } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminReservationsPage = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAllReservations();
        setReservations(res.reservations || []);
      } catch (err) {
        toast({
          title: 'Error loading passes',
          description: err.response?.data?.message || 'Could not fetch records.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filtered = reservations.filter((r) => {
    return search === '' || 
      r.reservationCode.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.pharmacyName.toLowerCase().includes(search.toLowerCase()) ||
      r.medicineName.toLowerCase().includes(search.toLowerCase());
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <ClipboardList className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Master Reservation Audit Ledger
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete historical audit trail of all customer reservations across the platform.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <Input
          placeholder="Search by Pass Code (MED-XXXX), patient, medicine or pharmacy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No passes found"
            description="No digital passes match your filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Pass Code</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Medicine Item</th>
                  <th className="p-4">Pharmacy Store</th>
                  <th className="p-4">Qty & Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                      {item.reservationCode}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.userName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{item.userPhone || '+91 98765 43210'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.medicineName}</div>
                      <div className="text-[11px] text-slate-400">{item.dosage}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>{item.pharmacyName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.quantity} unit(s)</div>
                      <div className="text-teal-600 dark:text-teal-400 font-semibold">{formatCurrency(item.totalPrice)}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[item.status] || 'default'} size="sm" dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500">
                      {formatDate(item.createdAt)}
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
