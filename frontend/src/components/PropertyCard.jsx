import { Link } from 'react-router-dom';

export default function PropertyCard({ property, onDelete, isOwner }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {property.images?.[0] ? (
        <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}
      <div className="p-4">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {property.type}
        </span>
        <h3 className="font-semibold text-lg mt-1 truncate">{property.title}</h3>
        <p className="text-gray-500 text-sm">{property.city}, {property.country}</p>
        <p className="text-blue-700 font-bold mt-1">{property.price.toLocaleString()} XAF</p>
        <div className="flex gap-2 mt-3">
          <Link
            to={`/properties/${property._id}`}
            className="flex-1 text-center border border-blue-600 text-blue-600 rounded py-1 text-sm hover:bg-blue-50"
          >
            View
          </Link>
          {isOwner && (
            <>
              <Link
                to={`/edit/${property._id}`}
                className="flex-1 text-center border border-gray-400 text-gray-600 rounded py-1 text-sm hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(property._id)}
                className="flex-1 border border-red-400 text-red-500 rounded py-1 text-sm hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
