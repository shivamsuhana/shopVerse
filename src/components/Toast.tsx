import { useState, useEffect, useCallback } from 'react';
import './Toast.css';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

// Global listeners for toast events
let toastListeners: Array<(msg: Omit<ToastMessage, 'id'>) => void> = [];

// Call this from ANYWHERE to show a toast — no need for context/props
export function showToast(text: string, type: 'success' | 'error' | 'info' = 'success') {
  toastListeners.forEach((listener) => listener({ text, type }));
}

// Place this component once in your app (inside Layout)
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...msg, id }]);

    // Auto-remove after 2.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✗'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-text">{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
