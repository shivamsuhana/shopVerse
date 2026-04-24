import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { useCartStore } from '../store/cartStore';
import { showToast } from './Toast';
import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock && !justAdded) {
      addItem(product);
      setJustAdded(true);
      showToast(`${product.name} added to cart!`);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {!product.inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <div className="card-pricing">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button
          className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''} ${justAdded ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {justAdded ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </Link>
  );
}
