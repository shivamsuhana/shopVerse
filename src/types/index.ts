// All shared TypeScript interfaces for the application

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  total: number;
  subtotal: number;
  tax: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'failed';
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
