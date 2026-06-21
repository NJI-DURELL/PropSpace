import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchMyListings = async () => {
      try {
        const res = await api.get('/properties/mine');
        if (!cancelled) setProperties(res.data);
      } catch {
        if (!cancelled) setError('Failed to load your listings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMyListings();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete property.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          + Add Property
        </Link>
      </div>
      {loading && <p className="text-center text-gray-500 mt-10">Loading...</p>}
      {!loading && error && <p className="text-center text-red-500 mt-10">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          You haven&apos;t listed any properties yet.
        </p>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} isOwner onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
