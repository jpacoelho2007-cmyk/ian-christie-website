import { useState, FormEvent } from 'react';
import { X, Send, CheckCircle, Phone } from 'lucide-react';
import { BusinessInfo } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetService?: string;
  businessInfo: BusinessInfo;
}

export default function QuoteModal({
  isOpen,
  onClose,
  presetService,
  businessInfo
}: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone' as 'phone' | 'whatsapp' | 'email',
    message: presetService ? `Hi Ian, I would like a quote for ${presetService}.` : ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase block">
              IAN CHRISTIE ELECTRICAL
            </span>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Request a Quote</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-400 text-slate-950 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-wider">Quote Request Received</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Thank you. Ian will review your electrical enquiry and get back to you promptly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  placeholder="086 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Email Address</label>
                <input
                  type="email"
                  placeholder="email@example.ie"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Message / Work Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your electrical job or repair required..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Send Request'}</span>
            </button>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Urgent enquiry?</span>
              <a
                href={`tel:${(businessInfo.phone || '').replace(/\s+/g, '')}`}
                className="font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {businessInfo.phone || ''}</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
