import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);
// Optional server-side client using service role key for Storage operations
const serviceSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

let dbCache: any = null;

async function loadDbFromSupabase() {
  const dbClient: any = serviceSupabase || supabase;
  const { data, error } = await dbClient
    .from('site_data')
    .select('data')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Supabase load error:', error);
    throw error;
  }

  if (data?.data) {
    dbCache = data.data;
    return dbCache;
  }

  // Primeira vez: tenta inicializar a partir do db.json local se existir
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const local = JSON.parse(raw);
      dbCache = {
        businessInfo: local.businessInfo || initialBusinessInfo,
        pageContent: local.pageContent || initialSiteContent,
        services: local.services || initialServices,
        gallery: local.gallery || initialGallery,
        faqs: local.faqs || initialFAQs,
        blogPosts: local.blogPosts || initialBlogPosts,
        reviews: local.reviews || initialReviews,
        adminAuth: local.adminAuth || null,
        enquiries: local.enquiries || []
      };
    } else {
      dbCache = {
        businessInfo: initialBusinessInfo,
        pageContent: initialSiteContent,
        services: initialServices,
        gallery: initialGallery,
        faqs: initialFAQs,
        blogPosts: initialBlogPosts,
        reviews: initialReviews,
        adminAuth: null,
        enquiries: []
      };
    }
  } catch (err) {
    console.error('Failed reading local DB for initial Supabase seed:', err);
    dbCache = {
      businessInfo: initialBusinessInfo,
      pageContent: initialSiteContent,
      services: initialServices,
      gallery: initialGallery,
      faqs: initialFAQs,
      blogPosts: initialBlogPosts,
      reviews: initialReviews,
      adminAuth: null,
      enquiries: []
    };
  }

  const { error: insertError } = await dbClient
    .from('site_data')
    .insert({ data: dbCache });

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    throw insertError;
  }

  return dbCache;
}

async function saveDbToSupabase(data: any) {
  dbCache = data;
  const dbClient: any = serviceSupabase || supabase;

  const { data: existing } = await dbClient
    .from('site_data')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await dbClient
      .from('site_data')
      .update({
        data,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) console.error('Supabase save error:', error);
  } else {
    const { error } = await dbClient
      .from('site_data')
      .insert({ data });

    if (error) console.error('Supabase insert error:', error);
  }
}

import { createServer as createViteServer } from 'vite';
import {
  initialBusinessInfo,
  initialSiteContent,
  initialServices,
  initialGallery,
  initialFAQs,
  initialBlogPosts,
  initialReviews
} from './src/data/initialData.ts';
import { Enquiry, GalleryItem, BlogPost, BusinessInfo, ServiceItem, FAQItem, Review, SitePageContent } from './src/types.ts';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), 'data', 'db.json');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Ensure data directory and db.json exist
function ensureDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultSalt = 'ian_christie_elec_salt_2026';
    const defaultHash = crypto.pbkdf2Sync('ian2026', defaultSalt, 100000, 64, 'sha512').toString('hex');

    const defaultData = {
      businessInfo: initialBusinessInfo,
      pageContent: initialSiteContent,
      services: initialServices,
      gallery: initialGallery,
      faqs: initialFAQs,
      blogPosts: initialBlogPosts,
      reviews: initialReviews,
      adminAuth: {
        hash: defaultHash,
        salt: defaultSalt,
        updatedAt: new Date().toISOString()
      },
      enquiries: [
        {
          id: "enq_sample_1",
          name: "Sample Customer Inquiry",
          email: "customer@example.com",
          phone: "+353 87 123 4567",
          message: "Hi Ian, looking for a quote to add 2 USB sockets in my kitchen in Clontarf. Thanks!",
          date: new Date().toISOString(),
          status: "new",
          preferredContact: "whatsapp"
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function readDb() {
  // Prefer Supabase when configured; fallback to local db.json
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    try {
      if (dbCache) return dbCache;
      // loadDbFromSupabase will initialize from defaults or insert db.json data when empty
      return loadDbFromSupabase();
    } catch (err) {
      console.error('Failed to load from Supabase, falling back to local DB:', err);
    }
  }

  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data.pageContent) data.pageContent = initialSiteContent;
    if (!data.businessInfo) data.businessInfo = initialBusinessInfo;
    if (!data.services) data.services = initialServices;
    if (!data.gallery) data.gallery = initialGallery;
    if (!data.faqs) data.faqs = initialFAQs;
    if (!data.blogPosts) data.blogPosts = initialBlogPosts;
    if (!data.reviews) data.reviews = initialReviews;
    if (!data.enquiries) data.enquiries = [];
    return data;
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {
      businessInfo: initialBusinessInfo,
      pageContent: initialSiteContent,
      services: initialServices,
      gallery: initialGallery,
      faqs: initialFAQs,
      blogPosts: initialBlogPosts,
      reviews: initialReviews,
      enquiries: []
    };
  }
}

