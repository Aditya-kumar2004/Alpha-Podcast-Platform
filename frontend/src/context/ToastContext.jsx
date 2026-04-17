import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES = {
  success: {
    bar: 'bg-green-500',
    icon: 'text-green-400',
    border: 'border-green-500/20',
    bg: 'bg-green-500/10',
  },
  error: {
    bar: 'bg-red-500',
    icon: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
  },
  warning: {
    bar: 'bg-yellow-500',
    icon: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
  },
  info: {
    bar: 'bg-blue-500',
    icon: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, visible: true }]);

    // Start fade-out before removing
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    }, duration - 400);

    // Remove from DOM
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          const style = STYLES[toast.type] || STYLES.info;

          return (
            <div
              key={toast.id}
              style={{
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                opacity: toast.visible ? 1 : 0,
                transform: toast.visible ? 'translateX(0)' : 'translateX(24px)',
              }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl ${style.border} bg-[#1a1a1a]`}
            >
              {/* Colored top bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${style.bar}`} />

              <div className={`flex items-start gap-3 p-4 ${style.bg} rounded-2xl`}>
                <div className={`flex-shrink-0 mt-0.5 ${style.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="flex-1 text-sm font-medium text-white leading-relaxed pr-2">
                  {toast.message}
                </p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="flex-shrink-0 text-white/30 hover:text-white/80 transition-colors mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
