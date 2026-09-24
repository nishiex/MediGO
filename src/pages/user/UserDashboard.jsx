import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reservationApi } from '../../api/reservationApi';
import { medicineApi } from '../../api/medicineApi';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Building2, 
  Pill, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [recentMedicines, setRecentMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [resList, medsList] = await Promise.all([
          reservationApi.getMyReservations(),
          medicineApi.getMedicines({ limit: 3 })
        ]);
        setReservations(resList.reservations || []);
        setRecentMedicines(medsList.medicines || []);
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const activeReservations = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending');
  const completedReservations = reservations.filter(r => r.status === 'Collected');

  const statusVariant = {
    Confirmed: 'primary',
    Pending: 'warning',
    Collected: 'success',
    Cancelled: 'danger',
    Expired: 'default'
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-xl shadow-teal-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Patient Health Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            You have <strong className="text-white font-bold">{activeReservations.length} active pickup pass{activeReservations.length === 1 ? '' : 'es'}</strong> ready for collection at partner pharmacies.
          </p>
        </div>

        <Link to="/medicines">
          <Button variant="primary" className="bg-white text-teal-900 hover:bg-teal-50 shadow-none border-none font-bold" leftIcon={<Search className="w-4 h-4" />}>
            Search Medicines
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Passes</span>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {loading ? <Skeleton className="w-10 h-8" /> : activeReservations.length}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Ready for counter pickup</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pickups</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {loading ? <Skeleton className="w-10 h-8" /> : completedReservations.length}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Completed orders</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Time</span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {loading ? <Skeleton className="w-10 h-8" /> : `~${reservations.length * 25}m`}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Zero waiting in lines</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Active Digital Pickup Passes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Present these codes at the pharmacy counter to claim your reserved medicines
            </p>
          </div>
          <Link to="/user/reservations">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Passes
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        ) : activeReservations.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
            <p className="text-xs text-slate-500">No active reservations at the moment.</p>
            <Link to="/medicines" className="inline-block mt-3">
              <Button size="sm" variant="subtle">Browse Medicines</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-lg border border-teal-200/60 dark:border-teal-800/60">
                      {res.reservationCode}
                    </span>
                    <Badge variant={statusVariant[res.status] || 'default'} size="sm" dot>
                      {res.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {res.medicineName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quantity: <strong className="text-slate-700 dark:text-slate-300">{res.quantity} unit(s)</strong> • Total: <strong className="text-teal-600 dark:text-teal-400">{formatCurrency(res.totalPrice)}</strong>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="truncate">{res.pharmacyName}</span>
                    </span>
                    <span className="text-slate-400 shrink-0">
                      Hold: 24h
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Placed: {formatDate(res.createdAt)}
                  </span>
                  <Link to={`/user/reservations/${res.id}`}>
                    <Button size="sm" variant="subtle">
                      View Pass
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Medicines Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Reorder / Recommended
          </h2>
          <Link to="/medicines" className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
            View Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentMedicines.map((med) => (
            <div key={med.id} className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{med.name}</h4>
                <p className="text-[11px] text-slate-400">{med.dosage}</p>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{formatCurrency(med.price)}</span>
              </div>
              <Link to={`/medicines/${med.id}`}>
                <Button size="sm" variant="ghost">View</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
