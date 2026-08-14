import { useState } from 'react';
import { ArrowUpRight, Plus, Minus, Check } from 'lucide-react';
import { ServiceItem, BusinessInfo } from '../types';
import SEOHead from '../components/SEOHead';

interface ServicesViewProps {
  businessInfo: BusinessInfo;
  services: ServiceItem[];
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export default function ServicesView({
  services,
  onOpenQuoteModal
}: ServicesViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEOHead
        title="Services | Ian Christie Electrical Dublin"
        description="Electrical installations, lighting solutions, fault finding, socket upgrades, consumer units, and domestic electrical repairs across Dublin."
        pagePath="/services"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="border-b border-slate-800 pb-8 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            ELECTRICAL SERVICES • DUBLIN
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            OUR CAPABILITIES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Clean, reliable domestic and commercial electrical work carried out to current Irish safety standards.
          </p>
        </div>

        {/* Editorial Numbered Services List */}
        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
          {services.map((service, index) => {
            const isExpanded = expandedId === service.id;
            const numStr = index < 9 ? `0${index + 1}` : `${index + 1}`;

            return (
              <div
                key={service.id}
                className="group py-8 transition-colors hover:bg-slate-900/50"
              >
                <div
                  onClick={() => toggleExpand(service.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                >
                  {/* Left: Number & Title */}
                  <div className="flex items-start md:items-center gap-6 sm:gap-10">
                    <span className="text-2xl sm:text-4xl font-mono font-bold text-amber-400">
                      {numStr}
                    </span>
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 max-w-xl">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuoteModal(service.title);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Request Quote</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 border border-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-700 transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <Minus className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        Work Included
                      </h3>
                      <ul className="space-y-2">
                        {service.bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 bg-slate-900/80 p-5 border border-slate-800">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {service.fullDesc}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