function writeDb(data: any) {
  ensureDb();
  // Write to Supabase when configured (non-destructive), and also keep a local backup
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    saveDbToSupabase(data).catch(err => console.error('Failed to save to Supabase:', err));
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write local DB file:', err);
  }
}

// Secure Admin Authentication Helpers
const SECRET_SIGNING_KEY = process.env.ADMIN_SESSION_SECRET || 'ian_session_key_92837498273';

function getStoredPasswordHash(): { hash: string; salt: string } {
  const db = readDb();
  if (db.adminAuth && db.adminAuth.hash && db.adminAuth.salt) {
    return { hash: db.adminAuth.hash, salt: db.adminAuth.salt };
  }
  // Initialize default credentials if not yet set
  const defaultSalt = 'ian_christie_elec_salt_2026';
  const defaultHash = crypto.pbkdf2Sync('ian2026', defaultSalt, 100000, 64, 'sha512').toString('hex');
  db.adminAuth = {
    hash: defaultHash,
    salt: defaultSalt,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return { hash: defaultHash, salt: defaultSalt };
}

function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword || typeof inputPassword !== 'string') return false;
  try {
    const { hash, salt } = getStoredPasswordHash();
    const inputHash = crypto.pbkdf2Sync(inputPassword, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

function updateAdminPassword(newPassword: string): boolean {
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = crypto.pbkdf2Sync(newPassword, newSalt, 100000, 64, 'sha512').toString('hex');
  const db = readDb();
  db.adminAuth = {
    hash: newHash,
    salt: newSalt,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  return true;
}

function generateAdminToken(): string {
  const { hash } = getStoredPasswordHash();
  const payload = `${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const signature = crypto.createHmac('sha256', SECRET_SIGNING_KEY)
    .update(`${payload}:${hash}`)
    .digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

function verifyAdminToken(tokenString?: string): boolean {
  if (!tokenString) return false;
  const cleanToken = tokenString.startsWith('Bearer ') ? tokenString.slice(7) : tokenString;
  try {
    const decoded = Buffer.from(cleanToken, 'base64url').toString('utf8');
    const [payload, signature] = decoded.split('.');
    if (!payload || !signature) return false;

    const timestamp = parseInt(payload.split('_')[0], 10);
    // Expiration check: 14 days
    if (isNaN(timestamp) || Date.now() - timestamp > 14 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const { hash } = getStoredPasswordHash();
    const expectedSignature = crypto.createHmac('sha256', SECRET_SIGNING_KEY)
      .update(`${payload}:${hash}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = (req.headers['x-admin-auth'] || req.headers['authorization']) as string | undefined;
  if (verifyAdminToken(authHeader)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized admin access required' });
}

// ================= API ROUTES =================

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  if (verifyPassword(password)) {
    const token = generateAdminToken();
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
});

// Admin Session Verification
app.get('/api/admin/verify-session', (req, res) => {
  const authHeader = (req.headers['x-admin-auth'] || req.headers['authorization']) as string | undefined;
  if (verifyAdminToken(authHeader)) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false });
});

// Change Admin Password
app.post('/api/admin/change-password', verifyAdmin, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All password fields are required.' });
  }

  if (!verifyPassword(currentPassword)) {
    return res.status(400).json({ error: 'The current password you entered is incorrect.' });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'The new password must be at least 6 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'The new password and confirmation password do not match.' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'Your new password must be different from your current password.' });
  }

  updateAdminPassword(newPassword);
  const newToken = generateAdminToken();

  return res.json({
    success: true,
    token: newToken,
    message: 'Your admin password has been changed successfully.'
  });
});

