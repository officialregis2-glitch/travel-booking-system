export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${s} rounded-full border-2 border-slate-200 border-t-brand-600 animate-spin`}
      />
    </div>
  );
}