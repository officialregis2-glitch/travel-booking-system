import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext.jsx';
import BookingForm from './_BookingForm.jsx';

export default function CreateBooking() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const { data } = await bookingService.create(values);
      toast.success(`Booking #${data.bookingNumber} created`);
      navigate(`/bookings/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Booking</h1>
            <p className="text-sm text-slate-500 mt-1">
              Create a new passenger booking
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
        <BookingForm onSubmit={onSubmit} loading={submitting} submitLabel="Create Booking" />
      </div>
    </div>
  );
}