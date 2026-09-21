import { useEffect } from 'react';

export const useSEO = (seoData) => {
  useEffect(() => {
    if (!seoData) return;

    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      author,
      published,
      modified,
      section,
      tags = [],
      structuredData
    } = seoData;

    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;

      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        element.setAttribute('data-dynamic', 'true');
        document.getElementsByTagName('head')[0].appendChild(element);
      }
    };

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'BryJu Sound', true);

    // Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Article specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:published_time', published, true);
      updateMetaTag('article:modified_time', modified, true);
      updateMetaTag('article:section', section, true);

      // Article tags
      tags.forEach((tag) => {
        updateMetaTag(`article:tag`, tag, true);
      });
    }

    // Add structured data if provided
    if (structuredData) {
      const scriptId = `structured-data-${Date.now()}`;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.getElementsByTagName('head')[0].appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove dynamically added meta tags
      const dynamicTags = document.querySelectorAll('meta[data-dynamic="true"]');
      dynamicTags.forEach(tag => tag.remove());

      // Remove structured data scripts
      const scripts = document.querySelectorAll('script[data-dynamic="true"]');
      scripts.forEach(script => script.remove());
    };
  }, [seoData]);

  return null;
};

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'BryJu Sound - Música Interactiva para Restaurantes en Colombia',
    description: '🎵 La plataforma #1 de música interactiva para restaurantes. Tus clientes solicitan canciones en tiempo real vía Spotify o biblioteca propia. Planes desde $80.000/mes.',
    keywords: 'música restaurantes colombia, peticiones musicales tiempo real, jukebox digital restaurante, spotify para negocios, sistema de sonido restaurante, playlist interactiva clientes',
    image: 'https://bryjusound.com/og-image.jpg',
    url: 'https://bryjusound.com/',
    type: 'website'
  },

  pricing: {
    title: 'Precios - BryJu Sound | Planes de Música Interactiva para Restaurantes',
    description: 'Planes de suscripción para BryJu Sound desde $80.000/mes. Plan Basic con biblioteca propia, Plan Pro con Spotify. ¡Elige el plan perfecto para tu restaurante!',
    keywords: 'precios música restaurantes, planes suscripción jukebox, costo sistema sonido restaurante, spotify negocios precio, BryJu Sound planes',
    image: 'https://bryjusound.com/pricing-og.jpg',
    url: 'https://bryjusound.com/precios',
    type: 'website'
  },

  features: {
    title: 'Características - BryJu Sound | Funcionalidades de Música Interactiva',
    description: 'Descubre todas las características de BryJu Sound: peticiones en tiempo real, integración Spotify, dashboard administrativo, estadísticas y más.',
    keywords: 'características música restaurante, funcionalidades jukebox digital, spotify integración restaurante, dashboard música, estadísticas restaurante',
    image: 'https://bryjusound.com/features-og.jpg',
    url: 'https://bryjusound.com/caracteristicas',
    type: 'website'
  },

  contact: {
    title: 'Contacto - BryJu Sound | Contáctanos para tu Restaurante',
    description: '¿Quieres implementar BryJu Sound en tu restaurante? Contáctanos para una demostración gratuita y cotización personalizada.',
    keywords: 'contacto BryJu Sound, cotización música restaurante, demo jukebox digital, soporte técnico restaurante, implementar spotify negocio',
    image: 'https://bryjusound.com/contact-og.jpg',
    url: 'https://bryjusound.com/contacto',
    type: 'website'
  },

  blog: {
    title: 'Blog - BryJu Sound | Consejos para Música en Restaurantes',
    description: 'Artículos y consejos sobre cómo mejorar la experiencia musical en tu restaurante, tendencias en música para negocios y más.',
    keywords: 'blog música restaurantes, consejos jukebox, tendencias música negocio, experiencia musical restaurante, tips spotify negocio',
    image: 'https://bryjusound.com/blog-og.jpg',
    url: 'https://bryjusound.com/blog',
    type: 'website'
  },

  demo: {
    title: 'Demo - BryJu Sound | Prueba Gratuita de Música Interactiva',
    description: 'Prueba gratis BryJu Sound y descubre cómo la música interactiva puede transformar la experiencia en tu restaurante.',
    keywords: 'demo BryJu Sound, prueba gratuita música restaurante, demo jukebox digital, test spotify restaurante, probar sistema sonido',
    image: 'https://bryjusound.com/demo-og.jpg',
    url: 'https://bryjusound.com/demo',
    type: 'website'
  }
};

export default useSEO;