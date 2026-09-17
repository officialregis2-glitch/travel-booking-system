import { createContext, useCallback, useContext, useState } from 'react';
import Toast from '../components/Toast.jsx';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback(({ type = 'info', message, duration = 3500 }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const success = useCallback((m) => push({ type: 'success', message: m }), [push]);
  const error = useCallback(
    (m) => push({ type: 'error', message: m || 'Something went wrong' }),
    [push]
  );
  const info = useCallback((m) => push({ type: 'info', message: m }), [push]);

  return (
    <ToastCtx.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);