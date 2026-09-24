import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Store, 
  Pill, 
  CheckCircle2, 
  Zap, 
  HeartHandshake, 
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { medicineApi } from '../../api/medicineApi';
import { formatCurrency, getAvailabilityBadge } from '../../utils/formatters';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [medsRes, catsRes] = await Promise.all([
          medicineApi.getMedicines({ limit: 4 }),
          medicineApi.getCategories()
        ]);
        setFeaturedMedicines(medsRes.medicines || []);
        setCategories(catsRes.categories || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/medicines?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/medicines');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Next-Gen Pharmacy Inventory & Pickup Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Check Medicine Availability in Real-Time. <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Reserve & Pick Up Without Waiting.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop pharmacy hopping. Compare live stock across trusted medical stores in Mumbai, reserve in 1-click, and pick up with your digital pass.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-2xl mx-auto bg-white dark:bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-teal-500/10 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicine name, generic salt (e.g. Paracetamol, Augmentin)..."
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Check Availability
            </Button>
          </form>

          {/* Quick pills */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
            {['Augmentin 625mg', 'Metformin 500mg', 'Pantocid 40mg', 'Azithromycin'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/medicines?query=${encodeURIComponent(term)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 hover:text-teal-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time Stock Sync</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">24/7</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Counter Pickups</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">₹0</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Online Booking Fees</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">Verified</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Licensed Pharmacies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Why Choose MediGo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How MediGo Solves Medicine Shortages
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            A frictionless platform built for patients in urgent need and pharmacies managing peak footfall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Inventory Radar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Check exact unit numbers across pharmacies nearest to you. No more blind calling or driving around in medical emergencies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Instant sync</span>
              <Activity className="w-4 h-4 ml-auto animate-pulse text-emerald-500" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Guaranteed 24H Hold
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                When you click Reserve, the pharmacy locks your box for 24 hours. Get a unique pickup passcode like <code className="text-teal-600 font-mono">MED-9821</code>.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Zero cancellation penalty</span>
              <Clock className="w-4 h-4 ml-auto" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pharmacy Business Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Pharmacies get a dedicated dashboard to list medicines, track high-demand medicines, manage customer pickups, and view real-time sales trends.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Partner with us</span>
              <TrendingUp className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Browse by Therapeutic Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Find medicines for chronic, acute, and emergency health needs
            </p>
          </div>
          <Link to="/medicines">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/medicines?category=${encodeURIComponent(category)}`}
              className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-md hover:scale-105 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2.5 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Medicines Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Available Medicines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              High-demand essential medicines currently verified in stock
            </p>
          </div>
          <Link to="/medicines">
            <Button variant="outline" size="sm">
              Full Catalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMedicines.map((med) => {
            const badge = getAvailabilityBadge(med.stock);
            return (
              <div
                key={med.id}
                className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="purple" size="sm">{med.category}</Badge>
                    <Badge variant={badge.variant} size="sm" dot>{badge.label}</Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2 line-clamp-1">
                    {med.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {med.genericName} • {med.dosage}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-base font-black text-teal-600 dark:text-teal-400">
                    {formatCurrency(med.price)}
                  </span>
                  <Link to={`/medicines/${med.id}`}>
                    <Button size="sm" variant="subtle">
                      Check Stock
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Partner Pharmacy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge variant="primary" size="sm">Pharmacy Partnership</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Are you a licensed Medical Store owner?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              List your inventory on MediGo to connect with thousands of local patients, reduce walkout rate, and automate counter pickup passes.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/register?type=pharmacy">
                <Button variant="primary" size="lg">
                  Join as Partner Pharmacy
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-white border-slate-700 hover:bg-slate-800">
                  Pharmacy Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
