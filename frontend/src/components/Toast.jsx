import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-rose-50 border-rose-200 text-rose-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
};
const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export default function Toast({ type = 'info', message }) {
  const Icon = icons[type] || Info;
  return (
    <div
      className={`flex items-start gap-3 min-w-[280px] max-w-sm border rounded-lg px-4 py-3 shadow-soft animate-fade-in ${styles[type]}`}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
    </div>
  );
}