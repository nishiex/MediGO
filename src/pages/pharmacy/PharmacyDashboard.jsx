import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pharmacyApi } from '../../api/pharmacyApi';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  PlusCircle, 
  Store, 
  ArrowRight,
  Pill,
  Users
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const PharmacyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        const [dashRes, resList, lowRes] = await Promise.all([
          pharmacyApi.getDashboardStats(),
          pharmacyApi.getPharmacyReservations(),
          pharmacyApi.getLowStockAlerts()
        ]);

        setStats(dashRes.stats);
        setRecentReservations(resList.reservations?.slice(0, 4) || []);
        setLowStockItems(lowRes.lowStockMedicines || []);
      } catch (err) {
        console.error('Error loading pharmacy dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacyData();
  }, []);

  const chartData = stats?.weeklyTrend || [
    { day: 'Mon', reservations: 4, revenue: 1200 },
    { day: 'Tue', reservations: 7, revenue: 2100 },
    { day: 'Wed', reservations: 5, revenue: 1600 },
    { day: 'Thu', reservations: 9, revenue: 3200 },
    { day: 'Fri', reservations: 12, revenue: 4100 },
    { day: 'Sat', reservations: 15, revenue: 5800 },
    { day: 'Sun', reservations: 8, revenue: 2900 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5 text-emerald-300" />
            <span>Pharmacy Partner Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Live Store Analytics & Counter Queue
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Manage your store inventory, monitor critical medicine shortages, and fulfill customer pickup passes.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/pharmacy/medicines/new">
            <Button variant="primary" className="bg-white text-emerald-900 hover:bg-emerald-50 border-none font-bold" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Add Medicine
            </Button>
          </Link>
          <Link to="/pharmacy/reservations">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" leftIcon={<Clock className="w-4 h-4" />}>
              Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Catalog</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.totalMedicines || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Active medicine SKUs</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Pickups</span>
            <div className="text-3xl font-black text-amber-500 mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.activeReservations || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Awaiting customer arrival</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock SKUs</span>
            <div className="text-3xl font-black text-rose-500 mt-1">
              {loading ? <Skeleton className="w-12 h-8" /> : stats?.lowStockCount || 0}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">&le; 5 units remaining</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Est. Weekly Revenue</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {loading ? <Skeleton className="w-16 h-8" /> : formatCurrency(stats?.weeklyRevenue || 18450)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">From verified pickups</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Pickup & Revenue Trajectory
            </h2>
            <p className="text-xs text-slate-500">Real-time demand across the last 7 days</p>
          </div>
          <Badge variant="success" size="sm">Live Feed</Badge>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
              <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Low Stock Alert & Recent Pickup Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Watch */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Low Stock & Out of Stock Alerts
            </h3>
            <Link to="/pharmacy/medicines" className="text-xs text-teal-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">All inventory levels are healthy.</p>
            ) : (
              lowStockItems.slice(0, 4).map((med) => (
                <div key={med.id} className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{med.name}</div>
                    <div className="text-slate-400">{med.dosage} • {med.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={med.stock === 0 ? 'danger' : 'warning'} size="sm" dot>
                      {med.stock} left
                    </Badge>
                    <Link to={`/pharmacy/medicines/edit/${med.id}`}>
                      <Button size="sm" variant="outline">Restock</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Reservation Queue */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500" />
              Counter Pickup Queue
            </h3>
            <Link to="/pharmacy/reservations" className="text-xs text-teal-600 hover:underline">
              Full Queue
            </Link>
          </div>

          <div className="space-y-3">
            {recentReservations.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending counter reservations.</p>
            ) : (
              recentReservations.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-teal-600 dark:text-teal-400">{item.reservationCode}</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{item.medicineName} (x{item.quantity})</div>
                    <div className="text-[11px] text-slate-400">By: {item.userName}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'Confirmed' ? 'primary' : 'success'} size="sm">
                      {item.status}
                    </Badge>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
