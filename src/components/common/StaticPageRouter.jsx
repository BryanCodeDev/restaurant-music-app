import React from 'react';
import PricingPage from '../pages/PricingPage';
import FeaturesPage from '../pages/FeaturesPage';
import ContactPage from '../pages/ContactPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import CookiesPage from '../pages/CookiesPage';

const StaticPageRouter = ({ currentPage }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'precios':
        return <PricingPage />;
      case 'caracteristicas':
        return <FeaturesPage />;
      case 'contacto':
        return <ContactPage />;
      case 'terminos':
        return <TermsPage />;
      case 'politica-privacidad':
        return <PrivacyPage />;
      case 'politica-cookies':
        return <CookiesPage />;
      default:
        return null;
    }
  };

  return renderPage();
};

export default StaticPageRouter;