// Site Info (GET all main data)
app.get('/api/site-info', (_req, res) => {
  const db = readDb();
  res.json({
    businessInfo: db.businessInfo || initialBusinessInfo,
    pageContent: db.pageContent || initialSiteContent,
    services: db.services || initialServices,
    faqs: db.faqs || initialFAQs,
    gallery: db.gallery || initialGallery,
    blogPosts: db.blogPosts || initialBlogPosts,
    reviews: db.reviews || initialReviews
  });
});

app.put('/api/site-info', verifyAdmin, (req, res) => {
  const db = readDb();
  db.businessInfo = { ...db.businessInfo, ...req.body };
  writeDb(db);
  res.json({ success: true, businessInfo: db.businessInfo });
});

// Page Content (All Headings, Text, Badges, Buttons, Footers)
app.get('/api/page-content', (_req, res) => {
  const db = readDb();
  res.json({ pageContent: db.pageContent || initialSiteContent });
});

app.put('/api/page-content', verifyAdmin, (req, res) => {
  const db = readDb();
  db.pageContent = { ...(db.pageContent || initialSiteContent), ...req.body };
  writeDb(db);
  res.json({ success: true, pageContent: db.pageContent });
});

// Services API
app.get('/api/services', (_req, res) => {
  const db = readDb();
  res.json({ services: db.services || initialServices });
});

app.post('/api/services', verifyAdmin, (req, res) => {
  const { title, shortDesc, fullDesc, iconName, bulletPoints } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Service title is required' });
  }

  const db = readDb();
  const newService: ServiceItem = {
    id: `srv_${Date.now()}`,
    title: String(title).trim(),
    shortDesc: String(shortDesc || '').trim(),
    fullDesc: String(fullDesc || '').trim(),
    iconName: iconName || 'Zap',
    bulletPoints: Array.isArray(bulletPoints) ? bulletPoints : []
  };

  db.services = [...(db.services || []), newService];
  writeDb(db);
  res.status(201).json({ success: true, service: newService });
});

app.put('/api/services/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { title, shortDesc, fullDesc, iconName, bulletPoints } = req.body;
  const db = readDb();

  db.services = (db.services || []).map((s: ServiceItem) => {
    if (s.id === id) {
      return {
        ...s,
        title: title !== undefined ? title : s.title,
        shortDesc: shortDesc !== undefined ? shortDesc : s.shortDesc,
        fullDesc: fullDesc !== undefined ? fullDesc : s.fullDesc,
        iconName: iconName !== undefined ? iconName : s.iconName,
        bulletPoints: bulletPoints !== undefined ? bulletPoints : s.bulletPoints
      };
    }
    return s;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/services/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.services = (db.services || []).filter((s: ServiceItem) => s.id !== id);
  writeDb(db);
  res.json({ success: true });
});

app.put('/api/services-reorder', verifyAdmin, (req, res) => {
  const { services } = req.body;
  if (!Array.isArray(services)) {
    return res.status(400).json({ error: 'Services list must be an array' });
  }
  const db = readDb();
  db.services = services;
  writeDb(db);
  res.json({ success: true });
});

// FAQs API
app.get('/api/faqs', (_req, res) => {
  const db = readDb();
  res.json({ faqs: db.faqs || initialFAQs });
});

app.post('/api/faqs', verifyAdmin, (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  const db = readDb();
  const newFaq: FAQItem = {
    id: `faq_${Date.now()}`,
    question: String(question).trim(),
    answer: String(answer).trim(),
    category: category || 'General'
  };

  db.faqs = [...(db.faqs || []), newFaq];
  writeDb(db);
  res.status(201).json({ success: true, faq: newFaq });
});

app.put('/api/faqs/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;
  const db = readDb();

  db.faqs = (db.faqs || []).map((f: FAQItem) => {
    if (f.id === id) {
      return {
        ...f,
        question: question !== undefined ? question : f.question,
        answer: answer !== undefined ? answer : f.answer,
        category: category !== undefined ? category : f.category
      };
    }
    return f;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/faqs/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.faqs = (db.faqs || []).filter((f: FAQItem) => f.id !== id);
  writeDb(db);
  res.json({ success: true });
});

app.put('/api/faqs-reorder', verifyAdmin, (req, res) => {
  const { faqs } = req.body;
  if (!Array.isArray(faqs)) {
    return res.status(400).json({ error: 'FAQs list must be an array' });
  }
  const db = readDb();
  db.faqs = faqs;
  writeDb(db);
  res.json({ success: true });
});

// Enquiries
app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, message, preferredContact } = req.body;

  if (!name || (!email && !phone) || !message) {
    return res.status(400).json({ error: 'Please provide name, contact details (email or phone), and message' });
  }

  const db = readDb();
  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim(),
    email: String(email || '').trim(),
    phone: String(phone || '').trim(),
    message: String(message).trim(),
    date: new Date().toISOString(),
    status: 'new',
    preferredContact: preferredContact || 'phone'
  };

  db.enquiries = [newEnquiry, ...(db.enquiries || [])];
  writeDb(db);

  return res.status(201).json({ success: true, message: 'Enquiry submitted successfully', enquiryId: newEnquiry.id });
});

