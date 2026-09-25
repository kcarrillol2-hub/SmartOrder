import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible registrarse');
    }
  }

  return (
    <div className="auth-card">
      <h1>Crear cuenta</h1>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit}>
        <label>Nombre<input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} required /></label>
        <label>Correo<input type="email" value={form.correo} onChange={e => setForm({...form, correo:e.target.value})} required /></label>
        <label>Contraseña<input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required /></label>
        <small>Mínimo 8 caracteres, una letra y un número.</small>
        <button className="primary">Registrar</button>
      </form>
      <p><Link to="/login">Volver al inicio de sesión</Link></p>
    </div>
  );
}
