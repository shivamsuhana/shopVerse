import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { showToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    showToast(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="detail-content">
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <img src={product.image} alt={product.name} className="detail-image" />
            {discount > 0 && <span className="detail-discount">-{discount}% OFF</span>}
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-rating">
            <span className="detail-stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="detail-rating-text">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="detail-pricing">
            <span className="detail-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="detail-original">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {discount > 0 && <span className="detail-save">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((f, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-stock">
            <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>

          {product.inStock && (
            <div className="detail-actions">
              <div className="qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={`detail-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-section">
          <h2>Related Products</h2>
          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
