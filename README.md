<div align="center">
  
  # 🛍️ ShopVerse
  **A Modern, Responsive E-Commerce Experience**
  
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Zustand](https://img.shields.io/badge/Zustand-State_Management-7b361a?style=for-the-badge)](https://github.com/pmndrs/zustand)
  
  <br />
  
  ### 🌐 [Live Demo: shopverse-krishu.vercel.app](https://shopverse-krishu.vercel.app)
  
</div>

<br />

Welcome to **ShopVerse**! This project is a fully functional frontend e-commerce web application built from scratch. It features a sleek glassmorphism design, simulated payment processing, and comprehensive state management—developed as part of the **Internshala Frontend Assignment**.

---

## ✨ Key Features

- 🔐 **Authentication Flow** — Login and Register pages with form validation.
- 🛍️ **Dynamic Product Catalog** — Product listings, category tags, ratings, and stock indicators.
- 🛒 **Persistent Shopping Cart** — A smooth slide-out sidebar cart that remembers your items even after a page refresh.
- 💳 **Simulated Payment Gateway** — Live credit card preview UI with a realistic 2.5s processing delay and algorithm-based success/failure states.
- 📦 **Order Management** — Complete order history with expandable details and payment status tracking.
- 🔔 **Toast Notifications** — Custom-built, non-intrusive toast notifications for user feedback.
- 🎨 **Premium UI/UX** — Dark-mode glassmorphism aesthetics, fluid micro-animations, and full mobile-first responsiveness.

---

## 🛠️ Tech Stack

- **Framework**: React.js (via Vite)
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand (with `localStorage` persistence)
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Animations)

---

## 🏗️ Architecture & State Management

The application completely relies on **Zustand** for lightweight, scalable state management, entirely avoiding Prop Drilling. 

- `authStore.ts` — Manages user session state.
- `cartStore.ts` — Handles cart items, quantity updates, and tax (18% GST) computations.
- `orderStore.ts` — Processes completed checkouts and saves historical order data.

> *Note: Since this is a frontend-only assignment, all data is mocked and persisted locally using the browser's `localStorage` to simulate a real backend environment.*

---

## 💳 Payment Flow Simulation

To demonstrate realistic application behavior, the payment section includes a simulated gateway:
- **Validation**: Strict client-side validation for address and card details.
- **Processing**: A visual loading state that mimics network latency.
- **Randomized Outcome**: Uses an algorithm to generate an **80% success and 20% failure rate**, routing users to the appropriate Result Screen and saving the corresponding order status.

---

<div align="center">
  <p>Crafted with ❤️ for the Internshala Assignment</p>
</div>
