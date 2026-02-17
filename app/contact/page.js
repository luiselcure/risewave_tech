'use client';

import { Mail, Instagram, Share2, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
            Contacto
          </h1>
          <p className="text-lg font-body text-dark/70">
            Estamos aquí para ayudarte con tu proyecto
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-dark/10 rounded-lg p-6 text-center hover:border-teal transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-4">
              <Mail size={32} className="text-teal" />
            </div>
            <h3 className="font-heading font-bold text-dark mb-2">Email</h3>
            <a
              href="mailto:info@risewave.tech"
              className="text-dark/70 font-body hover:text-teal transition-colors"
            >
              info@risewave.tech
            </a>
          </div>

          <div className="bg-white border-2 border-dark/10 rounded-lg p-6 text-center hover:border-teal transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-4">
              <Phone size={32} className="text-teal" />
            </div>
            <h3 className="font-heading font-bold text-dark mb-2">Teléfono</h3>
            <a
              href="tel:+5491112345678"
              className="text-dark/70 font-body hover:text-teal transition-colors"
            >
              +54 9 11 1234-5678
            </a>
          </div>

          <div className="bg-white border-2 border-dark/10 rounded-lg p-6 text-center hover:border-teal transition-all">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-4">
              <Instagram size={32} className="text-teal" />
            </div>
            <h3 className="font-heading font-bold text-dark mb-2">Instagram</h3>
            <a
              href="https://instagram.com/risewave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark/70 font-body hover:text-teal transition-colors"
            >
              @risewave
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border-2 border-dark/10 rounded-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-dark mb-6">
            Envíanos un Mensaje
          </h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  placeholder="Tu nombre"
                />
              </div>
              
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-dark mb-2">
                Asunto
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-dark mb-2">
                Mensaje
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body resize-none"
                placeholder="Cuéntanos sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-accent text-cream py-3 px-6 rounded font-body font-bold hover:bg-red-accent/90 transition-colors"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-dark to-teal text-cream p-8 rounded-lg">
          <h3 className="text-2xl font-heading font-bold mb-4">
            Horarios de Atención
          </h3>
          <div className="font-body space-y-2">
            <p>Lunes a Viernes: 9:00 - 18:00</p>
            <p>Sábados: 10:00 - 14:00</p>
            <p>Domingos: Cerrado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
