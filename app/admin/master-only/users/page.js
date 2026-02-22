'use client';

import { useState, useEffect } from 'react';
import { Users, ShieldAlert, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function MasterUserManager() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDesc, setErrorDesc] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  
  // Custom fetch to append the token (or rely on browser cookies handling it automatically depending on auth design).
  // Assuming cookies are sent automatically with same-origin requests.
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 403) throw new Error('Acceso Denegado. Se requiere rango Master.');
        throw new Error('Error cargando usuarios');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setErrorDesc(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, email, newRole) => {
    if (!confirm(`¿Estás seguro de cambiar el rol de ${email} a ${newRole.toUpperCase()}?`)) return;

    try {
      setActionMessage(null);
      setErrorDesc(null);

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al cambiar rol');
      }

      setActionMessage(data.message);
      // Refresh user list
      fetchUsers();
    } catch (err) {
      setErrorDesc(err.message);
    }
  };

  const handleResetPassword = async (userId, email) => {
    if (!confirm(`¿Estás seguro de resetear la contraseña de ${email}? El sistema le asignará 'Temporal123!' por defecto.`)) return;

    try {
      setActionMessage(null);
      setErrorDesc(null);

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reset_password' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al resetear contraseña');

      setActionMessage(data.message);
    } catch (err) {
      setErrorDesc(err.message);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!confirm(`⚠️ ALERTA CRÍTICA: ¿Estás ABSOLUTAMENTE SEGURO de eliminar por completo la cuenta de ${email}? Esta acción no se puede deshacer.`)) return;

    try {
      setActionMessage(null);
      setErrorDesc(null);

      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar usuario');

      setActionMessage(data.message);
      fetchUsers();
    } catch (err) {
      setErrorDesc(err.message);
    }
  };

  if (isLoading) return <div className="text-center py-12">Cargando base de usuarios...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b-2 border-red-accent/20 pb-4 mb-8">
        <div className="flex items-center space-x-3">
          <ShieldAlert size={32} className="text-red-accent" />
          <h1 className="text-3xl font-heading font-bold text-dark">
            Master Zone: User Manager
          </h1>
        </div>
      </div>

      {errorDesc && (
        <div className="p-4 bg-red-accent/10 border-l-4 border-red-accent text-red-accent font-body">
          {errorDesc}
        </div>
      )}

      {actionMessage && (
        <div className="p-4 bg-teal/10 border-l-4 border-teal text-teal font-body">
          {actionMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-dark/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark text-cream font-heading">
                <th className="p-4 border-b border-dark/20 text-sm">Usuario</th>
                <th className="p-4 border-b border-dark/20 text-sm">Email</th>
                <th className="p-4 border-b border-dark/20 text-sm">Rol Actual</th>
                <th className="p-4 border-b border-dark/20 text-sm">Último Login</th>
                <th className="p-4 border-b border-dark/20 text-sm">Gestión de Roles</th>
                <th className="p-4 border-b border-dark/20 text-sm text-center">Acciones Críticas</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-dark/80">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-black/5 transition-colors border-b border-dark/10 last:border-0">
                  <td className="p-4 font-bold">{user.nombre} {user.apellido}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'master' ? 'bg-red-accent text-white' : 
                      user.role === 'admin' ? 'bg-teal text-white' : 
                      'bg-dark/10 text-dark'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                  </td>
                  <td className="p-4 text-center items-center">
                    {user.role === 'master' ? (
                      <span className="text-xs text-red-accent font-bold flex items-center justify-center">
                        <ShieldCheck size={14} className="mr-1"/> Master
                      </span>
                    ) : (
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, user.email, e.target.value)}
                        className="bg-cream border border-dark/20 rounded p-1 text-xs outline-none focus:border-teal"
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    )}
                  </td>
                  <td className="p-4 text-center flex space-x-2 items-center justify-center">
                     {user.role === 'master' ? (
                        <span className="text-xs text-dark/40 italic">Inmune</span>
                     ) : (
                        <>
                          <button 
                            onClick={() => handleResetPassword(user._id, user.email)}
                            className="bg-teal text-cream px-3 py-1 rounded text-xs font-bold hover:bg-teal-light transition-colors"
                          >
                            Reset Pass
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id, user.email)}
                            className="bg-red-accent text-cream px-3 py-1 rounded text-xs font-bold hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center p-8 text-dark/50 italic">No hay usuarios registrados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
