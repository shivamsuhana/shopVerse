import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './PaymentResult.css';

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string; status?: string } | null;

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/products');
    }
  }, [state, navigate]);

  if (!state?.orderId) return null;

  const isSuccess = state.status === 'paid';

  return (
    <div className="result-page">
      <div className="result-card">
        {isSuccess ? (
          <>
            <div className="result-icon success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1>Payment Successful!</h1>
            <p className="result-message">Your order has been placed successfully.</p>
            <div className="order-id-badge">
              <span>Order ID</span>
              <strong>{state.orderId}</strong>
            </div>
            <p className="delivery-note">You will receive a confirmation email shortly. Estimated delivery in 3-5 business days.</p>
            <div className="result-actions">
              <Link to="/orders" className="result-btn primary">View My Orders</Link>
              <Link to="/products" className="result-btn secondary">Continue Shopping</Link>
            </div>
          </>
        ) : (
          <>
            <div className="result-icon failure">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1>Payment Failed</h1>
            <p className="result-message">Unfortunately, your payment could not be processed.</p>
            <div className="order-id-badge failure">
              <span>Reference</span>
              <strong>{state.orderId}</strong>
            </div>
            <p className="delivery-note">Please check your card details and try again, or use a different payment method.</p>
            <div className="result-actions">
              <Link to="/checkout" className="result-btn primary">Try Again</Link>
              <Link to="/products" className="result-btn secondary">Back to Products</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
