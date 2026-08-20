import { MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { BusinessInfo, SitePageContent } from '../types';

interface FooterProps {
  businessInfo: BusinessInfo;
  pageContent?: SitePageContent;
  setActiveTab: (tab: string) => void;
}

export default function Footer({ businessInfo, pageContent, setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const brandTitle = pageContent?.header?.brandTitle || 'IAN CHRISTIE';
  const tagline = pageContent?.footer?.tagline || 'Professional domestic and commercial electrical contractor serving Dublin. Safe installations, clear communication, and high-quality craftsmanship.';
  const areasServedText = pageContent?.footer?.areasServedText || 'Serving all Dublin areas including Clontarf, Fairview, Drumcondra, Raheny, Malahide, Howth, Swords, and Dublin City Centre.';
  const copyrightText = pageContent?.footer?.copyrightText || `${businessInfo.name || 'Ian Christie Electrical'}. All rights reserved.`;

  const handleNavClick = (sectionId: string) => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-white uppercase">
                {brandTitle}
              </span>
              <span className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
                ELECTRICAL • DUBLIN
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {tagline}
            </p>

            <div className="pt-2">
              <a
                href={businessInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'services', label: 'Services' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'blog', label: 'Blog' },
                { id: 'faq', label: 'FAQ' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-slate-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Phone</span>
                <a href={`tel:${(businessInfo.phone || '').replace(/\s+/g, '')}`} className="font-bold hover:text-amber-400 transition-colors">
                  {businessInfo.phone || ''}
                </a>
              </li>
              <li>
                <span className="block text-[10px] uppercase font-bold text-slate-500">WhatsApp</span>
                <a
                  href={`https://wa.me/${businessInfo.whatsappFormatted}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-amber-400 transition-colors"
                >
                  {businessInfo.whatsapp || businessInfo.phone}
                </a>
              </li>
              <li>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Email</span>
                <a href={`mailto:${businessInfo.email}`} className="font-bold hover:text-amber-400 transition-colors break-all">
                  {businessInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Coverage Areas */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Areas Served
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {areasServedText}
            </p>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {copyrightText}</p>

          <button
            onClick={() => {
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Access</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
