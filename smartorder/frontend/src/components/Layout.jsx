import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function exit() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/dashboard" className="brand">SmartOrder</Link>
        <nav>
          <Link to="/products">Productos</Link>
          {user?.rol === 'CLIENTE' && <Link to="/cart">Carrito</Link>}
          <Link to="/orders">Pedidos</Link>
          {(user?.rol === 'VENDEDOR' || user?.rol === 'ADMINISTRADOR') && <Link to="/inventory">Inventario</Link>}
          {user?.rol === 'ADMINISTRADOR' && <Link to="/admin">Administración</Link>}
          <button onClick={exit} className="link-button">Salir</button>
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
