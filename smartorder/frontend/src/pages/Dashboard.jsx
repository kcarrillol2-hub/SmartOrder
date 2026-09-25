import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <h1>Dashboard</h1>
      <div className="card">
        <h2>Bienvenido, {user?.nombre}</h2>
        <p>Rol: <strong>{user?.rol}</strong></p>
        <p>Utiliza el menú para administrar productos, pedidos e inventario.</p>
      </div>
    </>
  );
}
