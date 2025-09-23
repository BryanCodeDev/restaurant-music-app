import React from 'react';
import { FileText, Calendar, Shield, Users, CreditCard, AlertTriangle } from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "20 de septiembre de 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Términos y Condiciones
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Última actualización: {lastUpdated}
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Shield className="h-5 w-5" />
              <span>Documento legal vigente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">

          {/* 1. Aceptación de los Términos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
              Aceptación de los Términos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Al acceder y utilizar <strong>BryJu Sound</strong> (en adelante, "el Servicio"),
                aceptas y te comprometes a cumplir con los presentes Términos y Condiciones de Uso
                (en adelante, "los Términos").
              </p>
              <p>
                Si no estás de acuerdo con estos Términos, no debes utilizar este Servicio.
                Estos Términos aplican a todos los visitantes, usuarios y demás personas que acceden
                o utilizan el Servicio.
              </p>
            </div>
          </section>

          {/* 2. Descripción del Servicio */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
              Descripción del Servicio
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                <strong>BryJu Sound</strong> es una plataforma SaaS (Software as a Service) que proporciona
                servicios de música interactiva para restaurantes, permitiendo a los clientes solicitar
                canciones y crear experiencias musicales personalizadas.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Funcionalidades principales:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Gestión de colas de reproducción musical</li>
                  <li>• Sistema de peticiones de canciones en tiempo real</li>
                  <li>• Integración con plataformas de streaming</li>
                  <li>• Analytics y estadísticas de uso</li>
                  <li>• Panel de administración para restaurantes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Condiciones de Uso */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
              Condiciones de Uso
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <h4 className="font-semibold text-white">3.1 Requisitos para Usuarios</h4>
              <ul className="space-y-2 text-sm">
                <li>• Ser mayor de 18 años o tener autorización legal</li>
                <li>• Proporcionar información veraz y actualizada</li>
                <li>• Utilizar el servicio de manera legal y ética</li>
                <li>• No interferir con el funcionamiento del servicio</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">3.2 Uso Aceptable</h4>
              <p>
                El usuario se compromete a no utilizar el Servicio para:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Violar derechos de autor o propiedad intelectual</li>
                <li>• Distribuir contenido ilegal o inapropiado</li>
                <li>• Realizar actividades fraudulentas</li>
                <li>• Interferir con la seguridad del sistema</li>
                <li>• Hacer reverse engineering del software</li>
              </ul>
            </div>
          </section>

          {/* 4. Propiedad Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
              Propiedad Intelectual
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                <strong>BryJu Sound</strong> y todo su contenido, incluyendo pero no limitándose a
                software, diseños, gráficos, logos, y código fuente, son propiedad exclusiva de
                <strong> MasterCode Company</strong> y están protegidos por las leyes de propiedad
                intelectual vigentes en Colombia y tratados internacionales.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-300">Licencia de Uso</h4>
                    <p className="text-sm text-yellow-200">
                      Se otorga una licencia limitada, no exclusiva y no transferible para usar
                      el Servicio según estos Términos. Esta licencia no incluye derechos de
                      reproducción, distribución o modificación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Pagos y Facturación */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
              Pagos y Facturación
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <h4 className="font-semibold text-white">5.1 Precios y Planes</h4>
              <p>
                Los precios están expresados en pesos colombianos (COP) y no incluyen IVA.
                Los planes pueden modificarse con previo aviso de 30 días.
              </p>

              <h4 className="font-semibold text-white mt-6">5.2 Facturación</h4>
              <ul className="space-y-2 text-sm">
                <li>• Facturación mensual automática</li>
                <li>• Pago mediante pasarelas autorizadas</li>
                <li>• Emisión de factura electrónica</li>
                <li>• Soporte para múltiples métodos de pago</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">5.3 Reembolsos</h4>
              <p>
                Ofrecemos garantía de satisfacción de 30 días. Los reembolsos se procesan
                dentro de 5-10 días hábiles después de la solicitud aprobada.
              </p>
            </div>
          </section>

          {/* 6. Privacidad y Datos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
              Privacidad y Protección de Datos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                El tratamiento de datos personales se rige por nuestra Política de Privacidad,
                la cual forma parte integral de estos Términos. Al usar el Servicio, aceptas
                la recopilación y uso de información según lo descrito en dicha política.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-2">Cumplimiento Normativo</h4>
                <p className="text-sm text-green-200">
                  Cumplimos con la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre
                  protección de datos personales en Colombia.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Limitación de Responsabilidad */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
              Limitación de Responsabilidad
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                <strong>BryJu Sound</strong> se proporciona "tal cual" sin garantías de ningún tipo.
                No nos hacemos responsables por daños indirectos, incidentales o consecuentes
                derivados del uso del Servicio.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2">Responsabilidad Máxima</h4>
                <p className="text-sm text-red-200">
                  Nuestra responsabilidad total no excederá el monto pagado por el usuario
                  en los últimos 12 meses de servicio.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Terminación */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
              Terminación del Servicio
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Podemos suspender o terminar tu acceso al Servicio inmediatamente, sin previo aviso,
                por cualquier violación de estos Términos o por razones técnicas, de seguridad o legales.
              </p>
              <h4 className="font-semibold text-white">8.1 Efectos de la Terminación</h4>
              <ul className="space-y-1 text-sm">
                <li>• Pérdida inmediata del acceso al Servicio</li>
                <li>• Posibilidad de exportar datos durante 30 días</li>
                <li>• No se emiten reembolsos por terminación por violación</li>
                <li>• Las obligaciones de pago pendientes permanecen</li>
              </ul>
            </div>
          </section>

          {/* 9. Ley Aplicable */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
              Ley Aplicable y Jurisdicción
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Estos Términos se rigen por las leyes de la República de Colombia.
                Cualquier disputa será resuelta por los tribunales competentes de Bogotá D.C.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Resolución de Conflictos</h4>
                <p className="text-sm text-blue-200">
                  Intentaremos resolver amigablemente cualquier disputa. En caso de no ser posible,
                  se someterá a arbitraje en la Cámara de Comercio de Bogotá.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Modificaciones */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
              Modificaciones a los Términos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Nos reservamos el derecho de modificar estos Términos en cualquier momento.
                Las modificaciones entrarán en vigor 30 días después de su publicación.
                El uso continuado del Servicio constituye aceptación de los nuevos términos.
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-purple-300 mb-2">Notificación de Cambios</h4>
                <p className="text-sm text-purple-200">
                  Te notificaremos por email o mediante notificación en la plataforma
                  sobre cambios importantes en estos Términos.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Información de Contacto</h2>
            <div className="text-gray-300 space-y-2">
              <p>
                Para preguntas sobre estos Términos y Condiciones, contáctanos:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Email: legal@bryjusound.com</li>
                <li>• Teléfono: +57 300 123 4567</li>
                <li>• Dirección: Bogotá D.C., Colombia</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Documento Legal Válido</span>
            </div>
            <p className="text-sm text-green-200">
              Estos términos fueron actualizados por última vez el {lastUpdated} y
              están vigentes desde esa fecha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;