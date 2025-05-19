import { Link } from 'react-router-dom';
import Button from '../common/Button';

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden bg-gray-100">
          {product.image ? (
            <img 
              src={`http://localhost:8000/storage/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 mb-1 truncate text-white">
            {product.name}
          </h3>
        </Link>
        
        {product.brand && (
          <Link to={`/brands/${product.brand.id}`} className="text-sm text-gray-600 hover:text-indigo-600">
            {product.brand.name}
          </Link>
        )}
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => console.log('Add to cart:', product.id)}
            >
            Add
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;