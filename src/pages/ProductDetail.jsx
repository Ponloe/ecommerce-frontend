import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };


  if (loading) return <Loading />;
  
  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 text-xl mb-4">Error loading product: {error.message}</div>
      <Link to="/products" className="text-indigo-600 hover:underline">
        Return to Products
      </Link>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-8">
      <div className="text-xl mb-4">Product not found</div>
      <Link to="/products" className="text-indigo-600 hover:underline">
        Return to Products
      </Link>
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
            <svg className="h-3 w-3 mx-2 fill-current text-gray-400" viewBox="0 0 320 512">
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li className="flex items-center">
            <Link to="/products" className="text-gray-500 hover:text-indigo-600">Products</Link>
            <svg className="h-3 w-3 mx-2 fill-current text-gray-400" viewBox="0 0 320 512">
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li>
            <span className="text-gray-700">{product.name}</span>
          </li>
        </ol>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <img 
              src={`http://192.168.0.158:8000/storage/${product.image}`}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {product.brand && (
            <Link to={`/brands/${product.brand.id}`} className="text-indigo-600 hover:underline">
              {product.brand.name}
            </Link>
          )}
          
          <div className="mt-4 mb-6">
            <span className="text-2xl font-bold">${product.price}</span>
          </div>
          
          <div className="prose prose-sm max-w-none mb-6">
            <p>{product.description}</p>
          </div>
          
          {/* Category */}
          {product.category && (
            <div className="mb-6">
              <span className="text-gray-600">Category: </span>
              <Link 
                to={`/categories/${product.category.id}`}
                className="text-indigo-600 hover:underline"
              >
                {product.category.name}
              </Link>
            </div>
          )}
          
          {/* Quantity */}
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex border rounded">
              <button 
                className="px-3 py-1 border-r"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-none focus:outline-none"
                min="1"
              />
              <button 
                className="px-3 py-1 border-l"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            variant="primary" 
            size="large"
            onClick={handleAddToCart}
            className="w-full md:w-auto"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;