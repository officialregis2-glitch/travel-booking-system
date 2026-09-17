import { Clock, CheckCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const isBooked = status === 'booked';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isBooked
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
      }`}
    >
      {isBooked ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      {isBooked ? 'Booked' : 'Pending'}
    </span>
  );
}