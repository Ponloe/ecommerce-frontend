import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assuming the API returns featured/newest products first
        const productsResponse = await axios.get('/products');
        setFeaturedProducts(productsResponse.data.slice(0, 8)); // Take first 8 products
        
        const categoriesResponse = await axios.get('/categories');
        setCategories(categoriesResponse.data);
        
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to E-Shop</h1>
          <Link to="/products">
            <Button size="large" className="bg-white text-indigo-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 hover:underline">
            View All
          </Link>
        </div>
        
        <ProductGrid products={featuredProducts} loading={loading} error={error} />
      </section>
      
      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading categories: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="bg-gray-100 rounded-lg p-6 text-center transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;