import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Plane, Clock, Trash2 } from 'lucide-react'; // Added Trash2
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatRelative } from '../utils/formatters.js';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { items, unreadCount, markRead, markAllRead, deleteNotification } = useNotifications(); // Added deleteNotification
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-semibold bg-rose-500 text-white rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[92vw] bg-white rounded-xl shadow-xl border border-slate-100 animate-slide-down overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-slate-900">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No notifications</p>
            ) : (
              items.map((n) => {
                const Icon = n.type === 'departure_reminder' ? Plane : Clock;
                return (
                  <div
                    key={n._id}
                    className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-slate-50 transition group ${
                      n.isRead ? '' : 'bg-brand-50/40'
                    }`}
                  >
                    {/* Clickable area for navigation */}
                    <Link
                      to={`/bookings/${n.bookingId}`}
                      onClick={() => {
                        if (!n.isRead) markRead(n._id);
                        setOpen(false);
                      }}
                      className="flex-1 min-w-0 flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          n.type === 'departure_reminder'
                            ? 'bg-sky-100 text-sky-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatRelative(n.createdAt)}
                        </p>
                      </div>
                    </Link>

                    {/* Delete Button - ONLY visible if notification is READ */}
                    {n.isRead && (
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation
                          e.stopPropagation(); // Stop event bubbling
                          deleteNotification(n._id);
                        }}
                        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Unread indicator dot */}
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 mt-3 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}