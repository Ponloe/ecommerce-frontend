import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Loading from '../components/common/Loading';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          axios.get('/categories'),
          axios.get('/brands')
        ]);
        
        setCategories(categoriesResponse.data);
        setBrands(brandsResponse.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query string based on filter params
        let url = '/products';
        const params = new URLSearchParams();
        
        if (categoryParam) params.append('category_id', categoryParam);
        if (brandParam) params.append('brand_id', brandParam);
        if (searchParam) params.append('search', searchParam);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, brandParam, searchParam]);

  const handleFilterChange = (type, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value) {
      newSearchParams.set(type, value);
    } else {
      newSearchParams.delete(type);
    }
    
    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters */}
      <aside className="w-full md:w-64">
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h3 className="font-bold text-lg mb-3 text-black">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full text-left hover:text-indigo-600 ${!categoryParam ? 'font-medium text-indigo-600' : ''}`}
                onClick={() => handleFilterChange('category', null)}
              >
                All Categories
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <button 
                  className={`w-full text-left hover:text-indigo-600 ${categoryParam === category.id.toString() ? 'font-medium text-indigo-600' : ''}`}
                  onClick={() => handleFilterChange('category', category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-3 text-black">Brands</h3>
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full text-left hover:text-indigo-600 ${!brandParam ? 'font-medium text-indigo-600' : ''}`}
                onClick={() => handleFilterChange('brand', null)}
              >
                All Brands
              </button>
            </li>
            {brands.map(brand => (
              <li key={brand.id}>
                <button 
                  className={`w-full text-left hover:text-indigo-600 ${brandParam === brand.id.toString() ? 'font-medium text-indigo-600' : ''}`}
                  onClick={() => handleFilterChange('brand', brand.id)}
                >
                  {brand.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      
      {/* Products */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {categoryParam ? 
                categories.find(c => c.id.toString() === categoryParam)?.name || 'Products' : 
                brandParam ? 
                  brands.find(b => b.id.toString() === brandParam)?.name || 'Products' : 
                  'All Products'}
            </h1>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Search products..."
                className="border rounded-full py-2 px-4 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchParam || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <Loading />
        ) : (
          <ProductGrid products={products} error={error} />
        )}
      </div>
    </div>
  );
}

export default ProductList;