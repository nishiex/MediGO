import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Shield, 
  Store, 
  Package, 
  ClipboardList, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashRes, pharmRes, resList] = await Promise.all([
          adminApi.getAdminDashboardStats(),
          adminApi.getAllPharmacies(),
          adminApi.getAllReservations()
        ]);

        setStats(dashRes.stats);
        setPharmacies(pharmRes.pharmacies || []);
        setRecentReservations(resList.reservations?.slice(0, 4) || []);
      } catch (err) {
        console.error('Admin dashboard error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const barData = stats?.monthlyActivity || [
    { month: 'Jan', reservations: 120, volume: 45000 },
    { month: 'Feb', reservations: 180, volume: 62000 },
    { month: 'Mar', reservations: 240, volume: 88000 },
    { month: 'Apr', reservations: 310, volume: 110000 },
    { month: 'May', reservations: 420, volume: 145000 },
  ];

  const pieData = [
    { name: 'Active Pharmacies', value: stats?.activePharmacies || 5, color: '#10b981' },
    { name: 'Pending Approvals', value: stats?.pendingPharmacies || 1, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>Master System Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            MediGo Network Administration
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            Global ecosystem overview: licensed pharmacy verifications, system throughput, and patient activity logs.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/pharmacies">
            <Button variant="primary" className="bg-white text-purple-900 hover:bg-purple-50 border-none font-bold" leftIcon={<Store className="w-4 h-4" />}>
              Audit Pharmacies
            </Button>
          </Link>
          <Link to="/admin/reservations">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" leftIcon={<ClipboardList className="w-4 h-4" />}>
              All Passes
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pharmacies</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.totalPharmacies || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Network partners</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Global SKUs</span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.totalMedicines || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Listed medicines</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Passes</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.totalReservations || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Fulfillment orders</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform GMV</span>
            <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {loading ? <Skeleton className="w-16 h-8" /> : formatCurrency(stats?.platformVolume || 124800)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Total facilitated volume</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Reservation Growth
            </h2>
            <p className="text-xs text-slate-500">Monthly completed pickup reservations volume</p>
          </div>
          <Badge variant="purple" size="sm">System Audit</Badge>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="reservations" fill="#9333ea" radius={[6, 6, 0, 0]} name="Reservations Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Pharmacy Approvals & Global Passes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pharmacy Verification Queue */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-500" />
              Pharmacy Store Directory
            </h3>
            <Link to="/admin/pharmacies" className="text-xs text-purple-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {pharmacies.slice(0, 4).map((pharm) => (
              <div key={pharm.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{pharm.name}</div>
                  <div className="text-[11px] text-slate-400">{pharm.address}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pharm.status === 'Active' ? 'success' : 'warning'} size="sm" dot>
                    {pharm.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Reservations Feed */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              Latest Global Reservations
            </h3>
            <Link to="/admin/reservations" className="text-xs text-purple-600 hover:underline">
              Audit All
            </Link>
          </div>

          <div className="space-y-3">
            {recentReservations.map((r) => (
              <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-purple-600 dark:text-purple-400">{r.reservationCode}</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{r.medicineName} ({r.pharmacyName})</div>
                  <div className="text-[11px] text-slate-400">{r.userName} • {formatDate(r.createdAt)}</div>
                </div>
                <div className="text-right font-black text-slate-900 dark:text-white">
                  {formatCurrency(r.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
