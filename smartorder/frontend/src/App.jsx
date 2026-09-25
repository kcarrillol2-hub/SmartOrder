import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Inventory from './pages/Inventory.jsx';
import Admin from './pages/Admin.jsx';


function Private({ children, roles }) {
  return <ProtectedRoute roles={roles}><Layout>{children}</Layout></ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/products" element={<Private><Products /></Private>} />
      <Route path="/cart" element={<Private roles={['CLIENTE']}><Cart /></Private>} />
      <Route path="/orders" element={<Private><Orders /></Private>} />
      <Route path="/inventory" element={<Private roles={['VENDEDOR','ADMINISTRADOR']}><Inventory /></Private>} />
      <Route path="/admin" element={<Private roles={['ADMINISTRADOR']}><Admin /></Private>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
