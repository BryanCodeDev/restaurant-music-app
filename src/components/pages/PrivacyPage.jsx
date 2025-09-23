import React from 'react';
import { Lock, Eye, Database, UserCheck, FileText, Calendar, Shield, Users } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "20 de septiembre de 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Última actualización: {lastUpdated}
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Shield className="h-5 w-5" />
              <span>Cumple con Ley 1581 de 2012 (Colombia)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">

          {/* 1. Información General */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
              Información General
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                En <strong>BryJu Sound</strong> (operado por <strong>MasterCode Company</strong>),
                nos comprometemos a proteger tu privacidad y tus datos personales. Esta Política de
                Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-2">Base Legal</h4>
                <p className="text-sm text-green-200">
                  Esta política cumple con la <strong>Ley 1581 de 2012</strong> y el
                  <strong>Decreto 1377 de 2013</strong> sobre protección de datos personales
                  en Colombia.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Datos que Recopilamos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
              Datos que Recopilamos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">

              <h4 className="font-semibold text-white">2.1 Información de Registro</h4>
              <ul className="space-y-2 text-sm">
                <li>• Nombre completo y razón social</li>
                <li>• Correo electrónico corporativo</li>
                <li>• Número de teléfono</li>
                <li>• Información de facturación</li>
                <li>• NIT/RUT para facturación</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">2.2 Datos de Uso del Servicio</h4>
              <ul className="space-y-2 text-sm">
                <li>• Historial de peticiones musicales</li>
                <li>• Estadísticas de uso de la plataforma</li>
                <li>• Preferencias de configuración</li>
                <li>• Datos de rendimiento del restaurante</li>
                <li>• Información de dispositivos utilizados</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">2.3 Información Técnica</h4>
              <ul className="space-y-2 text-sm">
                <li>• Dirección IP y ubicación geográfica</li>
                <li>• Tipo de dispositivo y navegador</li>
                <li>• Cookies y tecnologías similares</li>
                <li>• Logs de acceso y actividad</li>
              </ul>
            </div>
          </section>

          {/* 3. Finalidad del Tratamiento */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
              Finalidad del Tratamiento de Datos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Utilizamos tu información para las siguientes finalidades:
              </p>

              <h4 className="font-semibold text-white">3.1 Prestación del Servicio</h4>
              <ul className="space-y-1 text-sm">
                <li>• Procesar y gestionar tu cuenta</li>
                <li>• Proporcionar funcionalidades de la plataforma</li>
                <li>• Generar facturas y procesar pagos</li>
                <li>• Ofrecer soporte técnico</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">3.2 Mejora del Servicio</h4>
              <ul className="space-y-1 text-sm">
                <li>• Analizar patrones de uso</li>
                <li>• Desarrollar nuevas funcionalidades</li>
                <li>• Mejorar la experiencia del usuario</li>
                <li>• Realizar estadísticas internas</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">3.3 Comunicación</h4>
              <ul className="space-y-1 text-sm">
                <li>• Enviar actualizaciones del servicio</li>
                <li>• Notificar cambios importantes</li>
                <li>• Enviar información relevante sobre tu cuenta</li>
                <li>• Ofrecer soporte y asistencia</li>
              </ul>
            </div>
          </section>

          {/* 4. Derechos de los Titulares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
              Derechos de los Titulares de Datos
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                De acuerdo con la Ley 1581 de 2012, tienes los siguientes derechos:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">Derechos ARCO</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Acceso:</strong> Conocer tus datos</li>
                    <li>• <strong>Rectificación:</strong> Corregir información</li>
                    <li>• <strong>Cancelación:</strong> Eliminar datos</li>
                    <li>• <strong>Oposición:</strong> Oponerte al tratamiento</li>
                  </ul>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">Otros Derechos</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Revocar consentimiento</li>
                    <li>• Solicitar portabilidad</li>
                    <li>• Presentar quejas</li>
                    <li>• Conocer tratamientos</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-300 mb-2">Cómo Ejercer tus Derechos</h4>
                <p className="text-sm text-yellow-200">
                  Para ejercer cualquiera de estos derechos, contáctanos en
                  <strong> privacidad@bryjusound.com</strong> o llama al
                  <strong> +57 300 123 4567</strong>. Responderemos en máximo 15 días hábiles.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Compartir Información */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
              Compartir Información con Terceros
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                No vendemos, alquilamos ni comercializamos tu información personal.
                Solo compartimos datos en los siguientes casos:
              </p>

              <h4 className="font-semibold text-white">5.1 Proveedores de Servicios</h4>
              <ul className="space-y-1 text-sm">
                <li>• Servicios de cloud computing (AWS, Google Cloud)</li>
                <li>• Procesadores de pagos (Stripe, PayU)</li>
                <li>• Servicios de email marketing</li>
                <li>• Herramientas de analytics</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">5.2 Requerimientos Legales</h4>
              <ul className="space-y-1 text-sm">
                <li>• Órdenes judiciales válidas</li>
                <li>• Requerimientos de autoridades competentes</li>
                <li>• Procesos legales debidamente notificados</li>
              </ul>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Transferencias Internacionales</h4>
                <p className="text-sm text-blue-200">
                  Algunos de nuestros proveedores están ubicados fuera de Colombia.
                  Garantizamos que cumplen con estándares adecuados de protección de datos.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Seguridad de la Información */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
              Seguridad de la Información
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Implementamos medidas de seguridad técnicas, administrativas y físicas
                para proteger tu información:
              </p>

              <h4 className="font-semibold text-white">6.1 Medidas Técnicas</h4>
              <ul className="space-y-1 text-sm">
                <li>• Encriptación de datos en tránsito y reposo</li>
                <li>• Firewalls y sistemas de detección de intrusiones</li>
                <li>• Autenticación de dos factores (2FA)</li>
                <li>• Monitoreo continuo de seguridad</li>
              </ul>

              <h4 className="font-semibold text-white mt-6">6.2 Medidas Administrativas</h4>
              <ul className="space-y-1 text-sm">
                <li>• Políticas internas de manejo de datos</li>
                <li>• Capacitación regular del personal</li>
                <li>• Controles de acceso basados en roles</li>
                <li>• Auditorías periódicas de seguridad</li>
              </ul>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-2">Notificación de Incidentes</h4>
                <p className="text-sm text-green-200">
                  En caso de brechas de seguridad que afecten tus datos personales,
                  te notificaremos en máximo 72 horas y reportaremos a la autoridad competente.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Cookies y Tecnologías Similares */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
              Cookies y Tecnologías Similares
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia.
                Consulta nuestra Política de Cookies para más detalles.
              </p>

              <h4 className="font-semibold text-white">Tipos de Cookies que Usamos:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Cookies esenciales:</strong> Funcionamiento básico del sitio</li>
                <li>• <strong>Cookies de rendimiento:</strong> Analytics y mejora del servicio</li>
                <li>• <strong>Cookies funcionales:</strong> Recordar preferencias</li>
                <li>• <strong>Cookies de marketing:</strong> Publicidad relevante</li>
              </ul>
            </div>
          </section>

          {/* 8. Menores de Edad */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
              Menores de Edad
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Nuestro servicio está dirigido a empresas y adultos mayores de 18 años.
                No recopilamos intencionalmente datos de menores de edad.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2">Si Eres Padre o Tutor</h4>
                <p className="text-sm text-red-200">
                  Si descubres que un menor ha proporcionado datos personales,
                  contáctanos inmediatamente para eliminar dicha información.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Cambios a esta Política */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
              Cambios a esta Política
            </h2>
            <div className="text-gray-300 space-y-4 pl-11">
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente.
                Te notificaremos sobre cambios importantes por email o mediante
                notificación en la plataforma.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Historial de Cambios</h4>
                <p className="text-sm text-blue-200">
                  Consulta el historial completo de cambios al final de este documento.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Contacto */}
          <section className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Información de Contacto</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Para preguntas sobre esta Política de Privacidad o el tratamiento de tus datos:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">Oficial de Privacidad</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Email: privacidad@bryjusound.com</li>
                    <li>• Teléfono: +57 300 123 4567</li>
                    <li>• Respuesta: Máximo 15 días hábiles</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">Autoridad Competente</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Superintendencia de Industria y Comercio</li>
                    <li>• Sitio web: www.sic.gov.co</li>
                    <li>• Teléfono: +57 1 587 0000</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance Badge */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Política Actualizada y Vigente</span>
            </div>
            <p className="text-sm text-green-200">
              Esta política cumple con la legislación colombiana vigente y estándares
              internacionales de protección de datos. Última revisión: {lastUpdated}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;