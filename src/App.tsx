import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast';

// Pages
import SignIn from './pages/SignIn';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentResult from './pages/PaymentResult';
import Orders from './pages/Orders';

// Layout wrapper — renders Navbar + page content + toast notifications
function Layout() {
  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sign In — no navbar */}
        <Route path="/signin" element={<SignIn />} />

        {/* All routes with navbar */}
        <Route element={<Layout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Protected routes — require authentication */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/payment/result" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
