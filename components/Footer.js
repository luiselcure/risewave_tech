'use client';

import Link from 'next/link';
import { Mail, Instagram, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-cream py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Copyright */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="text-2xl font-heading font-bold mb-2">
              RISE<span className="text-red-accent">WAVE</span>
              <span className="text-teal ml-2 text-sm">TECH</span>
            </div>
            <p className="text-sm text-cream/70 font-body">
              © 2026 RISE WAVE TECH. Todos los derechos reservados.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-heading mb-3">Contacto</h3>
            <div className="flex space-x-6">
              <a
                href="mailto:info@risewave.tech"
                className="hover:text-red-accent transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
              <a
                href="https://instagram.com/risewave"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="hover:text-red-accent transition-colors"
                aria-label="Compartir"
              >
                <Share2 size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
