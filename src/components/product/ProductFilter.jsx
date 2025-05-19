import PropTypes from 'prop-types';

function ProductFilter({ title, items, activeId, onFilterChange, filterType }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4">
      <h3 className="font-bold text-lg mb-3 text-black">{title}</h3>
      <ul className="space-y-2">
        <li>
          <button 
            className={`w-full text-left hover:text-indigo-600 ${!activeId ? 'font-medium text-indigo-600' : ''}`}
            onClick={() => onFilterChange(filterType, null)}
          >
            All {title}
          </button>
        </li>
        {items.map(item => (
          <li key={item.id}>
            <button 
              className={`w-full text-left hover:text-indigo-600 ${activeId === item.id.toString() ? 'font-medium text-indigo-600' : ''}`}
              onClick={() => onFilterChange(filterType, item.id)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ProductFilter.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  activeId: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired
};

export default ProductFilter;