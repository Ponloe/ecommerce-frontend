import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;