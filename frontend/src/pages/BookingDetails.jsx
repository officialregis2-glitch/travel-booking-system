import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Plane,
  RotateCcw,
  User,
  Phone,
  Calendar,
  MapPin,
  Ticket,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate } from '../utils/formatters.js';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await bookingService.get(id);
      setBooking(data);
    } catch {
      toast.error('Failed to load booking');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const confirmBooking = async () => {
    setConfirming(true);
    try {
      const { data } = await bookingService.updateStatus(id, 'booked');
      setBooking(data);
      toast.success(`Booking #${data.bookingNumber} confirmed`);
    } catch {
      toast.error('Failed to confirm booking');
    } finally {
      setConfirming(false);
      setShowConfirm(false);
    }
  };

  const deleteBooking = async () => {
    setDeleting(true);
    try {
      await bookingService.remove(id);
      toast.success(`Booking #${booking.bookingNumber} deleted`);
      navigate('/bookings');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!booking) return null;

  const b = booking;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Booking #{b.bookingNumber}
              </h1>
              <StatusBadge status={b.status} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Created {formatDate(b.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {b.status === 'pending' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-sm transition"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Booking
            </button>
          )}
          <Link
            to={`/bookings/${b._id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">Passenger</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">{b.personalData.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Contact
              </dt>
              <dd className="font-medium text-slate-900">{b.personalData.contact}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 flex items-center gap-1">
                <Ticket className="w-3 h-3" /> PNR
              </dt>
              <dd className="font-mono font-medium text-slate-900">{b.pnrCode}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">Departure</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Route
              </dt>
              <dd className="font-medium text-slate-900">
                {b.departure.destination.from} → {b.departure.destination.to}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Register
              </dt>
              <dd className="font-medium text-slate-900">
                {formatDate(b.departure.registerDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Departs</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(b.departure.departureDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Arrives</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(b.departure.arrivalDate)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">Return</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Route
              </dt>
              <dd className="font-medium text-slate-900">
                {b.return.destination.from} → {b.return.destination.to}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Departs</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(b.return.departureDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Arrives</dt>
              <dd className="font-medium text-slate-900">
                {formatDate(b.return.arrivalDate)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Comments Section */}
      {(b.comments && b.comments.trim().length > 0) && (
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">Admin Comments</h2>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{b.comments}</p>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Last updated: {formatDate(b.updatedAt)}
          </p>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        onClose={() => !confirming && setShowConfirm(false)}
        onConfirm={confirmBooking}
        loading={confirming}
        title="Confirm booking?"
        message={`Mark booking #${b.bookingNumber} as Booked? This indicates the ticket has been issued.`}
        confirmText="Yes, confirm"
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => !deleting && setShowDelete(false)}
        onConfirm={deleteBooking}
        loading={deleting}
        danger
        title="Delete booking?"
        message={`Are you sure you want to delete booking #${b.bookingNumber}? This cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}