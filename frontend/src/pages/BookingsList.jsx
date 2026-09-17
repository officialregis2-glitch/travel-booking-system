import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { formatShortDate } from '../utils/formatters.js';

export default function BookingsList() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('departureDate');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingService.list({
        search: debouncedSearch,
        status,
        sortBy,
        order,
        page,
        limit: 10,
      });
      setData(res);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, sortBy, order, page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await bookingService.remove(deleteTarget._id);
      toast.success(`Booking #${deleteTarget.bookingNumber} deleted`);
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all passenger bookings</p>
        </div>
        <Link
          to="/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> New Booking
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100">
        <div className="p-4 border-b flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, PNR, contact, or booking #"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 appearance-none bg-white"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          <select
            value={`${sortBy}:${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split(':');
              setSortBy(s);
              setOrder(o);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white"
          >
            <option value="departureDate:desc">Departure (newest)</option>
            <option value="departureDate:asc">Departure (oldest)</option>
            <option value="bookingNumber:desc">Booking # (desc)</option>
            <option value="bookingNumber:asc">Booking # (asc)</option>
            <option value="createdAt:desc">Created (newest)</option>
          </select>
        </div>

        {loading && !data ? (
          <div className="p-5">
            <SkeletonLoader rows={6} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">PNR</th>
                    <th className="text-left px-4 py-3">Passenger</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">From</th>
                    <th className="text-left px-4 py-3">To</th>
                    <th className="text-left px-4 py-3">Departure</th>
                    <th className="text-left px-4 py-3">Return</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!data?.data?.length ? (
                    <tr>
                      <td colSpan={10} className="text-center text-slate-500 py-12">
                        {loading ? <LoadingSpinner /> : 'No bookings found'}
                      </td>
                    </tr>
                  ) : (
                    data.data.map((b) => (
                      <tr key={b._id} className="border-t hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          #{b.bookingNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-mono text-xs">
                          {b.pnrCode}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{b.personalData.name}</td>
                        <td className="px-4 py-3 text-slate-600">{b.personalData.contact}</td>
                        <td className="px-4 py-3 text-slate-700">{b.departure.destination.from}</td>
                        <td className="px-4 py-3 text-slate-700">{b.departure.destination.to}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatShortDate(b.departure.departureDate)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatShortDate(b.return.departureDate)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/bookings/${b._id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/bookings/${b._id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(b)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data?.pagination?.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-slate-500">
                  Page {data.pagination.page} of {data.pagination.pages} ·{' '}
                  {data.pagination.total} total
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                    disabled={page === data.pagination.pages}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        danger
        loading={deleting}
        title="Delete booking?"
        message={
          deleteTarget
            ? `Are you sure you want to delete booking #${deleteTarget.bookingNumber}? This cannot be undone.`
            : ''
        }
        confirmText="Delete"
      />
    </div>
  );
}