import { useState, useEffect, FormEvent } from 'react';
import {
  Lock, LogOut, Mail, Trash2, CheckCircle2, Plus, Edit, Shield, Save, Eye, EyeOff,
  KeyRound, AlertCircle, Check, Loader2, Image as ImageIcon, Star, HelpCircle,
  FileText, Briefcase, Settings, ArrowUp, ArrowDown, ExternalLink, RefreshCw, Copy
} from 'lucide-react';
import { Enquiry, BlogPost, GalleryItem, BusinessInfo, ServiceItem, Review, FAQItem, SitePageContent } from '../types';
import SEOHead from '../components/SEOHead';
import { resolveImageUrl } from '../utils/images';
import ImageUploadField from '../components/ImageUploadField';

interface AdminViewProps {
  businessInfo: BusinessInfo;
  pageContent?: SitePageContent;
  services?: ServiceItem[];
  gallery?: GalleryItem[];
  blogPosts?: BlogPost[];
  reviews?: Review[];
  faqs?: FAQItem[];
  onRefreshData: () => void;
}

type TabType =
  | 'content'
  | 'business'
  | 'services'
  | 'gallery'
  | 'blog'
  | 'reviews'
  | 'faqs'
  | 'enquiries'
  | 'media'
  | 'security';

export default function AdminView({
  businessInfo,
  pageContent: initialPageContent,
  services: initialServices = [],
  gallery: initialGallery = [],
  blogPosts: initialBlogPosts = [],
  reviews: initialReviews = [],
  faqs: initialFaqs = [],
  onRefreshData
}: AdminViewProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('ian_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('content');

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string; size: number; modified: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Page Content Edit State
  const [pageContent, setPageContent] = useState<SitePageContent>(
    initialPageContent || {
      header: {
        brandTitle: 'IAN CHRISTIE',
        tagline: 'ELECTRICAL CONTRACTOR • DUBLIN',
        ctaButtonText: 'Get a Quote'
      },
      hero: {
        badgeText: 'DUBLIN CERTIFIED ELECTRICIAN',
        ratingScore: '4.8',
        ratingLabel: '100+ Reviews',
        titleLine1: 'POWER',
        titleLine2: 'EXPERIENCE',
        titleLine3: 'RELIABILITY',
        introText: 'IAN CHRISTIE ELECTRICAL — BESPOKE DOMESTIC & COMMERCIAL INSTALLATIONS ACROSS DUBLIN.',
        ctaButtonText: 'Get a Quote',
        heroImage: '/images/photo_1.jpg'
      },
      servicesSection: {
        badge: 'CAPABILITIES',
        title: 'SERVICES',
        subtitle: 'Comprehensive residential and commercial electrical solutions across Dublin.'
      },
      gallerySection: {
        badge: 'PORTFOLIO',
        title: 'WORK GALLERY',
        subtitle: 'Real photos of electrical installations, lighting, and fuse board upgrades.'
      },
      blogSection: {
        badge: 'INSIGHTS & ADVICE',
        title: 'BLOG',
        subtitle: 'Practical advice, safety insights, and trade experience from Dublin electrician Ian Christie.'
      },
      faqSection: {
        badge: 'HELP',
        title: 'FAQ'
      },
      contactSection: {
        badge: 'CONTACT',
        title: 'GET A QUOTE',
        subtitle: 'DIRECT CONTACT',
        submitButtonText: 'Send Enquiry',
        successTitle: 'Message Sent',
        successText: 'Thank you. Ian will review your job details and get back to you promptly.'
      },
      footer: {
        tagline: 'Professional domestic and commercial electrical contractor serving Dublin. Safe installations, clear communication, and high-quality craftsmanship.',
        areasServedText: 'Serving all Dublin areas including Clontarf, Fairview, Drumcondra, Raheny, Malahide, Howth, Swords, and Dublin City Centre.',
        copyrightText: 'Ian Christie Electrical. All rights reserved.'
      }
    }
  );

  // Business Info Edit State
  const [siteInfo, setSiteInfo] = useState<BusinessInfo>(businessInfo);

  // Blog Editor State
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);

  // Gallery Editor State
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);
  const [isNewGalleryItem, setIsNewGalleryItem] = useState(false);

  // Service Editor State
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Review Editor State
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [isNewReview, setIsNewReview] = useState(false);

  // FAQ Editor State
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Fetch complete admin data
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Enquiries
      const resEnq = await fetch('/api/enquiries', {
        headers: { 'x-admin-auth': token }
      });
      if (resEnq.ok) {
        const d = await resEnq.json();
        setEnquiries(d.enquiries || []);
      }

      // 2. Page Content
      const resContent = await fetch('/api/page-content');
      if (resContent.ok) {
        const d = await resContent.json();
        if (d.pageContent) setPageContent(d.pageContent);
      }

      // 3. Blog Posts
      const resBlog = await fetch('/api/blog');
      if (resBlog.ok) {
        const d = await resBlog.json();
        setBlogPosts(d.posts || []);
      }

      // 4. Gallery
      const resGal = await fetch('/api/gallery');
      if (resGal.ok) {
        const d = await resGal.json();
        setGallery(d.gallery || []);
      }

      // 5. Services
      const resServ = await fetch('/api/services');
      if (resServ.ok) {
        const d = await resServ.json();
        setServices(d.services || []);
      }

      // 6. Reviews
      const resRev = await fetch('/api/reviews');
      if (resRev.ok) {
        const d = await resRev.json();
        setReviews(d.reviews || []);
      }

      // 7. FAQs
      const resFaq = await fetch('/api/faqs');
      if (resFaq.ok) {
        const d = await resFaq.json();
        setFaqs(d.faqs || []);
      }

      // 8. Media Library
      const resMedia = await fetch('/api/media');
      if (resMedia.ok) {
        const d = await resMedia.json();
        setMediaFiles(d.files || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Sync state if props change
  useEffect(() => {
    if (initialPageContent) setPageContent(initialPageContent);
  }, [initialPageContent]);

  useEffect(() => {
    setSiteInfo(businessInfo);
  }, [businessInfo]);

  // --- Auth Handlers ---
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem('ian_admin_token', data.token);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ian_admin_token');
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token || ''
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('ian_admin_token', data.token);
        }
        setPasswordSuccess(data.message || 'Password changed successfully! Please keep your new password safe.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password. Please verify your current password.');
      }
    } catch {
      setPasswordError('Server connection error. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const showFeedback = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 4000);
  };

  // --- 1. Page Content Handlers ---
  const handleSavePageContent = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/page-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(pageContent)
      });

      if (res.ok) {
        showFeedback('Page headings & content updated successfully!');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 2. Business Info Handler ---
  const handleSaveSiteInfo = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/site-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(siteInfo)
      });

      if (res.ok) {
        const d = await res.json();
        if (d && d.businessInfo) {
          setSiteInfo(d.businessInfo as BusinessInfo);
        }
        showFeedback('Business details updated successfully!');
        setActionError('');
        onRefreshData();
      } else {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.error || `Save failed (${res.status})`;
        console.error('Save site-info failed:', msg);
        setActionError(String(msg));
        // keep existing state so user can retry
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. Services Handlers ---
  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingService) return;

    try {
      const url = isNewService ? '/api/services' : `/api/services/${editingService.id}`;
      const method = isNewService ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(editingService)
      });

      if (res.ok) {
        showFeedback(isNewService ? 'Service added!' : 'Service updated!');
        setEditingService(null);
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      onRefreshData();
      showFeedback('Service deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- 4. Gallery Handlers ---
  const handleSaveGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingGalleryItem) return;

    try {
      const url = isNewGalleryItem ? '/api/gallery' : `/api/gallery/${editingGalleryItem.id}`;
      const method = isNewGalleryItem ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(editingGalleryItem)
      });

      if (res.ok) {
        showFeedback(isNewGalleryItem ? 'Gallery photo added!' : 'Gallery item updated!');
        setEditingGalleryItem(null);
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!token || !confirm('Delete this gallery photo?')) return;
    try {
      await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      onRefreshData();
      showFeedback('Gallery photo deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderGallery = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const newOrder = [...gallery];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setGallery(newOrder);

    try {
      await fetch('/api/gallery-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify({ itemIds: newOrder.map(item => item.id) })
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- 5. Blog Handlers ---
  const handleSaveBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingPost) return;

    try {
      const url = isNewPost ? '/api/blog' : `/api/blog/${editingPost.id}`;
      const method = isNewPost ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(editingPost)
      });

      if (res.ok) {
        showFeedback(isNewPost ? 'Article published!' : 'Article updated!');
        setEditingPost(null);
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!token || !confirm('Delete this article?')) return;
    try {
      await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      onRefreshData();
      showFeedback('Article deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- 6. Reviews Handlers ---
  const handleSaveReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingReview) return;

    try {
      const url = isNewReview ? '/api/reviews' : `/api/reviews/${editingReview.id}`;
      const method = isNewReview ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(editingReview)
      });

      if (res.ok) {
        showFeedback(isNewReview ? 'Review added!' : 'Review updated!');
        setEditingReview(null);
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!token || !confirm('Delete this review?')) return;
    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      onRefreshData();
      showFeedback('Review deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- 7. FAQs Handlers ---
  const handleSaveFaq = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingFaq) return;

    try {
      const url = isNewFaq ? '/api/faqs' : `/api/faqs/${editingFaq.id}`;
      const method = isNewFaq ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify(editingFaq)
      });

      if (res.ok) {
        showFeedback(isNewFaq ? 'FAQ question added!' : 'FAQ updated!');
        setEditingFaq(null);
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!token || !confirm('Delete this FAQ question?')) return;
    try {
      await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      onRefreshData();
      showFeedback('FAQ deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- 8. Enquiries Handlers ---
  const handleToggleEnquiryStatus = async (id: string, currentStatus: string) => {
    if (!token) return;
    const newStatus = currentStatus === 'new' ? 'read' : 'new';
    try {
      await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!token || !confirm('Delete this enquiry?')) return;
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      showFeedback('Enquiry deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // --- 9. Media Library Handlers ---
  const handleDeleteMedia = async (filename: string) => {
    if (!token || !confirm(`Delete file ${filename}?`)) return;
    try {
      await fetch(`/api/media/${filename}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': token }
      });
      fetchAdminData();
      showFeedback('File deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  // 1. LOGIN SCREEN
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <SEOHead title="Admin Login | Ian Christie Electrical" description="Business Admin Login" />

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black">Business Admin Login</h1>
            <p className="text-xs text-slate-400">
              Ian Christie Electrical Management Panel
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Log In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD SCREEN
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead title="Admin Dashboard | Ian Christie Electrical" description="Management Dashboard" />

      {/* Top Admin Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black">Business Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Complete CMS & Content Management Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actionMsg && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{actionMsg}</span>
            </span>
          )}
          {actionError && (
            <span className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{actionError}</span>
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'content', label: 'Headings & Text', icon: Edit },
          { id: 'business', label: 'Business Details', icon: Briefcase },
          { id: 'services', label: `Services (${services.length})`, icon: Settings },
          { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon },
          { id: 'blog', label: `Blog (${blogPosts.length})`, icon: FileText },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          {
            id: 'enquiries',
            label: 'Enquiries Inbox',
            icon: Mail,
            badge: enquiries.filter(e => e.status === 'new').length
          },
          { id: 'media', label: 'Media Library', icon: RefreshCw },
          { id: 'security', label: 'Change Password', icon: Lock }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge && t.badge > 0 ? (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HEADINGS & SITE CONTENT CMS */}
      {activeTab === 'content' && (
        <form onSubmit={handleSavePageContent} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Edit Headings & Page Copy</h2>
              <p className="text-xs text-slate-400">
                Change text, banners, badges, call-to-actions, and images across the entire website.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Header & Brand Settings */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                1. Top Navigation Bar
              </h3>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Brand Title</label>
                <input
                  type="text"
                  value={pageContent?.header?.brandTitle || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      header: { ...(pageContent.header || {}), brandTitle: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Header CTA Button Text</label>
                <input
                  type="text"
                  value={pageContent?.header?.ctaButtonText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      header: { ...(pageContent.header || {}), ctaButtonText: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                2. Hero Section
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Rating Score</label>
                  <input
                    type="text"
                    value={pageContent?.hero?.ratingScore || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        hero: { ...(pageContent.hero || {}), ratingScore: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Rating Label</label>
                  <input
                    type="text"
                    value={pageContent?.hero?.ratingLabel || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        hero: { ...(pageContent.hero || {}), ratingLabel: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Hero Main Title (3-Tier Words)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Line 1"
                    value={pageContent?.hero?.titleLine1 || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        hero: { ...(pageContent.hero || {}), titleLine1: e.target.value }
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Line 2"
                    value={pageContent?.hero?.titleLine2 || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        hero: { ...(pageContent.hero || {}), titleLine2: e.target.value }
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Line 3"
                    value={pageContent?.hero?.titleLine3 || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        hero: { ...(pageContent.hero || {}), titleLine3: e.target.value }
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Hero Intro Description</label>
                <textarea
                  rows={2}
                  value={pageContent?.hero?.introText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      hero: { ...(pageContent.hero || {}), introText: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Hero Button Text</label>
                <input
                  type="text"
                  value={pageContent?.hero?.ctaButtonText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      hero: { ...(pageContent.hero || {}), ctaButtonText: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Hero Image Upload */}
              <div className="pt-2">
                <ImageUploadField
                  label="Hero Featured Image"
                  value={pageContent?.hero?.heroImage || '/images/photo_1.jpg'}
                  token={token}
                  darkTheme={true}
                  onChange={(url) =>
                    setPageContent({
                      ...pageContent,
                      hero: { ...(pageContent.hero || {}), heroImage: url }
                    })
                  }
                />
              </div>
            </div>

            {/* Services & Gallery Headings */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                3. Section Titles & Badges
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Services Badge</label>
                  <input
                    type="text"
                    value={pageContent?.servicesSection?.badge || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        servicesSection: { ...(pageContent.servicesSection || {}), badge: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Services Title</label>
                  <input
                    type="text"
                    value={pageContent?.servicesSection?.title || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        servicesSection: { ...(pageContent.servicesSection || {}), title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Gallery Badge</label>
                  <input
                    type="text"
                    value={pageContent?.gallerySection?.badge || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        gallerySection: { ...(pageContent.gallerySection || {}), badge: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Gallery Title</label>
                  <input
                    type="text"
                    value={pageContent?.gallerySection?.title || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        gallerySection: { ...(pageContent.gallerySection || {}), title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Blog Badge</label>
                  <input
                    type="text"
                    value={pageContent?.blogSection?.badge || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        blogSection: { ...(pageContent.blogSection || {}), badge: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Blog Title</label>
                  <input
                    type="text"
                    value={pageContent?.blogSection?.title || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        blogSection: { ...(pageContent.blogSection || {}), title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Blog Subtitle</label>
                <input
                  type="text"
                  value={pageContent?.blogSection?.subtitle || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      blogSection: { ...(pageContent.blogSection || {}), subtitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">FAQ Badge</label>
                  <input
                    type="text"
                    value={pageContent?.faqSection?.badge || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        faqSection: { ...(pageContent.faqSection || {}), badge: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">FAQ Title</label>
                  <input
                    type="text"
                    value={pageContent?.faqSection?.title || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        faqSection: { ...(pageContent.faqSection || {}), title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Contact Section & Footer */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                4. Contact Form & Footer
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Contact Section Badge</label>
                  <input
                    type="text"
                    value={pageContent?.contactSection?.badge || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        contactSection: { ...(pageContent.contactSection || {}), badge: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Contact Section Title</label>
                  <input
                    type="text"
                    value={pageContent?.contactSection?.title || ''}
                    onChange={(e) =>
                      setPageContent({
                        ...pageContent,
                        contactSection: { ...(pageContent.contactSection || {}), title: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Submit Button Text</label>
                <input
                  type="text"
                  value={pageContent?.contactSection?.submitButtonText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      contactSection: { ...(pageContent.contactSection || {}), submitButtonText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Footer Tagline</label>
                <textarea
                  rows={2}
                  value={pageContent?.footer?.tagline || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      footer: { ...(pageContent.footer || {}), tagline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Areas Served Text</label>
                <textarea
                  rows={2}
                  value={pageContent?.footer?.areasServedText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      footer: { ...(pageContent.footer || {}), areasServedText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Copyright Line</label>
                <input
                  type="text"
                  value={pageContent?.footer?.copyrightText || ''}
                  onChange={(e) =>
                    setPageContent({
                      ...pageContent,
                      footer: { ...(pageContent.footer || {}), copyrightText: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BUSINESS DETAILS */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveSiteInfo} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Business Information & Contact Details</h2>
              <p className="text-xs text-slate-400">
                Update phone numbers, email, WhatsApp, address, and Google Maps URL.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Business Name</label>
              <input
                type="text"
                value={siteInfo.name || ''}
                onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={siteInfo.phone || ''}
                  onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">WhatsApp Number</label>
                <input
                  type="text"
                  value={siteInfo.whatsapp || ''}
                  onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={siteInfo.email || ''}
                  onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Opening Hours</label>
                <input
                  type="text"
                  value={siteInfo.openingHours || 'Monday – Friday: 08:00 – 18:00\nSaturday: 09:00 – 14:00'}
                  onChange={(e) => setSiteInfo({ ...siteInfo, openingHours: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Physical Address / City</label>
              <input
                type="text"
                value={siteInfo.address || ''}
                onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Google Maps Profile URL</label>
              <input
                type="text"
                value={siteInfo.googleMapsUrl || ''}
                onChange={(e) => setSiteInfo({ ...siteInfo, googleMapsUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Save Business Details
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage Services & Capabilities</h2>
              <p className="text-xs text-slate-400">Add, edit, or delete electrical services offered on the website.</p>
            </div>
            <button
              onClick={() => {
                setIsNewService(true);
                setEditingService({
                  title: '',
                  shortDesc: '',
                  fullDesc: '',
                  icon: 'Zap'
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {editingService && (
            <form onSubmit={handleSaveService} className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                {isNewService ? 'Add New Service' : 'Edit Service'}
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Domestic Electrical Installations"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Short Summary / Scope *</label>
                <input
                  type="text"
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="Brief summary visible on click"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Full Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editingService.fullDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  placeholder="Full scope of work, technical details, certifications..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {services.map((serv, index) => (
              <div
                key={serv.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">{serv.title}</h3>
                    <p className="text-xs text-slate-400">{serv.shortDesc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsNewService(false);
                      setEditingService(serv);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(serv.id)}
                    className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage Work Gallery Photos</h2>
              <p className="text-xs text-slate-400">
                Upload real photos from your computer, change captions, categories, or reorder.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewGalleryItem(true);
                setEditingGalleryItem({
                  title: '',
                  caption: '',
                  imageUrl: '/images/photo_1.jpg',
                  category: 'Lighting'
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Photo</span>
            </button>
          </div>

          {editingGalleryItem && (
            <form onSubmit={handleSaveGallery} className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                {isNewGalleryItem ? 'Add Gallery Photo' : 'Edit Gallery Photo'}
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title || ''}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={editingGalleryItem.category || 'Lighting'}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Consumer Units">Consumer Units</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Immersion & Sockets">Immersion & Sockets</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Caption / Description</label>
                  <input
                    type="text"
                    value={editingGalleryItem.caption || ''}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, caption: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Direct Computer Upload Component */}
              <ImageUploadField
                label="Gallery Photo File"
                value={editingGalleryItem.imageUrl || '/images/photo_1.jpg'}
                token={token}
                darkTheme={true}
                onChange={(url) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: url })}
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Gallery Item
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGalleryItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
                <div>
                  <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden">
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-slate-950/90 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-800">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.caption}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorderGallery(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReorderGallery(index, 'down')}
                      disabled={index === gallery.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsNewGalleryItem(false);
                        setEditingGalleryItem(item);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-1 text-red-400 hover:bg-red-950/60 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BLOG ARTICLES */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage Blog & Trade Articles</h2>
              <p className="text-xs text-slate-400">
                Publish advice, safety guides, and tips for Dublin homeowners.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewPost(true);
                setEditingPost({
                  title: '',
                  summary: '',
                  content: '',
                  imageUrl: '/images/photo_1.jpg',
                  author: 'Ian Christie',
                  date: new Date().toLocaleDateString('en-IE', { month: 'short', year: 'numeric' }),
                  tags: ['Electrical Advice', 'Dublin']
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          </div>

          {editingPost && (
            <form onSubmit={handleSaveBlog} className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                {isNewPost ? 'Write New Article' : 'Edit Article'}
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="e.g. 5 Warning Signs of Outdated Fuse Boards"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Author</label>
                  <input
                    type="text"
                    value={editingPost.author || 'Ian Christie'}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Date Display</label>
                  <input
                    type="text"
                    value={editingPost.date || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Category Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingPost.tags?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Safety, Dublin, Wiring"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Direct Computer Upload for Blog Cover */}
              <ImageUploadField
                label="Article Cover Image"
                value={editingPost.imageUrl || '/images/photo_1.jpg'}
                token={token}
                darkTheme={true}
                onChange={(url) => setEditingPost({ ...editingPost, imageUrl: url })}
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Short Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={editingPost.summary || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                  placeholder="A concise overview shown on the card..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Full Article Content *</label>
                <textarea
                  required
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Write the full article text here. Paragraph breaks are preserved..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Article
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <img
                    src={resolveImageUrl(post.imageUrl)}
                    alt={post.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                        {post.tags?.[0] || 'Advice'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{post.date}</span>
                    </div>
                    <h3 className="font-bold text-white text-base">{post.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{post.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsNewPost(false);
                      setEditingPost(post);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(post.id)}
                    className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage Customer Testimonials & Reviews</h2>
              <p className="text-xs text-slate-400">
                Add, edit, or delete reviews displayed on the website carousel.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewReview(true);
                setEditingReview({
                  name: '',
                  location: 'Dublin',
                  rating: 5,
                  text: '',
                  date: 'Recent',
                  isVerified: true,
                  source: 'google'
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Review</span>
            </button>
          </div>

          {editingReview && (
            <form onSubmit={handleSaveReview} className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                {isNewReview ? 'Add Testimonial' : 'Edit Testimonial'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingReview.name || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    placeholder="e.g. David M."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={editingReview.location || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    placeholder="e.g. Clontarf, Dublin 3"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Star Rating (1-5)</label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Review Text *</label>
                <textarea
                  required
                  rows={3}
                  value={editingReview.text || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                  placeholder="Customer feedback..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingReview.isVerified ?? true}
                    onChange={(e) => setEditingReview({ ...editingReview, isVerified: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Verified Customer Badge</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                      <p className="text-[11px] text-slate-400">{rev.location}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &quot;{rev.text}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsNewReview(false);
                      setEditingReview(rev);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1 text-red-400 hover:bg-red-950/60 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">Edit or add customer FAQs displayed on the home page.</p>
            </div>
            <button
              onClick={() => {
                setIsNewFaq(true);
                setEditingFaq({
                  question: '',
                  answer: '',
                  category: 'General'
                });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          {editingFaq && (
            <form onSubmit={handleSaveFaq} className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white">
                {isNewFaq ? 'Add FAQ Question' : 'Edit FAQ Question'}
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. What areas in Dublin do you cover?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Clear answer for the client..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save FAQ
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{faq.question}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setIsNewFaq(false);
                        setEditingFaq(faq);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 text-red-400 hover:bg-red-950/60 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 pl-9 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ENQUIRIES INBOX */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Contact Form Enquiries & Quote Requests</h2>
              <p className="text-xs text-slate-400">
                Messages submitted through the website quote form.
              </p>
            </div>
          </div>

          {enquiries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
              No customer enquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    enq.status === 'new'
                      ? 'bg-amber-500/5 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 border-slate-800 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{enq.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          enq.status === 'new'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {enq.status === 'new' ? 'NEW' : 'READ'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(enq.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="py-3 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <strong className="text-white">Phone:</strong>{' '}
                      {enq.phone ? (
                        <a href={`tel:${enq.phone}`} className="text-amber-400 hover:underline font-bold">
                          {enq.phone}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div>
                      <strong className="text-white">Email:</strong>{' '}
                      {enq.email ? (
                        <a href={`mailto:${enq.email}`} className="text-amber-400 hover:underline">
                          {enq.email}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div>
                      <strong className="text-white">Preferred:</strong>{' '}
                      <span className="capitalize">{enq.preferredContact || 'phone'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 font-medium bg-slate-950/80 p-4 rounded-xl border border-slate-800 my-2 whitespace-pre-line leading-relaxed">
                    &quot;{enq.message}&quot;
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleEnquiryStatus(enq.id, enq.status)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Mark as {enq.status === 'new' ? 'Read' : 'New'}
                    </button>
                    <button
                      onClick={() => handleDeleteEnquiry(enq.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: MEDIA LIBRARY & DIRECT FILE UPLOADS */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Media Library & File Manager</h2>
              <p className="text-xs text-slate-400">
                Upload image assets directly from your computer or copy links to use anywhere on the website.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Upload New Image Asset
            </h3>
            <ImageUploadField
              label="Select Local Image File"
              value=""
              token={token}
              darkTheme={true}
              onChange={() => {
                fetchAdminData();
                showFeedback('File uploaded to media library!');
              }}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Stored Assets ({mediaFiles.length})
            </h3>

            {mediaFiles.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                No uploaded files yet. Use the upload box above to add photos.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaFiles.map((file) => (
                  <div
                    key={file.name}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group relative flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-slate-950 relative overflow-hidden">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="text-[11px] font-bold text-slate-200 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{(file.size / 1024).toFixed(0)} KB</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(file.url);
                            showFeedback('Image URL copied to clipboard!');
                          }}
                          className="text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                          title="Copy URL"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMedia(file.name)}
                      className="absolute top-1 right-1 p-1 bg-red-950/80 text-red-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 10: SECURITY & CHANGE PASSWORD */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Change Admin Password</h2>
                <p className="text-xs text-slate-400">
                  Update your dashboard login password. Passwords are encrypted with salted PBKDF2 hashing.
                </p>
              </div>
            </div>

            {/* Success Message */}
            {passwordSuccess && (
              <div className="flex items-start gap-3 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-2xl animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">Password Updated Successfully</div>
                  <div>{passwordSuccess}</div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {passwordError && (
              <div className="flex items-start gap-3 p-4 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-2xl animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">Password Update Failed</div>
                  <div>{passwordError}</div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title={showCurrentPass ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your current password to authorize this update.
                </p>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title={showNewPass ? 'Hide password' : 'Show password'}
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Must be at least 6 characters. Use a secure combination of letters and numbers.
                </p>
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title={showConfirmPass ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice Card */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Authentication & Security Information</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Changing your password takes effect immediately.</li>
              <li>The old password will no longer work.</li>
              <li>Passwords are never displayed in plain text anywhere on the website or panel.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
