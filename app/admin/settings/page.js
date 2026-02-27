'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function MasterSettingsPage() {
  const [settings, setSettings] = useState({
    spoolPrice: 0,
    spoolWeight: 1000,
    energyCost: 0,
    printerWattage: 0,
    laborRate: 0,
    amortizationPerHour: 0,
    errorMargin: 0,
    profitMargin: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        // Extract only the fields we need to avoid Mongoose metadata issues
        const { _id, key, __v, updatedAt, ...cleanSettings } = data;
        setSettings(cleanSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Error al guardar la configuración');

      setStatus({ type: 'success', message: 'Configuración guardada exitosamente' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-teal">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-heading font-bold">Cargando Motor de Costos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8 border-b-2 border-dark/10 pb-4">
        <SettingsIcon size={32} className="text-teal" />
        <h1 className="text-4xl font-heading font-bold text-dark uppercase tracking-tighter">
          Configuración Maestro
        </h1>
      </div>

      <p className="font-body text-dark/60 mb-8 max-w-2xl">
        Ajusta los valores base para el cálculo automático de precios. Estos valores impactan directamente en el <span className="text-teal font-bold uppercase">3D Printing Cost Engine</span>.
      </p>

      {status && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 ${
          status.type === 'success' ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-red-accent/10 text-red-accent border border-red-accent/20'
        }`}>
          {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <p className="font-bold">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border-2 border-dark/10 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-dark p-4">
          <h2 className="text-cream font-heading font-bold text-lg flex items-center space-x-2">
            <span>VALORES DEL SISTEMA</span>
          </h2>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Material */}
          <section className="space-y-4">
            <h3 className="text-teal font-heading font-bold uppercase text-xs border-b border-teal/10 pb-1">Filamento</h3>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Precio Spool (ARS)</label>
              <input 
                type="number" name="spoolPrice" value={settings.spoolPrice} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Peso Spool (gramos)</label>
              <input 
                type="number" name="spoolWeight" value={settings.spoolWeight} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
          </section>

          {/* Infrastructure */}
          <section className="space-y-4">
            <h3 className="text-teal font-heading font-bold uppercase text-xs border-b border-teal/10 pb-1">Infraestructura</h3>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Costo Energía (ARS/kWh)</label>
              <input 
                type="number" step="0.01" name="energyCost" value={settings.energyCost} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Consumo Impresora (Watts)</label>
              <input 
                type="number" name="printerWattage" value={settings.printerWattage} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
          </section>

          {/* Labor & Amortization */}
          <section className="space-y-4">
            <h3 className="text-teal font-heading font-bold uppercase text-xs border-b border-teal/10 pb-1">Operación</h3>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Mano de Obra (ARS/h)</label>
              <input 
                type="number" name="laborRate" value={settings.laborRate} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Amortización (ARS/h)</label>
              <input 
                type="number" name="amortizationPerHour" value={settings.amortizationPerHour} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
          </section>

          {/* Margins */}
          <section className="space-y-4">
            <h3 className="text-teal font-heading font-bold uppercase text-xs border-b border-teal/10 pb-1">Márgenes</h3>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Margen de Error (%)</label>
              <input 
                type="number" name="errorMargin" value={settings.errorMargin} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 font-body">Margen de Ganancia (%)</label>
              <input 
                type="number" name="profitMargin" value={settings.profitMargin} onChange={handleChange}
                className="w-full p-2 border-2 border-dark/10 rounded focus:border-teal outline-none font-body"
              />
            </div>
          </section>
        </div>

        <div className="bg-cream/50 p-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-teal text-white font-heading font-bold px-10 py-3 rounded-lg hover:bg-teal-light transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            <span>{isSaving ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
