import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Package, Search, Trash2, Building2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { formatCurrency, getAvailabilityBadge } from '../../utils/formatters';

export const AdminMedicinesPage = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllMedicines();
      setMedicines(res.medicines || []);
    } catch (err) {
      toast({
        title: 'Error loading catalog',
        description: err.response?.data?.message || 'Could not fetch records.',
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
    if (!window.confirm(`Global admin action: Delete "${name}" from the network?`)) {
      return;
    }
    try {
      await adminApi.deleteMedicine(id);
      toast({
        title: 'Medicine Deleted',
        description: `${name} has been purged from the global database.`,
        type: 'success'
      });
      setMedicines(medicines.filter(m => m.id !== id));
    } catch (err) {
      toast({
        title: 'Action Failed',
        description: 'Could not delete medicine.',
        type: 'error'
      });
    }
  };

  const filtered = medicines.filter((m) => {
    return search === '' || 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.pharmacyName?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Package className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Global Medicine Catalog Audit
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Master registry of all medicine SKUs listed across all partner medical stores.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <Input
          placeholder="Search global medicines by name, salt, or pharmacy..."
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
            title="No medicine records"
            description="No medicines match your query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Medicine & Form</th>
                  <th className="p-4">Pharmacy Store</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rx Required</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => {
                  const badge = getAvailabilityBadge(item.stock);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.genericName} • {item.dosage}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-teal-500" />
                          <span>{item.pharmacyName || 'Apollo 24/7'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="purple" size="sm">{item.category}</Badge>
                      </td>
                      <td className="p-4 font-bold text-teal-600 dark:text-teal-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="p-4">
                        <Badge variant={badge.variant} size="sm" dot>
                          {item.stock} units
                        </Badge>
                      </td>
                      <td className="p-4">
                        {item.requiresPrescription ? (
                          <span className="text-amber-600 font-semibold">Yes (Rx)</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">OTC</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => handleDelete(item.id, item.name)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Purge
                        </Button>
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
