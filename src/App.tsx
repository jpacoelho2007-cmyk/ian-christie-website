import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LightboxModal from './components/LightboxModal';
import QuoteModal from './components/QuoteModal';

import HomeView from './views/HomeView';
import AdminView from './views/AdminView';

import {
  initialBusinessInfo,
  initialSiteContent,
  initialServices,
  initialGallery,
  initialBlogPosts,
  initialReviews,
  initialFAQs
} from './data/initialData';
import {
  BusinessInfo,
  SitePageContent,
  ServiceItem,
  GalleryItem,
  BlogPost,
  Review,
  FAQItem
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Dynamic Data States
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo);
  const [pageContent, setPageContent] = useState<SitePageContent>(initialSiteContent);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);

  // Modals
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [presetService, setPresetService] = useState<string | undefined>(undefined);

  const fetchAppData = async () => {
    try {
      // Site Info & Services
      const resInfo = await fetch('/api/site-info');
      if (resInfo.ok) {
        const d = await resInfo.json();
        if (d.businessInfo) setBusinessInfo(d.businessInfo);
        if (d.services) setServices(d.services);
        if (d.pageContent) setPageContent(d.pageContent);
      }

      // Page Content
      const resPageContent = await fetch('/api/page-content');
      if (resPageContent.ok) {
        const d = await resPageContent.json();
        if (d.pageContent) setPageContent(d.pageContent);
      }

      // FAQs
      const resFaqs = await fetch('/api/faqs');
      if (resFaqs.ok) {
        const d = await resFaqs.json();
        if (d.faqs) setFaqs(d.faqs);
      }

      // Gallery
      const resGal = await fetch('/api/gallery');
      if (resGal.ok) {
        const d = await resGal.json();
        if (d.gallery) setGallery(d.gallery);
      }

      // Blog
      const resBlog = await fetch('/api/blog');
      if (resBlog.ok) {
        const d = await resBlog.json();
        if (d.posts) setBlogPosts(d.posts);
      }

      // Reviews
      const resRev = await fetch('/api/reviews');
      if (resRev.ok) {
        const d = await resRev.json();
        if (d.reviews) setReviews(d.reviews);
      }
    } catch (err) {
      console.log('Using initial state defaults');
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handleOpenQuote = (serviceTitle?: string) => {
    setPresetService(serviceTitle);
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      <div>
        {/* Header Navigation */}
        <Header
          businessInfo={businessInfo}
          pageContent={pageContent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuoteModal={() => handleOpenQuote()}
        />

        {/* Main Content Area */}
        <main className="bg-slate-950">
          {activeTab === 'admin' ? (
            <AdminView
              businessInfo={businessInfo}
              pageContent={pageContent}
              services={services}
              gallery={gallery}
              blogPosts={blogPosts}
              reviews={reviews}
              faqs={faqs}
              onRefreshData={fetchAppData}
            />
          ) : (
            <HomeView
              businessInfo={businessInfo}
              pageContent={pageContent}
              services={services}
              gallery={gallery}
              blogPosts={blogPosts}
              reviews={reviews}
              faqs={faqs}
              onOpenLightbox={(idx) => setLightboxIndex(idx)}
              onOpenQuoteModal={(srv) => handleOpenQuote(srv)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        businessInfo={businessInfo}
        pageContent={pageContent}
        setActiveTab={setActiveTab}
      />

      {/* Modals */}
      <LightboxModal
        items={gallery}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        presetService={presetService}
        businessInfo={businessInfo}
      />
    </div>
  );
}
