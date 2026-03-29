'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { User, MapPin, Phone, Mail, Edit2, Key, CheckCircle, XCircle, ChevronLeft, Bell } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useStore();
  
  // Vista activa: 'info' | 'edit-profile' | 'change-password' | 'notifications'
  const [activeView, setActiveView] = useState('info');

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Form states
  const [profileForm, setProfileForm] = useState({
    telefono: '',
    calle: '',
    altura: '',
    ciudad: '',
    codigoPostal: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorDesc, setErrorDesc] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && activeView === 'info') {
      // Pre-fill form when user data is available
      setProfileForm({
        telefono: user.telefono || '',
        calle: user.direccion?.calle || '',
        altura: user.direccion?.altura || '',
        ciudad: user.direccion?.ciudad || '',
        codigoPostal: user.direccion?.codigoPostal || ''
      });
    }

    if (isAuthenticated && user) {
      fetch('/api/users/notifications')
        .then(res => res.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.notifications.filter(n => !n.leido).length);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, user, router, activeView]);

  const markNotificationAsRead = async (id) => {
    try {
      const res = await fetch(`/api/users/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, leido: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorDesc(null);

    const payload = {
      telefono: profileForm.telefono,
      direccion: {
        calle: profileForm.calle,
        altura: profileForm.altura,
        ciudad: profileForm.ciudad,
        codigoPostal: profileForm.codigoPostal
      }
    };

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Actualizamos el estado global para reflejar los cambios en la UI sin recargar
        setUser(data.user, null);
        setTimeout(() => setActiveView('info'), 2000);
      } else {
        setErrorDesc(data.message || 'Error al actualizar el perfil.');
      }
    } catch (err) {
      setErrorDesc('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorDesc(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorDesc('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setPasswordForm({ newPassword: '', confirmNewPassword: '' });
        setTimeout(() => setActiveView('info'), 2000);
      } else {
        setErrorDesc(data.message || 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      setErrorDesc('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-dark/10 rounded-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar / Header Nav */}
          <div className="bg-dark text-cream p-8 md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="bg-cream/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6 relative">
                <User size={40} className="text-teal" />
                {user.role && user.role !== 'user' && (
                  <span className="absolute -top-1 -right-1 bg-red-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {user.role}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-heading font-bold mb-1">
                {user.nombre} {user.apellido}
              </h1>
              <p className="text-teal font-body text-sm mb-8">{user.email}</p>

              <nav className="space-y-4">
                <button
                  onClick={() => { setActiveView('info'); setMessage(null); setErrorDesc(null); }}
                  className={`flex items-center space-x-3 w-full p-2 rounded transition-colors ${activeView === 'info' ? 'bg-teal text-dark font-bold' : 'hover:bg-teal/20'}`}
                >
                  <User size={18} />
                  <span>Mi Resumen</span>
                </button>
                <button
                  onClick={() => { setActiveView('edit-profile'); setMessage(null); setErrorDesc(null); }}
                  className={`flex items-center space-x-3 w-full p-2 rounded transition-colors ${activeView === 'edit-profile' ? 'bg-teal text-dark font-bold' : 'hover:bg-teal/20'}`}
                >
                  <Edit2 size={18} />
                  <span>Editar Información</span>
                </button>
                <button
                  onClick={() => { setActiveView('change-password'); setMessage(null); setErrorDesc(null); }}
                  className={`flex items-center space-x-3 w-full p-2 rounded transition-colors ${activeView === 'change-password' ? 'bg-red-accent text-white font-bold' : 'hover:bg-red-accent/20'}`}
                >
                  <Key size={18} />
                  <span>Cambiar Contraseña</span>
                </button>
                <button
                  onClick={() => { setActiveView('notifications'); setMessage(null); setErrorDesc(null); }}
                  className={`flex items-center space-x-3 w-full p-2 rounded transition-colors justify-between ${activeView === 'notifications' ? 'bg-teal text-dark font-bold' : 'hover:bg-teal/20'}`}
                >
                  <div className="flex items-center space-x-3">
                    <Bell size={18} />
                    <span>Notificaciones</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {user.role && ['admin', 'master'].includes(user.role) && (
              <div className="mt-12">
                <button 
                  onClick={() => router.push('/admin')}
                  className="w-full bg-red-accent hover:bg-red-600 text-white px-4 py-3 rounded font-bold font-heading transition-colors"
                >
                  Ir al Admin Panel
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="p-8 md:w-2/3">
            {message && (
              <div className="mb-6 p-4 bg-teal/10 border-l-4 border-teal text-teal font-body flex items-center">
                <CheckCircle size={20} className="mr-2" /> {message}
              </div>
            )}
            {errorDesc && (
              <div className="mb-6 p-4 bg-red-accent/10 border-l-4 border-red-accent text-red-accent font-body flex items-center">
                <XCircle size={20} className="mr-2" /> {errorDesc}
              </div>
            )}

            {/* VISTA: INFORMACIÓN */}
            {activeView === 'info' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-heading font-bold text-dark mb-6 border-b-2 border-dark/10 pb-4">
                  Información Personal
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal/10 p-3 rounded-full">
                      <Phone size={24} className="text-teal" />
                    </div>
                    <div>
                      <p className="text-sm text-dark/60 font-body">Teléfono Registrado</p>
                      <p className="font-heading font-bold text-dark text-lg">{user.telefono || 'No registrado'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-teal/10 p-3 rounded-full">
                      <MapPin size={24} className="text-teal" />
                    </div>
                    <div>
                      <p className="text-sm text-dark/60 font-body">Dirección de Envío</p>
                      {user.direccion?.calle ? (
                        <p className="font-heading font-bold text-dark text-lg leading-tight">
                          {user.direccion.calle} {user.direccion.altura}
                          <br />
                          <span className="text-sm text-dark/80 font-body">{user.direccion.ciudad}, CP {user.direccion.codigoPostal}</span>
                        </p>
                      ) : (
                        <p className="font-heading font-bold text-dark text-lg">No registrada</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-dark/5 rounded-lg border-2 border-dashed border-dark/20 text-center">
                  <h3 className="text-lg font-heading font-bold text-dark/70 mb-2">
                    Próximamente
                  </h3>
                  <p className="text-sm text-dark/50 font-body">Historial de Compras y Pedidos en Curso</p>
                </div>
              </div>
            )}

            {/* VISTA: EDITAR PERFIL */}
            {activeView === 'edit-profile' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-2 border-b-2 border-dark/10 pb-4 mb-6">
                  <button onClick={() => setActiveView('info')} className="text-dark/50 hover:text-dark">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-heading font-bold text-dark">
                    Actualizar Datos
                  </h2>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-1">Teléfono</label>
                    <input
                      type="text"
                      required
                      value={profileForm.telefono}
                      onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })}
                      className="w-full px-4 py-2 bg-cream border border-dark/20 rounded focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-dark mb-1">Calle de envío</label>
                      <input
                        type="text"
                        required
                        value={profileForm.calle}
                        onChange={(e) => setProfileForm({ ...profileForm, calle: e.target.value })}
                        className="w-full px-4 py-2 bg-cream border border-dark/20 rounded outline-none focus:border-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-1">Altura</label>
                      <input
                        type="text"
                        required
                        value={profileForm.altura}
                        onChange={(e) => setProfileForm({ ...profileForm, altura: e.target.value })}
                        className="w-full px-4 py-2 bg-cream border border-dark/20 rounded outline-none focus:border-teal"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-dark mb-1">Ciudad</label>
                      <input
                        type="text"
                        required
                        value={profileForm.ciudad}
                        onChange={(e) => setProfileForm({ ...profileForm, ciudad: e.target.value })}
                        className="w-full px-4 py-2 bg-cream border border-dark/20 rounded outline-none focus:border-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-dark mb-1">C. Postal</label>
                      <input
                        type="text"
                        required
                        value={profileForm.codigoPostal}
                        onChange={(e) => setProfileForm({ ...profileForm, codigoPostal: e.target.value })}
                        className="w-full px-4 py-2 bg-cream border border-dark/20 rounded outline-none focus:border-teal"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal text-white font-bold py-3 rounded hover:bg-teal-light transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando cambios...' : 'Guardar Información'}
                  </button>
                </form>
              </div>
            )}

            {/* VISTA: CAMBIAR CONTRASEÑA */}
            {activeView === 'change-password' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-2 border-b-2 border-dark/10 pb-4 mb-6">
                  <button onClick={() => setActiveView('info')} className="text-dark/50 hover:text-dark">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-heading font-bold text-dark">
                    Cambio de Credenciales
                  </h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-dark mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-cream border border-dark/20 rounded focus:border-red-accent focus:ring-1 focus:ring-red-accent outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark mb-1">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                      className="w-full px-4 py-2 bg-cream border border-dark/20 rounded outline-none focus:border-red-accent font-sans"
                    />
                  </div>
                  
                  <div className="bg-red-accent/10 p-4 border-l-4 border-red-accent rounded">
                    <p className="text-xs text-dark/70 font-body">
                      Por seguridad, usar combinaciones de más de 8 caracteres que incluyan símbolos y letras. Al aceptar se sobrescribirá tu contraseña actual.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-accent text-white font-bold py-3 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Actualizando...' : 'Confirmar Nueva Contraseña'}
                  </button>
                </form>
              </div>
            )}

            {/* VISTA: NOTIFICACIONES */}
            {activeView === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-heading font-bold text-dark mb-6 border-b-2 border-dark/10 pb-4">
                  Mis Notificaciones
                </h2>
                
                {notifications.length === 0 ? (
                  <p className="text-dark/60 font-body">No tienes notificaciones por el momento.</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`p-4 rounded-lg border-2 ${notif.leido ? 'bg-white border-dark/10' : 'bg-teal/5 border-teal/30'} transition-all`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {!notif.leido && <div className="w-2 h-2 rounded-full bg-red-accent"></div>}
                              <h3 className={`font-heading ${notif.leido ? 'text-dark/80 font-semibold' : 'text-dark font-bold text-lg'}`}>
                                {notif.titulo}
                              </h3>
                            </div>
                            <p className={`font-body text-sm ${notif.leido ? 'text-dark/60' : 'text-dark/90'}`}>
                              {notif.mensaje}
                            </p>
                            <span className="text-xs text-dark/40 mt-2 block">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {!notif.leido && (
                            <button 
                              onClick={() => markNotificationAsRead(notif._id)}
                              className="text-xs bg-teal/20 text-teal-dark px-3 py-1 rounded hover:bg-teal hover:text-white transition-colors ml-4"
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
