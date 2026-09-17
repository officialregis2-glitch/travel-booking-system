import { Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';
import logo from '../assets/logo.png';

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Toggle menu">
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">True Blue Travels</p>
            <p className="text-[11px] text-slate-500 leading-tight">Booking suit system</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
       <div className="hidden md:flex items-center gap-2 pl-2 ml-2 border-l border-slate-200">
  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
    {user?.photo ? (
      <img src={user.photo} alt={user.username} className="w-full h-full object-cover" />
    ) : (
      <span className="text-slate-700 text-xs font-semibold">
        {(user?.username || 'A').charAt(0).toUpperCase()}
      </span>
    )}
  </div>
  <div className="text-xs">
    <p className="font-medium text-slate-900 leading-tight">{user?.username || 'Admin'}</p>
    <p className="text-slate-500 leading-tight">Administrator</p>
  </div>
</div>
      </div>
    </header>
  );
}