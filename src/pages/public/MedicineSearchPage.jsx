import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { medicineApi } from '../../api/medicineApi';
import { MedicineCard } from '../../components/common/MedicineCard';
import { ReservationModal } from '../../components/common/ReservationModal';
import { MedicineCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Search, Filter, SlidersHorizontal, RotateCcw, Pill } from 'lucide-react';

export const MedicineSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState('all');
  const [prescription, setPrescription] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await medicineApi.getCategories();
        setCategories(res.categories || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    fetchCategories();
  }, []);

  // Fetch medicines when filters change
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = {
        query: query.trim() || undefined,
        category: category || undefined,
        availability: availability !== 'all' ? availability : undefined,
        prescription: prescription !== 'all' ? prescription : undefined,
        sortBy
      };
      const res = await medicineApi.getMedicines(params);
      setMedicines(res.medicines || []);
    } catch (err) {
      console.error('Error searching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [category, availability, prescription, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ query, category });
    fetchMedicines();
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategory('');
    setAvailability('all');
    setPrescription('all');
    setSortBy('name');
    setSearchParams({});
  };

  const handleOpenReserve = (medicine) => {
    setSelectedMedicine(medicine);
    setIsReserveModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Pill className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          Find Medicines & Live Stock
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search real-time inventory across verified pharmacies in your local area.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm space-y-4">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search medicine brand or generic salt (e.g. Paracetamol, Azithromycin)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button type="submit" variant="primary" leftIcon={<Search className="w-4 h-4" />}>
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleResetFilters} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Reset
          </Button>
        </form>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Category */}
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          {/* Availability */}
          <Select
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="all">All Availability</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1-5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </Select>

          {/* Prescription */}
          <Select
            label="Prescription Type"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="otc">Over The Counter (OTC)</option>
            <option value="rx">Rx Required</option>
          </Select>

          {/* Sort */}
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_desc">Highest Stock First</option>
          </Select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Showing <span className="text-slate-900 dark:text-white font-bold">{medicines.length}</span> results
        </p>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <MedicineCardSkeleton key={idx} />
          ))}
        </div>
      ) : medicines.length === 0 ? (
        <EmptyState
          title="No medicines found"
          description="We couldn't find any medicines matching your search parameters. Try clearing the filters or searching a different term."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onReserve={handleOpenReserve}
            />
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      {selectedMedicine && (
        <ReservationModal
          isOpen={isReserveModalOpen}
          onClose={() => {
            setIsReserveModalOpen(false);
            setSelectedMedicine(null);
          }}
          medicine={selectedMedicine}
          onSuccess={() => {
            fetchMedicines(); // Refresh stock count
          }}
        />
      )}
    </div>
  );
};
