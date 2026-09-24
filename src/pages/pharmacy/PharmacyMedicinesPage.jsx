import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pharmacyApi } from '../../api/pharmacyApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw,
  Check
} from 'lucide-react';
import { formatCurrency, getAvailabilityBadge } from '../../utils/formatters';

export const PharmacyMedicinesPage = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [quickStockUpdating, setQuickStockUpdating] = useState({});

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await pharmacyApi.getPharmacyMedicines();
      setMedicines(res.medicines || []);
    } catch (err) {
      toast({
        title: 'Error loading inventory',
        description: err.response?.data?.message || 'Could not fetch medicine records.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your pharmacy inventory?`)) {
      return;
    }

    try {
      await pharmacyApi.deleteMedicine(id);
      toast({
        title: 'Medicine Removed',
        description: `${name} has been deleted.`,
        type: 'success'
      });
      setMedicines(medicines.filter((m) => m.id !== id));
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: err.response?.data?.message || 'Could not delete medicine.',
        type: 'error'
      });
    }
  };

  const handleQuickStockUpdate = async (id, newStock) => {
    if (newStock < 0) return;
    setQuickStockUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await pharmacyApi.updateStock(id, newStock);
      setMedicines(medicines.map(m => m.id === id ? { ...m, stock: newStock } : m));
      toast({
        title: 'Stock Updated',
        description: `Quantity updated to ${newStock} units.`,
        type: 'success'
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Could not update stock.',
        type: 'error'
      });
    } finally {
      setQuickStockUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const filtered = medicines.filter((m) => {
    const matchQuery = search.toLowerCase() === '' || 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === '' || m.category === categoryFilter;
    return matchQuery && matchCat;
  });

  const categories = Array.from(new Set(medicines.map((m) => m.category))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Pharmacy Medicine Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your store catalog, edit prices, and adjust live stock counts.
          </p>
        </div>

        <Link to="/pharmacy/medicines/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Add New Medicine
          </Button>
        </Link>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search your inventory by brand or generic salt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No medicines found"
            description="You haven't listed any medicines matching your search or your catalog is currently empty."
            actionLabel="Add Your First Medicine"
            onAction={() => window.location.href = '/pharmacy/medicines/new'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Medicine & Generic</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Live Stock Adjust</th>
                  <th className="p-4">Rx Type</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => {
                  const badge = getAvailabilityBadge(item.stock);
                  const isUpdating = quickStockUpdating[item.id];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.genericName} • {item.dosage} ({item.form})
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="purple" size="sm">{item.category}</Badge>
                      </td>
                      <td className="p-4 font-bold text-teal-600 dark:text-teal-400 text-sm">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isUpdating || item.stock <= 0}
                            onClick={() => handleQuickStockUpdate(item.id, Math.max(0, item.stock - 5))}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                            title="-5 Units"
                          >
                            -5
                          </button>
                          <Badge variant={badge.variant} size="sm" dot>
                            {item.stock}
                          </Badge>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuickStockUpdate(item.id, item.stock + 10)}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="+10 Units"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.requiresPrescription ? (
                          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Rx Required
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> OTC
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/pharmacy/medicines/edit/${item.id}`}>
                            <Button size="sm" variant="ghost" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            onClick={() => handleDelete(item.id, item.name)}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </Button>
                        </div>
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
