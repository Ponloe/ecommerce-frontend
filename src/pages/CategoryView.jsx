import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Loading from '../components/common/Loading';

function CategoryView() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);

        // Fetch the category details
        const categoryResponse = await axios.get(`/categories/${id}`);
        setCategory(categoryResponse.data);
        
        // Fetch products for this category
        const productsResponse = await axios.get(`/products?category_id=${id}`);
        setProducts(productsResponse.data);
        
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading category: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {category && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 mb-4">{category.description}</p>
          )}
        </div>
      )}
      
      {/* Display products in a grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Products in this category</h2>
      </div>
      
      <ProductGrid products={products} error={error} />
    </div>
  );
}

export default CategoryView;