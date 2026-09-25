import React from 'react';
import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (e) { setError(e.response?.data?.message || 'Error'); }
  }

  useEffect(() => { load(); }, []);

  async function toggle(user) {
    try {
      await api.patch(`/users/${user.id}/status`, { activo: !user.activo });
      load();
    } catch (e) { setError(e.response?.data?.message || 'No se pudo actualizar'); }
  }

  return (
    <>
      <h1>Administración</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td>
                <td>{u.activo ? 'Sí' : 'No'}</td>
                <td><button onClick={() => toggle(u)}>{u.activo ? 'Desactivar' : 'Activar'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
