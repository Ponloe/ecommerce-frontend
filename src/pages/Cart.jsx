import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.info('Item removed from cart');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Order placed successfully!');
      clearCart();
      setCheckoutLoading(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products">
          <Button variant="primary" size="large">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-black">Items ({cart.length})</h2>
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {cart.map(item => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={`http://192.168.0.158:8000/storage/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <Link to={`/products/${item.id}`} className="font-medium text-black hover:text-indigo-600">
                        {item.name}
                      </Link>
                      <span className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">${item.price} each</div>
                    
                    {/* Quantity Control */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border rounded">
                        <button 
                          className="px-2 py-1 border-r"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-none focus:outline-none bg-transparent text-black"
                        />
                        <button 
                          className="px-2 py-1 border-l"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-black">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-black">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-black">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-black">$0.00</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-bold text-xl text-black">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
            
            <div className="mt-4">
              <Link to="/products" className="text-indigo-600 hover:underline text-sm">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;