app.get('/api/enquiries', verifyAdmin, (_req, res) => {
  const db = readDb();
  res.json({ enquiries: db.enquiries || [] });
});

app.put('/api/enquiries/:id/status', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();
  
  db.enquiries = (db.enquiries || []).map((e: Enquiry) => {
    if (e.id === id) {
      return { ...e, status };
    }
    return e;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/enquiries/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.enquiries = (db.enquiries || []).filter((e: Enquiry) => e.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Gallery API
app.get('/api/gallery', (_req, res) => {
  const db = readDb();
  res.json({ gallery: db.gallery || initialGallery });
});

app.post('/api/gallery', verifyAdmin, (req, res) => {
  const { title, caption, imageUrl, category } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Title and image URL are required' });
  }

  const db = readDb();
  const newItem: GalleryItem = {
    id: `g_${Date.now()}`,
    title: String(title).trim(),
    caption: String(caption || '').trim(),
    imageUrl: String(imageUrl).trim(),
    category: category || 'Lighting'
  };

  db.gallery = [newItem, ...(db.gallery || [])];
  writeDb(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/gallery/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { title, caption, category, imageUrl } = req.body;
  const db = readDb();

  db.gallery = (db.gallery || []).map((g: GalleryItem) => {
    if (g.id === id) {
      return {
        ...g,
        title: title !== undefined ? title : g.title,
        caption: caption !== undefined ? caption : g.caption,
        category: category !== undefined ? category : g.category,
        imageUrl: imageUrl !== undefined ? imageUrl : g.imageUrl
      };
    }
    return g;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/gallery/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.gallery = (db.gallery || []).filter((g: GalleryItem) => g.id !== id);
  writeDb(db);
  res.json({ success: true });
});

app.put('/api/gallery-reorder', verifyAdmin, (req, res) => {
  const { gallery } = req.body;
  if (!Array.isArray(gallery)) {
    return res.status(400).json({ error: 'Gallery list must be an array' });
  }
  const db = readDb();
  db.gallery = gallery;
  writeDb(db);
  res.json({ success: true });
});

// Blog API
app.get('/api/blog', (_req, res) => {
  const db = readDb();
  res.json({ posts: db.blogPosts || initialBlogPosts });
});

app.get('/api/blog/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const db = readDb();
  const post = (db.blogPosts || initialBlogPosts).find(
    (p: BlogPost) => p.slug === slugOrId || p.id === slugOrId
  );

  if (!post) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json({ post });
});

app.post('/api/blog', verifyAdmin, (req, res) => {
  const { title, summary, content, imageUrl, tags, author, date } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const db = readDb();
  const newPost: BlogPost = {
    id: `b_${Date.now()}`,
    title: String(title).trim(),
    slug: slug || `article-${Date.now()}`,
    summary: String(summary || '').trim(),
    content: String(content).trim(),
    date: date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    author: author || 'Ian Christie',
    imageUrl: imageUrl || '/images/photo_1.jpg',
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Electrical Advice'],
    published: true
  };

  db.blogPosts = [newPost, ...(db.blogPosts || [])];
  writeDb(db);
  res.status(201).json({ success: true, post: newPost });
});

app.put('/api/blog/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { title, summary, content, imageUrl, tags, author, date, published } = req.body;
  const db = readDb();

  db.blogPosts = (db.blogPosts || []).map((p: BlogPost) => {
    if (p.id === id) {
      const updatedTitle = title !== undefined ? title : p.title;
      const slug = String(updatedTitle)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return {
        ...p,
        title: updatedTitle,
        slug,
        summary: summary !== undefined ? summary : p.summary,
        content: content !== undefined ? content : p.content,
        imageUrl: imageUrl !== undefined ? imageUrl : p.imageUrl,
        tags: Array.isArray(tags) ? tags : p.tags,
        author: author !== undefined ? author : p.author,
        date: date !== undefined ? date : p.date,
        published: published !== undefined ? published : p.published
      };
    }
    return p;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/blog/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.blogPosts = (db.blogPosts || []).filter((p: BlogPost) => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Reviews API
app.get('/api/reviews', (_req, res) => {
  const db = readDb();
  res.json({
    googleMapsUrl: (db.businessInfo && db.businessInfo.googleMapsUrl) || initialBusinessInfo.googleMapsUrl,
    rating: 5.0,
    reviewsCount: (db.reviews || initialReviews).length,
    verified: true,
    reviews: db.reviews || initialReviews
  });
});

app.post('/api/reviews', verifyAdmin, (req, res) => {
  const { authorName, rating, relativeTime, text, source, googleProfileUrl } = req.body;
  if (!authorName || !text) {
    return res.status(400).json({ error: 'Author name and review text are required' });
  }

  const db = readDb();
  const newRev: Review = {
    id: `rev_${Date.now()}`,
    authorName: String(authorName).trim(),
    rating: Number(rating) || 5,
    relativeTime: String(relativeTime || 'Verified Customer').trim(),
    text: String(text).trim(),
    source: source === 'direct' ? 'direct' : 'google',
    googleProfileUrl: googleProfileUrl || db.businessInfo?.googleMapsUrl || initialBusinessInfo.googleMapsUrl
  };

  db.reviews = [newRev, ...(db.reviews || [])];
  writeDb(db);
  res.status(201).json({ success: true, review: newRev });
});

app.put('/api/reviews/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { authorName, rating, relativeTime, text, source, googleProfileUrl } = req.body;
  const db = readDb();

  db.reviews = (db.reviews || []).map((r: Review) => {
    if (r.id === id) {
      return {
        ...r,
        authorName: authorName !== undefined ? authorName : r.authorName,
        rating: rating !== undefined ? Number(rating) : r.rating,
        relativeTime: relativeTime !== undefined ? relativeTime : r.relativeTime,
        text: text !== undefined ? text : r.text,
        source: source !== undefined ? source : r.source,
        googleProfileUrl: googleProfileUrl !== undefined ? googleProfileUrl : r.googleProfileUrl
      };
    }
    return r;
  });

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/reviews/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.reviews = (db.reviews || []).filter((r: Review) => r.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Delete media endpoint (filename param). Supports Supabase Storage and local uploads
app.delete('/api/media/:filename', verifyAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) return res.status(400).json({ error: 'Filename required' });

    let removedFromStorage = false;
    let removedFromLocal = false;

    // If Supabase configured, try delete from storage first (prefer service client)
    if (process.env.SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      try {
        const storageClient: any = serviceSupabase || supabase;
        const { error } = await storageClient.storage.from(SUPABASE_BUCKET).remove([filename]);
        if (!error) {
          removedFromStorage = true;
        } else {
          console.warn('Supabase remove error:', error.message);
        }
      } catch (err) {
        console.error('Supabase remove failed:', err);
      }
    }

    // Always attempt local deletion as well (cleanup fallback files)
    try {
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        removedFromLocal = true;
      }
    } catch (err) {
      console.error('Local file delete failed:', err);
    }

    if (removedFromStorage || removedFromLocal) {
      return res.json({ success: true, message: `Removed storage=${removedFromStorage}, local=${removedFromLocal}` });
    }

    return res.status(404).json({ error: 'File not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Media & Uploads API
// Upload to Supabase Storage (with local fallback)
app.post('/api/upload', verifyAdmin, async (req, res) => {
  try {
    const { filename, fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'Image fileData is required' });
    }

    // Sanitize filename
    const originalName = filename ? path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_') : 'uploaded_image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const base = path.basename(originalName, ext);
    const safeName = `${base}_${Date.now()}${ext}`;

    // Strip base64 metadata prefix if present
    const base64Data = String(fileData).replace(/^data:image\/\w+;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Try Supabase Storage first (prefer service client)
    if (process.env.SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      try {
        const storageClient: any = serviceSupabase || supabase;
        const uploadRes: any = await storageClient.storage.from(SUPABASE_BUCKET).upload(safeName, buffer, { contentType: 'image/*' });
        if (!uploadRes.error) {
          const { data: urlData } = storageClient.storage.from(SUPABASE_BUCKET).getPublicUrl(safeName);
          const publicUrl = urlData?.publicUrl || '';
          return res.status(201).json({ success: true, url: publicUrl, filename: safeName, originalName, size: buffer.length });
        }
        console.warn('Supabase upload error:', uploadRes.error?.message || uploadRes.error);
      } catch (err) {
        console.error('Supabase upload failed, falling back to local storage:', err);
      }
    }

    // Fallback: local filesystem
    const uploadsDir = UPLOADS_DIR;
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const targetPath = path.join(uploadsDir, safeName);
    fs.writeFileSync(targetPath, buffer);
    const publicUrl = `/uploads/${safeName}`;
    return res.status(201).json({ success: true, url: publicUrl, filename: safeName, originalName, size: buffer.length });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// List available media files
app.get('/api/media', verifyAdmin, async (_req, res) => {
  try {
    const uploadsDir = UPLOADS_DIR;
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    const files: { name: string; url: string; size: number; modified: string }[] = [];

    // Supabase Storage listing (prefer service client)
    if (process.env.SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      try {
        const storageClient: any = serviceSupabase || supabase;
        const listRes: any = await storageClient.storage.from(SUPABASE_BUCKET).list('', { limit: 1000 });
        if (!listRes.error && Array.isArray(listRes.data)) {
          for (const item of listRes.data) {
            if (item.name && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name)) {
              const { data: urlData } = storageClient.storage.from(SUPABASE_BUCKET).getPublicUrl(item.name);
              files.push({ name: item.name, url: urlData?.publicUrl || '', size: item.size || 0, modified: item.updated_at || '' });
            }
          }
        }
      } catch (err) {
        console.error('Failed to list Supabase storage objects:', err);
      }
    }

    // Local uploads fallback
    if (fs.existsSync(uploadsDir)) {
      const localFiles = fs.readdirSync(uploadsDir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
      for (const f of localFiles) {
        try {
          const stat = fs.statSync(path.join(uploadsDir, f));
          files.push({ name: f, url: `/uploads/${f}`, size: stat.size || 0, modified: stat.mtime.toISOString() });
        } catch {}
      }
    }

    // Stock images
    const stock: string[] = fs.existsSync(imagesDir)
      ? fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)).map(f => `/images/${f}`)
      : [];

    return res.json({ files, uploads: files.map(f => f.url), stock });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// START SERVER / VITE INTEGRATION
async function startServer() {
  // If Supabase is configured, preload the DB into memory so handlers have
  // synchronous access to `dbCache` and don't accidentally operate on a
  // pending Promise. This prefers the service client via loadDbFromSupabase().
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    try {
      await loadDbFromSupabase();
    } catch (err) {
      console.error('Failed to preload DB from Supabase at startup:', err);
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ian Christie Electrical] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
