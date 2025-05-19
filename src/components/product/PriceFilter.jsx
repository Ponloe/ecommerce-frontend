import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PriceFilter({ minPrice, maxPrice, onFilterChange }) {
  const [priceRange, setPriceRange] = useState({
    min: minPrice || 0,
    max: maxPrice || 1000
  });

  useEffect(() => {
    if (minPrice !== undefined) setPriceRange(prev => ({ ...prev, min: minPrice }));
    if (maxPrice !== undefined) setPriceRange(prev => ({ ...prev, max: maxPrice }));
  }, [minPrice, maxPrice]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleApplyFilter = () => {
    onFilterChange('minPrice', priceRange.min);
    onFilterChange('maxPrice', priceRange.max);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4">
      <h3 className="font-bold text-lg mb-3 text-black">Price Range</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-[45%]">
            <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
              Min
            </label>
            <input
              type="number"
              id="min-price"
              min="0"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            />
          </div>
          
          <div className="text-gray-500">-</div>
          
          <div className="w-[45%]">
            <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
              Max
            </label>
            <input
              type="number"
              id="max-price"
              min="0"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            />
          </div>
        </div>
        
        <button
          onClick={handleApplyFilter}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition duration-200"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}

PriceFilter.propTypes = {
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  onFilterChange: PropTypes.func.isRequired
};

export default PriceFilter;