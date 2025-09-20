import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-20 blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-red-500/20 to-pink-500/20 p-8 rounded-full border border-red-500/30">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              ¡Oops! Algo salió mal
            </h1>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Ha ocurrido un error inesperado en la aplicación. Esto puede deberse a un problema temporal o un bug que estamos trabajando en resolver.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-red-400 font-semibold mb-2">Detalles del error (solo en desarrollo):</h3>
                <pre className="text-xs text-slate-300 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Intentar de nuevo</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Ir al inicio</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm">
                Si el problema persiste, por favor contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;