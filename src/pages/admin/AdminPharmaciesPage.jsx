import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Store, 
  Search, 
  CheckCircle, 
  Ban, 
  Phone, 
  MapPin, 
  FileText, 
  Star 
} from 'lucide-react';

export const AdminPharmaciesPage = () => {
  const { toast } = useToast();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllPharmacies();
      setPharmacies(res.pharmacies || []);
    } catch (err) {
      toast({
        title: 'Error loading pharmacies',
        description: err.response?.data?.message || 'Could not fetch records.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await adminApi.updatePharmacyStatus(id, newStatus);
      toast({
        title: `Pharmacy ${newStatus}`,
        description: `Status updated to ${newStatus}.`,
        type: newStatus === 'Active' ? 'success' : 'warning'
      });
      setPharmacies(pharmacies.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      toast({
        title: 'Action Failed',
        description: 'Could not change pharmacy status.',
        type: 'error'
      });
    }
  };

  const filtered = pharmacies.filter((p) => {
    return search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.licenseNumber?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Store className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Partner Pharmacy Network Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verify pharmacy drug licenses, approve new onboarding requests, and audit store performance.
        </p>
      </div>

      {/* Search toolbar */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <Input
          placeholder="Search pharmacies by store name, address, or Drug License #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-md">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No pharmacies found"
            description="No medical stores match your search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Store Name & ID</th>
                  <th className="p-4">Location Address</th>
                  <th className="p-4">Drug License #</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">ID: {item.id}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.address}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {item.licenseNumber || 'MH-MZ2-90218'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {item.phone}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating || '4.8'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={item.status === 'Active' ? 'success' : 'warning'} size="sm" dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant={item.status === 'Active' ? 'ghost' : 'success'}
                        className={item.status === 'Active' ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30' : ''}
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {item.status === 'Active' ? 'Suspend Store' : 'Approve & Activate'}
                      </Button>
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
