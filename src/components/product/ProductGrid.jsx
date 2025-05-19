import ProductCard from './ProductCard';
import Loading from '../common/Loading';

function ProductGrid({ products, loading, error }) {
  if (loading) return <Loading />;
  
  if (error) return (
    <div className="text-center text-red-500 py-8">
      Error loading products: {error.message}
    </div>
  );
  
  if (!products || products.length === 0) return (
    <div className="text-center text-gray-500 py-8">
      No products found.
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;