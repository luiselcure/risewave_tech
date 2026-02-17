'use client';

import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import useStore from '@/lib/store';

export default function RisiChatbot() {
  const { user, isAuthenticated } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: isAuthenticated
        ? `¡Hola ${user?.nombre}! Soy Risi, ¿necesitas ayuda con tu proyecto?`
        : 'Hola, soy Risi. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');

  const faqs = {
    envios: 'Realizamos envíos a todo el país. El tiempo de entrega es de 48-72 horas.',
    materiales: 'Usamos PLA, PETG y ABS de alta calidad. Todos nuestros materiales son eco-friendly.',
    tiempos: 'El tiempo de producción varía según la complejidad, pero generalmente es de 24-48 horas.',
    personalizado: 'Sí, ofrecemos servicios de diseño personalizado. Contáctanos para más información.',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { type: 'user', text: input }]);

    // Simple response logic
    let response = 'Lo siento, no entendí tu pregunta. ¿Podrías ser más específico?';
    
    if (input.toLowerCase().includes('envio') || input.toLowerCase().includes('envío')) {
      response = faqs.envios;
    } else if (input.toLowerCase().includes('material')) {
      response = faqs.materiales;
    } else if (input.toLowerCase().includes('tiempo') || input.toLowerCase().includes('cuanto')) {
      response = faqs.tiempos;
    } else if (input.toLowerCase().includes('personalizado') || input.toLowerCase().includes('custom')) {
      response = faqs.personalizado;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
    }, 500);

    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal text-cream p-4 rounded-full shadow-lg hover:bg-teal-light transition-all z-50"
      >
        <Bot size={32} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white border-2 border-dark/20 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-teal text-cream p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-cream rounded-full p-2">
                <Bot size={24} className="text-teal" />
              </div>
              <div>
                <h3 className="font-heading font-bold">Risi</h3>
                <p className="text-xs text-cream/80">Tu asesor de IA OKE</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-cream/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-red-accent text-cream'
                      : 'bg-white border border-dark/10 text-dark'
                  }`}
                >
                  <p className="text-sm font-body">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-dark/10 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribí acá tu consulta..."
                className="flex-1 px-3 py-2 border border-dark/20 rounded font-body text-sm focus:outline-none focus:border-teal"
              />
              <button
                onClick={handleSend}
                className="bg-teal text-cream p-2 rounded hover:bg-teal-light transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
