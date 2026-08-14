import { useState, FormEvent } from 'react';
import { Send, CheckCircle, Phone, Mail, MapPin, MessageSquare, ExternalLink } from 'lucide-react';
import { BusinessInfo } from '../types';
import SEOHead from '../components/SEOHead';

interface ContactViewProps {
  businessInfo: BusinessInfo;
}

export default function ContactView({ businessInfo }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'phone' as 'phone' | 'whatsapp' | 'email',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Failed to send enquiry. Please call directly.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please call Ian on +353 86 252 5331.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEOHead
        title="Contact Ian Christie Electrical | Electrician in Dublin"
        description="Contact Ian Christie Electrical for quotes, fuse board upgrades, lighting installations, and electrical repairs across Dublin."
        pagePath="/contact"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            CONTACT & QUOTES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Have an electrical enquiry or need a free estimate? Fill in the form below or call directly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 sm:p-10">
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-amber-400 text-slate-950 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                  Enquiry Submitted Successfully
                </h2>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting Ian Christie Electrical. Ian will review your message and respond promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', preferredContact: 'phone', message: '' });
                  }}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-black uppercase text-white tracking-wider border-b border-slate-800 pb-4">
                  Send a Direct Enquiry
                </h2>

                {errorMsg && (
                  <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mary Murphy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 086 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. mary@example.ie"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Work Description & Job Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe what electrical installations, safety upgrades, or repairs you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Message...' : 'Submit Quote Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Details Side (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 space-y-6">
              <h2 className="text-xl font-black uppercase text-white tracking-wider border-b border-slate-800 pb-4">
                Direct Contact
              </h2>

              <ul className="space-y-6 text-xs text-slate-300">
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500">Call Directly</span>
                    <a href={`tel:${businessInfo.phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                      {businessInfo.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500">WhatsApp (Photos Welcome)</span>
                    <a
                      href={`https://wa.me/${businessInfo.whatsappFormatted}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      +353 86 252 5331
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500">Email Enquiries</span>
                    <a href={`mailto:${businessInfo.email}`} className="text-sm font-bold text-white hover:text-amber-400 transition-colors break-all">
                      {businessInfo.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 text-amber-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-500">Service Area</span>
                    <span className="text-xs text-slate-300 font-medium">
                      Dublin City, Clontarf, Fairview, Drumcondra, Raheny, Malahide, Howth & Surrounds
                    </span>
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={businessInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-amber-400 transition-colors"
                >
                  <span>View Google Maps Profile</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
