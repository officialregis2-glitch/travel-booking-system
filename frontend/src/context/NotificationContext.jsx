import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext.jsx';

const NotifCtx = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const { data, unreadCount } = await notificationService.list();
      setItems(data);
      setUnreadCount(unreadCount);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, [refresh]);

  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  // ADD THIS NEW FUNCTION
  const deleteNotification = useCallback(async (id) => {
    await notificationService.delete(id);
    setItems((prev) => prev.filter((n) => n._id !== id));
  }, []);

  return (
    <NotifCtx.Provider value={{ items, unreadCount, refresh, markRead, markAllRead, deleteNotification }}>
      {children}
    </NotifCtx.Provider>
  );
}

export const useNotifications = () => useContext(NotifCtx);