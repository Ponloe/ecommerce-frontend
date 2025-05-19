import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductGrid from '../components/product/ProductGrid';
import Loading from '../components/common/Loading';
import ProductFilter from '../components/product/ProductFilter';
import PriceFilter from '../components/product/PriceFilter';

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
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort');

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
        if (minPriceParam) params.append('min_price', minPriceParam);
        if (maxPriceParam) params.append('max_price', maxPriceParam);
        if (sortParam) params.append('sort', sortParam);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        console.log('Fetching products with URL:', url);
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
  }, [categoryParam, brandParam, searchParam, minPriceParam, maxPriceParam, sortParam]);

  const handleFilterChange = (type, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value !== null) {
      newSearchParams.set(type, value);
    } else {
      newSearchParams.delete(type);
    }
    
    setSearchParams(newSearchParams);
  };

  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value);
  };

   return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters */}
      <aside className="w-full md:w-64">
        <ProductFilter 
          title="Categories"
          items={categories}
          activeId={categoryParam}
          onFilterChange={handleFilterChange}
          filterType="category"
        />
        
        <ProductFilter 
          title="Brands"
          items={brands}
          activeId={brandParam}
          onFilterChange={handleFilterChange}
          filterType="brand"
        />
        
        <PriceFilter 
          minPrice={minPriceParam ? Number(minPriceParam) : undefined}
          maxPrice={maxPriceParam ? Number(maxPriceParam) : undefined}
          onFilterChange={handleFilterChange}
        />
      </aside>
      
      {/* Products - with fixed minimum height */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">
              {categoryParam ? 
                categories.find(c => c.id.toString() === categoryParam)?.name || 'Products' : 
                brandParam ? 
                  brands.find(b => b.id.toString() === brandParam)?.name || 'Products' : 
                  'All Products'}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search products..."
                  className="border rounded-full py-2 px-4 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchParam || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value || null)}
                />
              </div>
              
              <select
                className="border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortParam || ''}
                onChange={handleSortChange}
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Add min-height to prevent layout shifts */}
        <div className="min-h-[600px]">
        {loading ? (
          <Loading />
        ) : products.length > 0 ? (
          <ProductGrid products={products} error={error} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M12 13a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-500 mb-2">No products found</h3>
            <p className="text-gray-400 max-w-md">
              Try adjusting your filters or search criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default ProductList;