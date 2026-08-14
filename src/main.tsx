import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Safely wrap localStorage.setItem to prevent QuotaExceededError crashes
if (typeof window !== 'undefined' && window.localStorage) {
  const originalSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function(key, value) {
    try {
      originalSetItem.apply(this, [key, value]);
    } catch (e: any) {
      console.warn(`LocalStorage quota exceeded when setting key: ${key}. Clearing some space...`);
      try {
        // Clear typically large auto-generated keys to make space if needed
        if (key !== 'general_media_gallery') window.localStorage.removeItem('general_media_gallery');
        if (key !== 'docomeco_articles') window.localStorage.removeItem('docomeco_articles');
        // Try again
        originalSetItem.apply(this, [key, value]);
      } catch (e2) {
        console.error(`Failed to save to localStorage for key: ${key}`, e2);
      }
    }
  };
}

// Register Service Worker for PWA
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("PWA Service Worker registered successfully:", reg.scope);
      })
      .catch((err) => {
        console.error("PWA Service Worker registration failed:", err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
