import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(correo, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible iniciar sesión');
    }
  }

  return (
    <div className="auth-card">
      <h1>SmartOrder</h1>
      <p>Inicia sesión</p>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit}>
        <label>Correo<input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required /></label>
        <label>Contraseña<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button className="primary">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
      <div className="demo">
        <strong>Demo:</strong><br />
        admin@smartorder.local / Admin1234<br />
        vendedor@smartorder.local / Vendedor123<br />
        cliente@smartorder.local / Cliente123
      </div>
    </div>
  );
}
