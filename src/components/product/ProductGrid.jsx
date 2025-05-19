import ProductCard from './ProductCard';

function ProductGrid({ products, error }) {
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {products.length > 0 && products.length < 3 && 
        Array(3 - (products.length % 3 || 3)).fill().map((_, index) => (
          <div key={`empty-${index}`} className="hidden lg:block h-[380px]"></div>
        ))
      }
    </div>
  );
}

export default ProductGrid;