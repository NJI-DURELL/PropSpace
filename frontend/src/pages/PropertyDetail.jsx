import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (!cancelled) setProperty(res.data);
      } catch {
        if (!cancelled) setError('Property not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProperty();
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      navigate('/dashboard');
    } catch {
      alert('Failed to delete property.');
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!property) return null;

  const isOwner = user && property.owner?._id === user.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {property.images?.[0] && (
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {property.type}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-1">{property.title}</h1>
          <p className="text-gray-500 mt-1">{property.city}, {property.country}</p>
          <p className="text-blue-700 text-2xl font-bold mt-2">{property.price.toLocaleString()} XAF</p>
        </div>
        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/edit/${property._id}`}
              className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="border border-red-400 text-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-gray-700 leading-relaxed">{property.description}</p>
      {property.images?.length > 1 && (
        <div className="grid grid-cols-3 gap-3 mt-6">
          {property.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${property.title} photo ${i + 2}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
      <p className="mt-6 text-sm text-gray-400">
        Listed by: {property.owner?.name || property.owner?.username}
      </p>
    </div>
  );
}
