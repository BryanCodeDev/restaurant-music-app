import { useEffect } from 'react';

const SEOHead = ({
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
  tags = []
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
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
        document.getElementsByTagName('head')[0].appendChild(element);
      }
    };

    // Basic meta tags
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
      tags.forEach((tag, index) => {
        updateMetaTag(`article:tag`, tag, true);
      });
    }

    // Cleanup function
    return () => {
      // Remove dynamically added meta tags if needed
      const dynamicTags = document.querySelectorAll('meta[data-dynamic="true"]');
      dynamicTags.forEach(tag => tag.remove());
    };
  }, [title, description, keywords, image, url, type, author, published, modified, section, tags]);

  return null; // This component doesn't render anything
};

export default SEOHead;