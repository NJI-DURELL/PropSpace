import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data);
    } catch {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Properties</h1>
      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <FilterSidebar onFilter={fetchProperties} />
        </div>
        <div className="flex-1">
          {loading && (
            <p className="text-center text-gray-500 mt-10">Loading...</p>
          )}
          {!loading && error && (
            <p className="text-center text-red-500 mt-10">{error}</p>
          )}
          {!loading && !error && properties.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No properties found.</p>
          )}
          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
