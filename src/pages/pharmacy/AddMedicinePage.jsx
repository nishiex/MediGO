import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pharmacyApi } from '../../api/pharmacyApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { ChevronLeft, PlusCircle, Pill, ShieldAlert, DollarSign } from 'lucide-react';

export const AddMedicinePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    dosage: '',
    form: 'Tablet',
    price: '',
    stock: '',
    manufacturer: '',
    expiryDate: '',
    requiresPrescription: false,
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Antibiotics',
    'Cardiology & Hypertension',
    'Diabetes Care',
    'Pain Relief & Analgesics',
    'Gastroenterology',
    'Respiratory & Pulmonology',
    'Dermatology',
    'Supplements & Vitamins'
  ];

  const forms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Inhaler', 'Drops'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.stock === '') {
      setError('Please fill in medicine name, price and initial stock.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await pharmacyApi.addMedicine({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      });

      toast({
        title: 'Medicine Added Successfully',
        description: `${formData.name} is now available for live user search and reservation.`,
        type: 'success'
      });

      navigate('/pharmacy/medicines');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medicine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link to="/pharmacy/medicines" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700">
          <ChevronLeft className="w-4 h-4" />
          Back to Inventory
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          Add Medicine to Store Inventory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Publish real-time stock levels and pricing visible to patients across your region.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 backdrop-blur-md">
        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Medicine Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Medicine Brand Name"
              name="name"
              required
              placeholder="e.g. Augmentin 625 Duo"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Generic Salt / Formulation"
              name="genericName"
              placeholder="e.g. Amoxicillin & Clavulanic Acid"
              value={formData.genericName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Therapeutic Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>

            <Input
              label="Dosage / Strength"
              name="dosage"
              placeholder="e.g. 625mg / 5ml"
              value={formData.dosage}
              onChange={handleChange}
            />

            <Select
              label="Form"
              name="form"
              value={formData.form}
              onChange={handleChange}
            >
              {forms.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pricing, Stock & Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Unit Selling Price (₹)"
              name="price"
              type="number"
              step="0.01"
              required
              placeholder="e.g. 195.50"
              value={formData.price}
              onChange={handleChange}
            />

            <Input
              label="Current In-Hand Stock"
              name="stock"
              type="number"
              required
              placeholder="e.g. 45"
              value={formData.stock}
              onChange={handleChange}
            />

            <Input
              label="Manufacturer"
              name="manufacturer"
              placeholder="e.g. GSK Pharma"
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Batch Expiry Date"
              name="expiryDate"
              placeholder="e.g. 12/2026"
              value={formData.expiryDate}
              onChange={handleChange}
            />

            <div className="pt-5">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  name="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Requires Doctor Prescription (Schedule H)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Textarea
            label="Usage Notes / Clinical Details (Optional)"
            name="description"
            rows={3}
            placeholder="Describe clinical indications, storage conditions, or usage guidelines..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/pharmacy/medicines')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={loading}
          >
            Publish to Store Inventory
          </Button>
        </div>
      </form>
    </div>
  );
};
