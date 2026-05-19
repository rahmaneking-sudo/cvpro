import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Also save to localStorage so it can be inspected
    try {
      localStorage.setItem('last_react_error', JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-obsidian)] text-white p-8 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full bg-[var(--color-charcoal)] border border-red-500/30 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-red-400 mb-4">Une erreur est survenue lors de l'affichage</h2>
            <p className="text-sm text-[var(--color-white-muted)] mb-4">
              Désolé pour ce désagrément. Voici les détails techniques pour nous aider à corriger le problème :
            </p>
            <div className="bg-black/50 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-white/5 text-red-300 mb-6 max-h-60">
              <p className="font-bold mb-2">{this.state.error?.toString()}</p>
              <pre className="opacity-80">{this.state.error?.stack}</pre>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary !py-2.5 !px-5 text-sm"
              >
                Recharger la page
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="btn-ghost !py-2.5 !px-5 text-sm"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
