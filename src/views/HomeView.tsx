import { useState, FormEvent } from 'react';
import { ArrowUpRight, Plus, Minus, Send, CheckCircle, ExternalLink, ZoomIn, Zap, Star, Calendar, User, BookOpen, X, ArrowLeft } from 'lucide-react';
import { BusinessInfo, ServiceItem, GalleryItem, Review, BlogPost, FAQItem, SitePageContent } from '../types';
import SEOHead from '../components/SEOHead';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { resolveImageUrl } from '../utils/images';

interface HomeViewProps {
  businessInfo: BusinessInfo;
  pageContent?: SitePageContent;
  services: ServiceItem[];
  gallery: GalleryItem[];
  blogPosts: BlogPost[];
  reviews: Review[];
  faqs?: FAQItem[];
  onOpenLightbox: (index: number) => void;
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export default function HomeView({
  businessInfo,
  pageContent,
  services,
  gallery,
  blogPosts = [],
  reviews,
  faqs = [],
  onOpenLightbox,
  onOpenQuoteModal
}: HomeViewProps) {
  // Blog reader state
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  // Service row expand state
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  // Gallery category state
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');
  const galleryCategories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];
  const filteredGallery = selectedGalleryCategory === 'All'
    ? gallery
    : gallery.filter((g) => g.category === selectedGalleryCategory);

  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || 'f1');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingContact(false);
    }
  };

  const heroRating = pageContent?.hero?.ratingScore || '4.8';
  const heroReviewsLabel = pageContent?.hero?.ratingLabel || '100+ Reviews';
  const heroLine1 = pageContent?.hero?.titleLine1 || 'POWER';
  const heroLine2 = pageContent?.hero?.titleLine2 || 'EXPERIENCE';
  const heroLine3 = pageContent?.hero?.titleLine3 || 'RELIABILITY';
  const heroImage = pageContent?.hero?.heroImage || '/images/photo_1.jpg';
  const heroIntro = pageContent?.hero?.introText || 'IAN CHRISTIE ELECTRICAL — BESPOKE DOMESTIC & COMMERCIAL INSTALLATIONS ACROSS DUBLIN.';
  const heroCta = pageContent?.hero?.ctaButtonText || 'Get a Quote';

  const servicesBadge = pageContent?.servicesSection?.badge || 'CAPABILITIES';
  const servicesTitle = pageContent?.servicesSection?.title || 'SERVICES';

  const galleryBadge = pageContent?.gallerySection?.badge || 'PORTFOLIO';
  const galleryTitle = pageContent?.gallerySection?.title || 'WORK GALLERY';

  const blogBadge = pageContent?.blogSection?.badge || 'INSIGHTS & ADVICE';
  const blogTitle = pageContent?.blogSection?.title || 'BLOG';
  const blogSubtitle = pageContent?.blogSection?.subtitle || 'Practical advice, safety insights, and trade experience from Dublin electrician Ian Christie.';

  const faqBadge = pageContent?.faqSection?.badge || 'HELP';
  const faqTitle = pageContent?.faqSection?.title || 'FAQ';

  const contactBadge = pageContent?.contactSection?.badge || 'CONTACT';
  const contactTitle = pageContent?.contactSection?.title || 'GET A QUOTE';
  const contactSubtitle = pageContent?.contactSection?.subtitle || 'DIRECT CONTACT';
  const contactSubmitText = pageContent?.contactSection?.submitButtonText || 'Send Enquiry';
  const contactSuccessTitle = pageContent?.contactSection?.successTitle || 'Message Sent';
  const contactSuccessText = pageContent?.contactSection?.successText || 'Thank you. Ian will review your job details and get back to you promptly.';

  const displayFaqs = faqs && faqs.length > 0 ? faqs : [
    {
      id: 'f1',
      question: 'How can I request a quote for electrical work?',
      answer: 'You can fill out the enquiry form at the bottom of this page, send details or photos via WhatsApp, or call directly.',
      category: 'General'
    },
    {
      id: 'f2',
      question: 'Can I send photos of my fuse box or light fittings via WhatsApp?',
      answer: 'Yes, photos or short videos sent via WhatsApp (+353 86 252 5331) are a great way to quickly assess your job.',
      category: 'Quotes'
    },
    {
      id: 'f3',
      question: 'What areas in Dublin do you cover?',
      answer: 'Ian covers residential and commercial jobs across all Dublin districts.',
      category: 'Coverage'
    },
    {
      id: 'f4',
      question: 'What should I do if a circuit breaker keeps tripping?',
      answer: 'Unplug appliances on that circuit to check for a faulty device. If the breaker continues tripping with everything unplugged, leave it off and call Ian.',
      category: 'Safety'
    }
  ];

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen space-y-20 sm:space-y-32 pb-20 selection:bg-amber-400 selection:text-slate-950">
      <SEOHead
        title={`${businessInfo.name || 'Ian Christie Electrical'} | Dublin Electrician`}
        description="Ian Christie Electrical provides high-quality domestic and commercial electrical services across Dublin."
        pagePath="/"
      />

      {/* 1. HERO SECTION (#hero) - Editorial Minimalist */}
      <section id="hero" className="relative w-full bg-slate-950 pt-8 sm:pt-12 pb-12 sm:pb-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          
          {/* Top-Left Subtle Rating Badge */}
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/90 text-xs text-slate-300 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-0.5" aria-label={`${heroRating} out of 5 stars`}>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-white">{heroRating}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium">{heroReviewsLabel}</span>
            </div>
          </div>

          {/* Main Huge Words Typography - Ladder Layout */}
          <div className="space-y-1 sm:space-y-3 overflow-hidden">
            <h1 className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.85] flex flex-col">
              <span className="text-amber-400">{heroLine1}</span>
              <span className="text-amber-400 pl-6 sm:pl-16 lg:pl-28 xl:pl-36">{heroLine2}</span>
              <span className="text-white pl-12 sm:pl-32 lg:pl-56 xl:pl-72">{heroLine3}</span>
            </h1>
          </div>

          {/* Featured Real Photography & Primary CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 relative aspect-[16/9] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                id="hero-featured-image"
                src={resolveImageUrl(heroImage)}
                alt="Ian Christie Electrical Work"
                className="w-full h-full object-cover filter saturate-[0.95] transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="lg:col-span-4 space-y-6 flex flex-col justify-end">
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed uppercase tracking-wider">
                {heroIntro}
              </p>

              <div>
                <button
                  onClick={scrollToContact}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-amber-400/10"
                >
                  <span>{heroCta}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICES SECTION (#services) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            {servicesBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
            {servicesTitle}
          </h2>
        </div>

        {/* Numbered Minimal Services List */}
        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
          {services.map((service, index) => {
            const numStr = index < 9 ? `0${index + 1}` : `${index + 1}`;
            const isExpanded = expandedServiceId === service.id;

            return (
              <div
                key={service.id}
                className="group py-6 sm:py-8 transition-colors hover:bg-slate-900/40"
              >
                <div
                  onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                  className="flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-6 sm:gap-12">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                      {numStr}
                    </span>
                    <h3 className="text-lg sm:text-3xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuoteModal(service.title);
                      }}
                      className="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Quote</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="p-2 border border-slate-800 text-slate-400 group-hover:text-white transition-colors">
                      {isExpanded ? <Minus className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-1 duration-150">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                        Scope
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {service.shortDesc}
                      </p>
                    </div>

                    <div className="bg-slate-900 p-4 border border-slate-800">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {service.fullDesc}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. REAL WORK GALLERY SECTION (#gallery) */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
              {galleryBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              {galleryTitle}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGalleryCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  selectedGalleryCategory === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Real Photos Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => {
            const indexInFullList = gallery.findIndex((g) => g.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(indexInFullList !== -1 ? indexInFullList : 0)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-amber-400 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-[0.9]"
                  />

                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-amber-400 text-slate-950 flex items-center gap-2 font-bold text-xs uppercase tracking-wider shadow-xl">
                      <ZoomIn className="w-4 h-4" />
                      <span>View</span>
                    </div>
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-5 space-y-1 bg-slate-950 border-t border-slate-800/80">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REVIEWS SECTION (#reviews) */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ReviewsCarousel reviews={reviews} businessInfo={businessInfo} />
      </section>

      {/* 5. BLOG SECTION (#blog) */}
      <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
              {blogBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              {blogTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-mono">
            {blogSubtitle}
          </p>
        </div>

        {blogPosts.length === 0 ? (
          /* Professional Empty State */
          <div className="bg-slate-900/60 border border-slate-800/80 p-12 text-center space-y-4">
            <Zap className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
            <h3 className="text-lg font-black uppercase text-white tracking-wider">
              ARTICLES & GUIDES COMING SOON
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Check back soon for electrical advice, safety tips, and modern home lighting guides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedBlogPost(post)}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div className="space-y-4">
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={resolveImageUrl(post.imageUrl)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest backdrop-blur-sm">
                      {post.tags?.[0] || 'Advice'}
                    </div>
                  </div>

                  {/* Meta & Title */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:underline flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedBlogPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between z-10">
              <button
                onClick={() => setSelectedBlogPost(null)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>

              <button
                onClick={() => setSelectedBlogPost(null)}
                className="p-1.5 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Header Info */}
              <div className="space-y-4 border-b border-slate-800 pb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedBlogPost.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {selectedBlogPost.author}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  {selectedBlogPost.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed italic border-l-2 border-amber-400 pl-4">
                  {selectedBlogPost.summary}
                </p>
              </div>

              {/* Cover Image */}
              {selectedBlogPost.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={resolveImageUrl(selectedBlogPost.imageUrl)}
                    alt={selectedBlogPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Body Text */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {selectedBlogPost.content}
              </div>

              {/* Tags */}
              {selectedBlogPost.tags && selectedBlogPost.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-2">
                  {selectedBlogPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-950 border border-slate-800 text-[11px] font-bold text-amber-400 uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA footer inside article */}
              <div className="p-6 bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold uppercase text-white tracking-wide">
                    Need advice or installation on your property?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Contact Ian directly for a free, transparent quote.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedBlogPost(null);
                    onOpenQuoteModal();
                  }}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer shrink-0"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FAQ SECTION (#faq) */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            {faqBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
            {faqTitle}
          </h2>
        </div>

        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
          {displayFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div key={faq.id} className="py-5 space-y-2">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <h3 className="text-base sm:text-lg font-bold uppercase text-white group-hover:text-amber-400 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="p-1.5 border border-slate-800 text-amber-400 shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DEDICATED CONTACT SECTION (#contact) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24">
        <div className="bg-slate-900 border border-slate-800 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Enquiry Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
                {contactBadge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                {contactTitle}
              </h2>
            </div>

            {contactSubmitted ? (
              <div className="p-8 bg-slate-950 border border-slate-800 text-center space-y-4">
                <CheckCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-xl font-black uppercase text-white">{contactSuccessTitle}</h3>
                <p className="text-xs text-slate-300">
                  {contactSuccessText}
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Phone</label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Email</label>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">Job Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Details of the electrical job or repairs..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingContact ? 'Sending...' : contactSubmitText}</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase text-white tracking-wider border-b border-slate-800 pb-4">
                {contactSubtitle}
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Phone</span>
                  <a href={`tel:${businessInfo.phone.replace(/\s+/g, '')}`} className="text-lg font-bold text-amber-400 hover:underline">
                    {businessInfo.phone}
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">WhatsApp</span>
                  <a
                    href={`https://wa.me/${businessInfo.whatsappFormatted}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    {businessInfo.whatsapp || businessInfo.phone}
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Email</span>
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="text-sm font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    {businessInfo.email}
                  </a>
                </div>

                {businessInfo.openingHours && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Opening Hours</span>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">
                      {businessInfo.openingHours}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href={businessInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-amber-400 transition-colors"
              >
                <span>Google Maps Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
