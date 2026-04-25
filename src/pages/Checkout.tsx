import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, computeSubtotal, computeTax, computeTotal } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import type { ShippingAddress } from '../types';
import './Checkout.css';

export default function Checkout() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const setShippingAddress = useOrderStore((s) => s.setShippingAddress);
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Add some products to proceed to checkout</p>
        <button onClick={() => navigate('/products')} className="shop-btn">Browse Products</button>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.address.trim()) newErrors.address = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (address.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validate()) {
      setShippingAddress(address);
      navigate('/payment');
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h2>Shipping Address</h2>
          <div className="checkout-form">
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Krishu"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Address</label>
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-field">
                <label>City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="form-field">
                <label>State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="field-error">{errors.state}</span>}
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-field">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="400001"
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.product.id} className="summary-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="summary-item-info">
                  <h4>{item.product.name}</h4>
                  <p>₹{item.product.price.toLocaleString()} × {item.quantity}</p>
                  <div className="summary-item-controls">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    <button className="remove" onClick={() => removeItem(item.product.id)}>Remove</button>
                  </div>
                </div>
                <span className="summary-item-total">₹{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-line"><span>Subtotal</span><span>₹{computeSubtotal(items).toLocaleString()}</span></div>
            <div className="summary-line"><span>Tax (18% GST)</span><span>₹{computeTax(items).toLocaleString()}</span></div>
            <div className="summary-line"><span>Shipping</span><span className="free">FREE</span></div>
            <div className="summary-line total"><span>Total</span><span>₹{computeTotal(items).toLocaleString()}</span></div>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
