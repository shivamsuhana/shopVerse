import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import './Orders.css';

export default function Orders() {
  const orders = useOrderStore((s) => s.orders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    processing: '#fbbf24',
    shipped: '#60a5fa',
    delivered: '#34d399',
    cancelled: '#f87171',
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <span>📦</span>
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here</p>
        <Link to="/products" className="orders-shop-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <p className="orders-subtitle">{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div
              className="order-header"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="order-header-left">
                <div className="order-id">{order.id}</div>
                <div className="order-date">
                  {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="order-header-right">
                <span
                  className="status-badge"
                  style={{ color: statusColors[order.status], background: `${statusColors[order.status]}15` }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="order-total">₹{order.total.toLocaleString()}</span>
                <svg
                  className={`expand-icon ${expandedId === order.id ? 'expanded' : ''}`}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {expandedId === order.id && (
              <div className="order-details">
                <div className="order-items-list">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="order-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="order-item-info">
                        <h4>{item.product.name}</h4>
                        <p>₹{item.product.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <span className="order-item-total">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address">
                    <h4>Shipping Address</h4>
                    <p>
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div className="order-totals">
                    <div className="order-total-line"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
                    <div className="order-total-line"><span>Tax</span><span>₹{order.tax.toLocaleString()}</span></div>
                    <div className="order-total-line bold"><span>Total</span><span>₹{order.total.toLocaleString()}</span></div>
                    <div className="order-total-line">
                      <span>Payment</span>
                      <span className={order.paymentStatus === 'paid' ? 'paid' : 'failed'}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '✗ Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
