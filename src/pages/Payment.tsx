import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, computeTotal } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import './Payment.css';

export default function Payment() {
  const { items, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // This ref prevents the empty-cart redirect after successful payment
  const paymentDone = useRef(false);

  const total = computeTotal(items);

  // Redirect if cart is empty AND payment hasn't just completed
  useEffect(() => {
    if (items.length === 0 && !processing && !paymentDone.current) {
      navigate('/products', { replace: true });
    }
  }, [items.length, processing, navigate]);

  if (items.length === 0 && !paymentDone.current) return null;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 16) newErrors.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (expiry.length < 5) newErrors.expiry = 'Enter a valid expiry date';
    if (cvv.length < 3) newErrors.cvv = 'Enter a valid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    setProcessing(true);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 80% chance of success, 20% failure
    const success = Math.random() < 0.8;
    const status = success ? 'paid' : 'failed';

    const order = placeOrder([...items], status);

    // Mark payment as done BEFORE clearing cart
    // This prevents the useEffect from redirecting to /products
    paymentDone.current = true;

    if (success) {
      clearCart();
    }

    setProcessing(false);

    // Navigate to result page with order data
    navigate('/payment/result', { state: { orderId: order.id, status } });
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-card-section">
          <h1>Payment</h1>
          <p className="payment-subtitle">Enter your card details to complete the purchase</p>

          <div className="card-preview">
            <div className="card-chip"></div>
            <div className="card-number-display">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="card-bottom">
              <div>
                <span className="card-label">Card Holder</span>
                <span className="card-value">{cardName || 'YOUR NAME'}</span>
              </div>
              <div>
                <span className="card-label">Expires</span>
                <span className="card-value">{expiry || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          <div className="payment-form">
            <div className="pay-field">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <span className="pay-error">{errors.cardNumber}</span>}
            </div>

            <div className="pay-field">
              <label>Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Krishu"
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <span className="pay-error">{errors.cardName}</span>}
            </div>

            <div className="pay-row">
              <div className="pay-field">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={errors.expiry ? 'error' : ''}
                />
                {errors.expiry && <span className="pay-error">{errors.expiry}</span>}
              </div>
              <div className="pay-field">
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="pay-error">{errors.cvv}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="payment-summary">
          <h2>Order Total</h2>
          <div className="payment-amount">₹{total.toLocaleString()}</div>
          <p className="payment-items-count">{items.length} item{items.length > 1 ? 's' : ''} in cart</p>

          <button
            className={`pay-now-btn ${processing ? 'processing' : ''}`}
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="pay-spinner"></span>
                Processing Payment...
              </>
            ) : (
              `Pay ₹${total.toLocaleString()}`
            )}
          </button>

          <p className="secure-text">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure payment — your details are encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
