import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext.jsx';
import BookingForm from './_BookingForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const toInputDate = (v) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await bookingService.get(id);
        setInitial({
          pnrCode: data.pnrCode,
          name: data.personalData.name,
          contact: data.personalData.contact,
          registerDate: toInputDate(data.departure.registerDate),
          departureDate: toInputDate(data.departure.departureDate),
          arrivalDate: toInputDate(data.departure.arrivalDate),
          departureFrom: data.departure.destination.from,
          departureTo: data.departure.destination.to,
          returnDepartureDate: toInputDate(data.return.departureDate),
          returnArrivalDate: toInputDate(data.return.arrivalDate),
          returnFrom: data.return.destination.from,
          returnTo: data.return.destination.to,
        });
      } catch {
        toast.error('Failed to load booking');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, toast]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await bookingService.update(id, values);
      toast.success('Booking updated');
      navigate(`/bookings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Booking</h1>
          <p className="text-sm text-slate-500 mt-1">Update booking information</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
        <BookingForm
          initial={initial}
          onSubmit={onSubmit}
          loading={submitting}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}