import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle,
  Plane,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { bookingService } from '../services/bookingService';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatShortDate } from '../utils/formatters.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, b] = await Promise.all([
          dashboardService.stats(),
          bookingService.list({ sortBy: 'createdAt', order: 'desc', limit: 5 }),
        ]);
        setStats(s.data);
        setRecent(b.data);
      } catch {
        /* toast handled globally */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your travel bookings and activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Bookings" value={stats?.totalBookings ?? 0} icon={Ticket} accent="blue" />
        <StatCard label="Pending" value={stats?.pendingBookings ?? 0} icon={Clock} accent="amber" />
        <StatCard label="Booked" value={stats?.bookedTickets ?? 0} icon={CheckCircle} accent="green" />
        <StatCard label="Upcoming (24h)" value={stats?.upcomingDepartures ?? 0} icon={Plane} accent="sky" />
        <StatCard label="Unread Alerts" value={stats?.unreadNotifications ?? 0} icon={Bell} accent="rose" />
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <Link
            to="/bookings"
            className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">#</th>
                <th className="text-left px-5 py-3">Passenger</th>
                <th className="text-left px-5 py-3">Route</th>
                <th className="text-left px-5 py-3">Departure</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recent.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">#{b.bookingNumber}</td>
                    <td className="px-5 py-3 text-slate-700">{b.personalData.name}</td>
                    <td className="px-5 py-3 text-slate-700">
                      {b.departure.destination.from} → {b.departure.destination.to}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatShortDate(b.departure.departureDate)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}