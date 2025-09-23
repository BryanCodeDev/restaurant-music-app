import React from 'react';
import { ExternalLink } from 'lucide-react';

const NavigationLinks = ({ onLinkClick, className = '' }) => {
  const staticPages = [
    {
      id: 'caracteristicas',
      label: 'Características',
      href: '/caracteristicas',
      description: 'Descubre todas las funcionalidades'
    },
    {
      id: 'precios',
      label: 'Precios',
      href: '/precios',
      description: 'Planes que se adaptan a tu restaurante'
    },
    {
      id: 'contacto',
      label: 'Contacto',
      href: '/contacto',
      description: 'Hablemos de tu restaurante'
    }
  ];

  const handleStaticPageClick = (pageId) => {
    if (onLinkClick) {
      onLinkClick(pageId);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-300 mb-3">Explorar</h4>
      {staticPages.map((page) => (
        <button
          key={page.id}
          onClick={() => handleStaticPageClick(page.id)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/50 rounded-lg transition-colors group"
        >
          <div>
            <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
              {page.label}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {page.description}
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
        </button>
      ))}
    </div>
  );
};

export default NavigationLinks;