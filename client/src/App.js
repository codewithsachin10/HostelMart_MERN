// client/src/App.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';

// --- Lazy Load Pages ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const AddressBookPage = lazy(() => import('./pages/AddressBookPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminCustomersPage = lazy(() => import('./pages/AdminCustomersPage'));
const AdminAnnouncementPage = lazy(() => import('./pages/AdminAnnouncementPage')); // 👈 IMPORT
const HelpPage = lazy(() => import('./pages/HelpPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* --- Private User Routes --- */}
          <Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} /> 
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
          <Route path="/addresses" element={<PrivateRoute><AddressBookPage /></PrivateRoute>} />
          
          {/* --- Private Admin Routes --- */}
          <Route path="/admin/orders" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><AdminProductsPage /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><AdminCustomersPage /></PrivateRoute>} />
          <Route path="/admin/announce" element={<PrivateRoute><AdminAnnouncementPage /></PrivateRoute>} /> {/* 👈 NEW ROUTE */}
          <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
          
        </Routes>
      </Suspense>
    </>
  );
}

export default App;