import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';
import SEOHead from '../components/SEOHead';

interface FAQViewProps {
  faqs: FAQItem[];
  onOpenQuoteModal: () => void;
}

export default function FAQView({ faqs, onOpenQuoteModal }: FAQViewProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <SEOHead
        title="Frequently Asked Questions | Ian Christie Electrical Dublin"
        description="Common questions regarding quotes, fuse board upgrades, WhatsApp photos, and electrical services across Dublin."
        pagePath="/faq"
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            CLEAR ANSWERS
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Everything you need to know about getting electrical work done in Dublin.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="py-6 space-y-3">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    {faq.question}
                  </h2>
                  <div className="p-2 border border-slate-800 text-amber-400 group-hover:border-amber-400 transition-colors shrink-0">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="text-sm text-slate-300 leading-relaxed font-normal pt-2 animate-in slide-in-from-top-1 duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick CTA Box */}
        <div className="bg-slate-900 border border-slate-800 p-8 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-xl font-black uppercase text-white">Have a Specific Electrical Question?</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Get in touch with Ian directly for honest advice or to send a photo of your electrical job via WhatsApp.
          </p>
          <button
            onClick={onOpenQuoteModal}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer inline-block"
          >
            Ask Ian a Question
          </button>
        </div>
      </div>
    </div>
  );
}
