import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import InputField from '../components/InputField';

const TYPES = ['Apartment', 'House', 'Studio'];

export default function CreateProperty() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: 'Apartment', images: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = 'A valid price is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.country.trim()) e.country = 'Country is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const images = form.images.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/properties', { ...form, price: Number(form.price), images });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Property</h1>
      {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <InputField label="Title" value={form.title} onChange={set('title')} error={errors.title} placeholder="Cozy 2-bedroom apartment" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="Describe the property..."
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>
        <InputField label="Price (XAF)" type="number" value={form.price} onChange={set('price')} error={errors.price} min="0" placeholder="500" />
        <InputField label="City" value={form.city} onChange={set('city')} error={errors.city} placeholder="Douala" />
        <InputField label="Country" value={form.country} onChange={set('country')} error={errors.country} placeholder="Cameroon" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Property Type</label>
          <select
            value={form.type}
            onChange={set('type')}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <InputField
          label="Image URLs (comma-separated)"
          value={form.images}
          onChange={set('images')}
          placeholder="https://example.com/img1.jpg, ..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Property'}
        </button>
      </form>
    </div>
  );
}
