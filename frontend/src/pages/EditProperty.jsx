import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import InputField from '../components/InputField';

const TYPES = ['Apartment', 'House', 'Studio'];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: 'Apartment', images: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (!cancelled) {
          const p = res.data;
          setForm({
            title: p.title,
            description: p.description,
            price: p.price,
            city: p.city,
            country: p.country,
            type: p.type,
            images: (p.images || []).join(', '),
          });
        }
      } catch {
        if (!cancelled) setServerError('Failed to load property.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProperty();
    return () => { cancelled = true; };
  }, [id]);

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
    setSaving(true);
    setServerError('');
    try {
      const images = form.images.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put(`/properties/${id}`, { ...form, price: Number(form.price), images });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Property</h1>
      {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <InputField label="Title" value={form.title} onChange={set('title')} error={errors.title} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>
        <InputField label="Price (XAF)" type="number" value={form.price} onChange={set('price')} error={errors.price} min="0" />
        <InputField label="City" value={form.city} onChange={set('city')} error={errors.city} />
        <InputField label="Country" value={form.country} onChange={set('country')} error={errors.country} />
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
          placeholder="https://..."
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
