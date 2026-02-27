'use client';

import { useState, useEffect } from 'react';
import { Calculator, AlertCircle, Check, X } from 'lucide-react';

export default function CostCalculator({ isOpen, onClose, setValue, role }) {
  const [formData, setFormData] = useState({ weight: '', hours: '' });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  // If role is not allowed, or modal is not open, do not render
  if (!['admin', 'master'].includes(role) || !isOpen) return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/admin/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(formData.weight),
          hours: parseFloat(formData.hours)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al calcular');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const applyPrice = () => {
    if (results && results.finalPrice) {
      setValue('precio', results.finalPrice, { shouldDirty: true, shouldValidate: true });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-cream w-full max-w-lg rounded-xl border-2 border-teal shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-dark p-4 flex items-center justify-between border-b-2 border-teal/30">
          <div className="flex items-center space-x-2 text-teal">
            <Calculator size={22} />
            <span className="font-heading font-bold uppercase tracking-widest text-lg">3D Cost Engine</span>
          </div>
          <button onClick={onClose} className="text-teal hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-dark/70 font-body">Peso de la pieza (g)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 150"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full p-3 bg-white border-2 border-dark/10 rounded focus:border-teal outline-none font-body text-base transition-colors"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-dark/70 font-body">Tiempo de Impresión (h)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 5.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full p-3 bg-white border-2 border-dark/10 rounded focus:border-teal outline-none font-body text-base transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating || !formData.weight || !formData.hours}
            className="w-full py-3 bg-teal text-white font-heading font-bold rounded-lg hover:bg-teal-light transition-all disabled:opacity-50 text-base shadow-lg shadow-teal/10 uppercase tracking-wider"
          >
            {isCalculating ? 'Procesando Motor...' : 'Calcular Precio Sugerido'}
          </button>

          {error && (
            <div className="p-4 bg-red-accent/10 text-red-accent text-sm rounded flex items-start space-x-3 border-2 border-red-accent/20">
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-body font-bold">{error}</span>
            </div>
          )}

          {results && (
            <div className="bg-white border-2 border-teal p-5 rounded-xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <h4 className="font-heading font-bold text-teal text-center border-b border-teal/10 pb-3 uppercase tracking-widest">Desglose Final</h4>
              
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-dark/60 uppercase text-[10px] font-bold tracking-tight">Costo Material:</span>
                  <span className="font-bold font-heading">ARS {results.breakdown.costoMaterial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60 uppercase text-[10px] font-bold tracking-tight">Costo Energía:</span>
                  <span className="font-bold font-heading">ARS {results.breakdown.costoEnergia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60 uppercase text-[10px] font-bold tracking-tight">Operación y Amort:</span>
                  <span className="font-bold font-heading">ARS {results.breakdown.costoLaboral + results.breakdown.costoAmortizacion}</span>
                </div>
                
                <div className="border-t-2 border-dashed border-teal/10 my-3"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-teal font-bold uppercase tracking-widest">PRECIO FINAL (ARS):</span>
                  <span className="text-2xl font-bold text-teal font-heading tracking-tighter">
                    $ {results.finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={applyPrice}
                  className="w-full py-4 bg-dark text-cream font-heading font-bold rounded-lg hover:bg-teal transition-all flex items-center justify-center space-x-3 text-lg shadow-xl group border-2 border-dark hover:border-teal"
                >
                  <Check size={24} className="group-hover:scale-110 transition-transform text-teal" />
                  <span className="uppercase tracking-widest">APLICAR Y CERRAR</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
