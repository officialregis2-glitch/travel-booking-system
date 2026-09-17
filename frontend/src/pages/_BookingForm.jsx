import { useState } from 'react';
import { User, Plane, RotateCcw, Loader2 } from 'lucide-react';

const empty = {
  pnrCode: '', name: '', contact: '',
  registerDate: '', departureDate: '', arrivalDate: '',
  departureFrom: '', departureTo: '',
  returnDepartureDate: '', returnArrivalDate: '',
  returnFrom: '', returnTo: '',
};

export default function BookingForm({ initial, onSubmit, loading, submitLabel }) {
  const [values, setValues] = useState({ ...empty, ...(initial || {}) });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!values.pnrCode || values.pnrCode.length < 6) e.pnrCode = 'PNR must be 6–10 chars';
    if (!values.name) e.name = 'Name required';
    if (!values.contact) e.contact = 'Contact required';
    ['registerDate', 'departureDate', 'arrivalDate', 'returnDepartureDate', 'returnArrivalDate'].forEach(
      (k) => { if (!values[k]) e[k] = 'Required'; }
    );
    if (!values.departureFrom) e.departureFrom = 'Required';
    if (!values.departureTo) e.departureTo = 'Required';
    if (!values.returnFrom) e.returnFrom = 'Required';
    if (!values.returnTo) e.returnTo = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  const inputCls = (k) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${
      errors[k] ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-slate-900">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">PNR Code <span className="text-rose-500">*</span></label>
            <input type="text" value={values.pnrCode} onChange={(e) => set('pnrCode', e.target.value)} className={inputCls('pnrCode')} />
            {errors.pnrCode && <p className="text-xs text-rose-600 mt-1">{errors.pnrCode}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Passenger Name <span className="text-rose-500">*</span></label>
            <input type="text" value={values.name} onChange={(e) => set('name', e.target.value)} className={inputCls('name')} />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact <span className="text-rose-500">*</span></label>
            <input type="text" value={values.contact} onChange={(e) => set('contact', e.target.value)} className={inputCls('contact')} />
            {errors.contact && <p className="text-xs text-rose-600 mt-1">{errors.contact}</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-slate-900">Departure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Register Date <span className="text-rose-500">*</span></label>
            <input type="datetime-local" value={values.registerDate} onChange={(e) => set('registerDate', e.target.value)} className={inputCls('registerDate')} />
            {errors.registerDate && <p className="text-xs text-rose-600 mt-1">{errors.registerDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Departure Date <span className="text-rose-500">*</span></label>
            <input type="datetime-local" value={values.departureDate} onChange={(e) => set('departureDate', e.target.value)} className={inputCls('departureDate')} />
            {errors.departureDate && <p className="text-xs text-rose-600 mt-1">{errors.departureDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Arrival Date <span className="text-rose-500">*</span></label>
            <input type="datetime-local" value={values.arrivalDate} onChange={(e) => set('arrivalDate', e.target.value)} className={inputCls('arrivalDate')} />
            {errors.arrivalDate && <p className="text-xs text-rose-600 mt-1">{errors.arrivalDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">From (airport) <span className="text-rose-500">*</span></label>
            <input type="text" value={values.departureFrom} onChange={(e) => set('departureFrom', e.target.value)} className={inputCls('departureFrom')} />
            {errors.departureFrom && <p className="text-xs text-rose-600 mt-1">{errors.departureFrom}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">To (airport) <span className="text-rose-500">*</span></label>
            <input type="text" value={values.departureTo} onChange={(e) => set('departureTo', e.target.value)} className={inputCls('departureTo')} />
            {errors.departureTo && <p className="text-xs text-rose-600 mt-1">{errors.departureTo}</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-slate-900">Return</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Departure Date <span className="text-rose-500">*</span></label>
            <input type="datetime-local" value={values.returnDepartureDate} onChange={(e) => set('returnDepartureDate', e.target.value)} className={inputCls('returnDepartureDate')} />
            {errors.returnDepartureDate && <p className="text-xs text-rose-600 mt-1">{errors.returnDepartureDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Arrival Date <span className="text-rose-500">*</span></label>
            <input type="datetime-local" value={values.returnArrivalDate} onChange={(e) => set('returnArrivalDate', e.target.value)} className={inputCls('returnArrivalDate')} />
            {errors.returnArrivalDate && <p className="text-xs text-rose-600 mt-1">{errors.returnArrivalDate}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">From (airport) <span className="text-rose-500">*</span></label>
            <input type="text" value={values.returnFrom} onChange={(e) => set('returnFrom', e.target.value)} className={inputCls('returnFrom')} />
            {errors.returnFrom && <p className="text-xs text-rose-600 mt-1">{errors.returnFrom}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">To (airport) <span className="text-rose-500">*</span></label>
            <input type="text" value={values.returnTo} onChange={(e) => set('returnTo', e.target.value)} className={inputCls('returnTo')} />
            {errors.returnTo && <p className="text-xs text-rose-600 mt-1">{errors.returnTo}</p>}
          </div>
        </div>
      </section>

      <section>
  <div className="flex items-center gap-2 mb-4">
    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <h2 className="font-semibold text-slate-900">Comments</h2>
  </div>
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">Admin Notes</label>
    <textarea
      value={values.comments}
      onChange={(e) => set('comments', e.target.value)}
      rows={4}
      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none ${
        errors.comments ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
      }`}
      placeholder="Add any notes or comments about this passenger..."
    />
    {errors.comments && <p className="text-xs text-rose-600 mt-1">{errors.comments}</p>}
  </div>
</section>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}