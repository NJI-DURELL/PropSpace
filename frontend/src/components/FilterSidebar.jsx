import { useState } from 'react';

export default function FilterSidebar({ onFilter }) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ city, minPrice, maxPrice });
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    onFilter({});
  };

  return (
    <aside className="bg-white rounded-lg shadow p-4 h-fit">
      <h2 className="font-semibold text-gray-700 mb-3">Filters</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-gray-600">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Douala"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Min Price (XAF)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            min="0"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Max Price (XAF)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Any"
            min="0"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700">
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border border-gray-300 text-gray-600 rounded py-2 text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </form>
    </aside>
  );
}
