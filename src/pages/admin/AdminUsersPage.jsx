import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Users, Search, Mail, Phone, MapPin } from 'lucide-react';

export const AdminUsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAllUsers();
        setUsers(res.users || []);
      } catch (err) {
        toast({
          title: 'Error loading users',
          description: err.response?.data?.message || 'Could not fetch records.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    return search === '' || 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
  });

  const roleBadge = {
    user: 'primary',
    pharmacy: 'success',
    admin: 'purple'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Platform Users & Partners Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Directory of registered patients, pharmacy partner accounts, and platform administrators.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <Input
          placeholder="Search by user name, email, or role..."
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
            title="No accounts found"
            description="No users matched your query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Account Type / Role</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Registered Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">ID: {u.id}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={roleBadge[u.role] || 'default'} size="sm" dot>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {u.phone || '+91 98765 43210'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{u.address || 'Mumbai, Maharashtra'}</span>
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
