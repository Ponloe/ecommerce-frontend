import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-[380px] flex flex-col">
      <Link to={`/products/${product.id}`} className="h-48 flex-shrink-0">
        <div className="h-48 overflow-hidden bg-gray-100">
          {product.image ? (
            <img 
              src={`http://192.168.0.158:8000/storage/${product.image}`}
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
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
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
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;