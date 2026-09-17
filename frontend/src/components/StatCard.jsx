export default function StatCard({ label, value, icon: Icon, accent = 'blue' }) {
  const accents = {
    blue:   'from-blue-500 to-blue-600',
    amber:  'from-amber-500 to-amber-600',
    green:  'from-emerald-500 to-emerald-600',
    sky:    'from-sky-500 to-sky-600',
    rose:   'from-rose-500 to-rose-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-soft p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${accents[accent]} text-white flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}