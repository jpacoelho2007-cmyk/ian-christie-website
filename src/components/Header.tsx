import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Zap } from 'lucide-react';
import { BusinessInfo, SitePageContent } from '../types';

interface HeaderProps {
  businessInfo: BusinessInfo;
  pageContent?: SitePageContent;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuoteModal: () => void;
}

export default function Header({
  pageContent,
  activeTab,
  setActiveTab,
  onOpenQuoteModal: _onOpenQuoteModal
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const brandTitle = pageContent?.header?.brandTitle || 'IAN CHRISTIE';
  const ctaText = pageContent?.header?.ctaButtonText || 'Get a Quote';

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'blog', label: 'Blog' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  // ScrollSpy / IntersectionObserver to highlight current active section on scroll
  useEffect(() => {
    if (activeTab !== 'home') return;

    const sectionIds = navItems.map((n) => n.id);
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);

    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Bespoke Electrical Mark */}
        <button
          onClick={() => handleNavClick('hero')}
          className="group text-left cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 group-hover:bg-amber-300 transition-colors">
            {/* Sophisticated Abstract Electrical Volt Mark */}
            <Zap className="w-5 h-5 fill-slate-950 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-widest uppercase text-white group-hover:text-amber-400 transition-colors">
            {brandTitle}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab === 'home' && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer relative ${
                  isActive ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Single Clear CTA */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => handleNavClick('contact')}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-400/10"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => handleNavClick('contact')}
            className="px-3.5 py-2 bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider cursor-pointer"
          >
            {ctaText}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-7 h-7 text-amber-400" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[81px] bg-slate-950/98 border-b border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left flex items-center justify-between py-3 border-b border-slate-800/80 cursor-pointer ${
                  activeTab === 'home' && activeSection === item.id ? 'text-amber-400 font-black' : 'text-slate-200 font-bold'
                }`}
              >
                <span className="text-lg uppercase tracking-wider">
                  <span className="text-xs text-slate-500 mr-3 font-mono">0{idx + 1}</span>
                  {item.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-amber-400" />
              </button>
            ))}
          </nav>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('contact');
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest text-center cursor-pointer shadow-xl"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
