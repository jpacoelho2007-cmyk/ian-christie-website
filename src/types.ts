export interface BusinessInfo {
  name: string;
  phone: string;
  formattedPhone: string;
  email: string;
  whatsapp: string;
  whatsappFormatted: string;
  googleMapsUrl: string;
  address: string;
  openingHours?: string;
  areasCovered: string[];
}

export interface SitePageContent {
  header: {
    brandTitle: string;
    brandSubtitle: string;
    ctaButtonText: string;
  };
  hero: {
    ratingScore: string;
    ratingLabel: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    heroImage: string;
    introText: string;
    ctaButtonText: string;
    ctaTarget: string;
  };
  servicesSection: {
    badge: string;
    title: string;
    subtitle?: string;
  };
  gallerySection: {
    badge: string;
    title: string;
    subtitle?: string;
  };
  reviewsSection: {
    badge: string;
    title: string;
    subtitle?: string;
  };
  blogSection: {
    badge: string;
    title: string;
    subtitle?: string;
  };
  faqSection: {
    badge: string;
    title: string;
    subtitle?: string;
  };
  contactSection: {
    badge: string;
    title: string;
    subtitle?: string;
    submitButtonText: string;
    successTitle: string;
    successText: string;
  };
  footer: {
    tagline: string;
    areasServedText: string;
    copyrightText: string;
  };
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
  preferredContact?: 'phone' | 'whatsapp' | 'email';
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: 'Consumer Units' | 'Lighting' | 'Kitchens' | 'Sockets & Wiring' | 'Commercial' | 'Domestic Work' | 'Wiring & Circuits' | string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
  published: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  bulletPoints: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  relativeTime: string;
  text: string;
  source: 'google' | 'direct';
  googleProfileUrl?: string;
}

