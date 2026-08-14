import { BusinessInfo, ServiceItem, GalleryItem, FAQItem, BlogPost, Review, SitePageContent } from '../types';

export const initialBusinessInfo: BusinessInfo = {
  name: "Ian Christie Electrical",
  phone: "+353 86 252 5331",
  formattedPhone: "+353 86 252 5331",
  email: "Ianc4000@gmail.com",
  whatsapp: "+353 86 252 5331",
  whatsappFormatted: "+353862525331",
  googleMapsUrl: "https://www.google.com/maps/place/Ian+Christie+Electrical/@53.3599877,-6.1968889,17z/data=!3m1!4b1!4m6!3m5!1s0x48670fa0aadf3df7:0x73a46927600012cb!8m2!3d53.3599845!4d-6.1943086!16s%2Fg%2F1tptq0h5",
  address: "Dublin, Ireland",
  openingHours: "Monday - Friday: 08:00 - 18:00 | Saturday: 09:00 - 16:00 | Sunday: Emergency On-Call",
  areasCovered: [
    "Dublin City Centre",
    "Clontarf & Fairview",
    "Drumcondra & Glasnevin",
    "Raheny & Killester",
    "Howth & Sutton",
    "Malahide & Portmarnock",
    "Swords & North County Dublin",
    "South Dublin & Surrounds"
  ]
};

export const initialSiteContent: SitePageContent = {
  header: {
    brandTitle: "IAN CHRISTIE",
    brandSubtitle: "ELECTRICAL",
    ctaButtonText: "Get a Quote"
  },
  hero: {
    ratingScore: "4.8",
    ratingLabel: "100+ Reviews",
    titleLine1: "POWER",
    titleLine2: "EXPERIENCE",
    titleLine3: "RELIABILITY",
    heroImage: "/images/photo_1.jpg",
    introText: "IAN CHRISTIE ELECTRICAL — BESPOKE DOMESTIC & COMMERCIAL INSTALLATIONS ACROSS DUBLIN.",
    ctaButtonText: "Get a Quote",
    ctaTarget: "contact"
  },
  servicesSection: {
    badge: "CAPABILITIES",
    title: "SERVICES",
    subtitle: "Complete domestic and commercial electrical solutions across Dublin"
  },
  gallerySection: {
    badge: "PORTFOLIO",
    title: "WORK GALLERY",
    subtitle: "Recent electrical installations, lighting setups, and residential upgrades"
  },
  reviewsSection: {
    badge: "CLIENT REVIEWS",
    title: "TESTIMONIALS",
    subtitle: "Verified reviews from Dublin homeowners & commercial clients"
  },
  blogSection: {
    badge: "INSIGHTS & ADVICE",
    title: "BLOG",
    subtitle: "Practical advice, safety insights, and trade experience from Dublin electrician Ian Christie."
  },
  faqSection: {
    badge: "HELP",
    title: "FAQ",
    subtitle: "Common questions about electrical installations, repairs, and quotes"
  },
  contactSection: {
    badge: "CONTACT",
    title: "GET A QUOTE",
    subtitle: "DIRECT CONTACT",
    submitButtonText: "Send Enquiry",
    successTitle: "Message Sent",
    successText: "Thank you. Ian will review your job details and get back to you promptly."
  },
  footer: {
    tagline: "Professional domestic and commercial electrical contractor serving Dublin. Safe installations, clear communication, and high-quality craftsmanship.",
    areasServedText: "Serving all Dublin areas including Clontarf, Fairview, Drumcondra, Raheny, Malahide, Howth, Swords, and Dublin City Centre.",
    copyrightText: "Ian Christie Electrical. All rights reserved."
  }
};


export const initialServices: ServiceItem[] = [
  {
    id: "installations",
    title: "Electrical Installations",
    shortDesc: "Complete domestic and light commercial wiring, rewires, extensions, and new electrical circuits.",
    fullDesc: "Whether you are renovating a room, adding an extension, or updating an existing installation, Ian Christie Electrical provides safe, reliable electrical wiring built to current safety standards.",
    iconName: "Zap",
    bulletPoints: [
      "House & apartment rewires",
      "Home extension wiring",
      "New circuit additions",
      "Safety testing & earthing"
    ]
  },
  {
    id: "lighting",
    title: "Lighting Solutions",
    shortDesc: "Indoor LED spotlights, kitchen task lights, track lighting, pendant fittings, and shop display lights.",
    fullDesc: "Professional lighting installation for homes and local retail businesses across Dublin. Enhance room ambience, save energy with modern LEDs, and illuminate task areas cleanly.",
    iconName: "Lightbulb",
    bulletPoints: [
      "Under-cabinet kitchen LED lighting",
      "Pendant & decorative light fittings",
      "Wire track spotlighting systems",
      "Retail & commercial shopfront lighting"
    ]
  },
  {
    id: "fault-finding",
    title: "Fault Finding & Repairs",
    shortDesc: "Rapid diagnosis and repair for tripping breakers, faulty switches, dead sockets, and flickering lights.",
    fullDesc: "Electrical issues can cause inconvenience and potential safety hazards. Ian uses systematic testing to identify circuit faults quickly and carry out safe, lasting repairs.",
    iconName: "SearchCheck",
    bulletPoints: [
      "Tripping circuit breakers",
      "Intermittent light flickering",
      "Dead power outlets",
      "Short circuit diagnosis"
    ]
  },
  {
    id: "sockets-switches",
    title: "Sockets & Switches",
    shortDesc: "Fitting extra wall sockets, USB charging sockets, dimmer switches, and dedicated cooker or shower points.",
    fullDesc: "Eliminate messy extension leads by installing double sockets right where you need them. Upgrade old switches to modern, sleek metal or clean white finishes with USB power ports.",
    iconName: "Plug",
    bulletPoints: [
      "USB & USB-C wall socket upgrades",
      "Additional socket outlets",
      "Dimmer switch installations",
      "Cooker & appliance connections"
    ]
  },
  {
    id: "consumer-units",
    title: "Consumer Units / Fuse Boxes",
    shortDesc: "Replacing outdated fuse boards with modern consumer units featuring RCD circuit breaker protection.",
    fullDesc: "An upgraded consumer unit is the heart of home electrical safety. Modern units cut off power instantly in case of an electrical fault, protecting your family and property.",
    iconName: "ShieldAlert",
    bulletPoints: [
      "Fuse board safety upgrades",
      "RCD circuit protection",
      "Miniature Circuit Breaker (MCB) replacement",
      "Earthing & bonding verification"
    ]
  },
  {
    id: "domestic-work",
    title: "Domestic Electrical Work",
    shortDesc: "General home electrical maintenance, shower connections, garden power, and small home improvements.",
    fullDesc: "No job is too small. From replacing a single broken light switch to wiring outdoor garden power, Ian provides friendly, local, tidy service you can rely on.",
    iconName: "Home",
    bulletPoints: [
      "Electric shower power wiring",
      "Outdoor & garden sockets",
      "Smoke alarm replacements",
      "General electrical fixes"
    ]
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Electrical Installation & Circuit Wiring",
    caption: "Professional domestic electrical wiring and circuit installation carried out safely to standard.",
    imageUrl: "/images/photo_1.jpg",
    category: "Wiring & Circuits"
  },
  {
    id: "g2",
    title: "Domestic Electrical Wiring",
    caption: "Full residential wiring upgrade and modern circuit management.",
    imageUrl: "/images/photo_2.jpg",
    category: "Wiring & Circuits"
  },
  {
    id: "g3",
    title: "Track & Pendant Ceiling Lighting",
    caption: "Ceiling wire track spotlighting and industrial pendant lights installed in a living area.",
    imageUrl: "/images/photo_3.jpg",
    category: "Lighting"
  },
  {
    id: "g4",
    title: "Kitchen Electrical Work",
    caption: "Bespoke kitchen electrical wiring, counter sockets, and appliances lighting setup.",
    imageUrl: "/images/photo_4.jpg",
    category: "Kitchens"
  },
  {
    id: "g5",
    title: "Integrated USB Wall Sockets",
    caption: "Clean white double switched wall socket with dual USB charging ports installed.",
    imageUrl: "/images/photo_5.jpg",
    category: "Sockets & Wiring"
  },
  {
    id: "g6",
    title: "Weatherproof Junction Box Wiring",
    caption: "Precision terminal wiring inside an insulated IP65 junction box for safe circuit distribution.",
    imageUrl: "/images/photo_6.jpg",
    category: "Sockets & Wiring"
  },
  {
    id: "g7",
    title: "Florist & Retail Shop Lighting",
    caption: "Bespoke ceiling spotlighting and warm decorative Edison lights for a Dublin florist shop.",
    imageUrl: "/images/photo_7.jpg",
    category: "Commercial"
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: "f1",
    question: "How can I request a quote for electrical work?",
    answer: "You can request a quote by filling in the enquiry form at the bottom of this page, calling Ian directly, or sending a quick message with details via WhatsApp.",
    category: "General"
  },
  {
    id: "f2",
    question: "Can I send photos of the work I need via WhatsApp?",
    answer: "Yes, sending photos or a short video clip of your current fuse board, light fitting, or socket via WhatsApp helps assess the scope and provide a prompt estimate.",
    category: "Quotes"
  },
  {
    id: "f3",
    question: "What areas in Dublin do you serve?",
    answer: "Ian Christie Electrical serves residential and commercial clients across Dublin City and surrounding areas, including Clontarf, Fairview, Drumcondra, Raheny, Howth, Malahide, Swords, and South Dublin.",
    category: "Service Areas"
  },
  {
    id: "f4",
    question: "What should I do if my circuit breaker keeps tripping?",
    answer: "If a switch trips repeatedly, unplug appliances connected to that circuit to see if a faulty device is responsible. If it continues tripping with everything unplugged, leave the breaker off and contact Ian to inspect the fault safely.",
    category: "Troubleshooting"
  },
  {
    id: "f5",
    question: "Do you handle both small jobs and larger installations?",
    answer: "Whether you need a single socket replaced, additional kitchen lighting installed, a new consumer unit, or a complete rewire, all jobs receive the same careful, professional attention.",
    category: "General"
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "immersion-problems",
    title: "Immersion Problems – My Experience",
    slug: "immersion-problems-my-experience",
    summary: "In my 30–40 years as an electrician, I have come across a huge number of problems with immersion heaters, elements, thermostats and switches. A few problems come up time and time again.",
    content: `In my 30–40 years as an electrician, I have come across a huge number of problems with immersion heaters, elements, thermostats and switches. A few problems come up time and time again.

### Thermostats and overheat cut-outs

One of the most common problems is the overheat cut-out on the thermostat tripping. This is often caused by the thermostat itself failing and allowing the water to become too hot. The overheat cut-out then operates as a safety measure.

In this situation, I would normally replace the thermostat rather than simply resetting the cut-out.

### Immersion elements tripping the RCD

Another common problem is an immersion element causing the RCD to trip. Usually the element will need to be replaced.

However, replacing an element in an old cylinder can be tricky. Removing a very old element can sometimes damage or distort the cylinder, preventing the new element from sealing properly. In the worst case, the cylinder may need to be replaced.

### Immersion switches

Older immersion switches can also burn out, particularly the contacts inside the switch. In most cases, replacing the switch solves the problem.

I also come across older installations where the immersion circuit doesn't have appropriate RCD protection. Where I find this, I recommend upgrading the installation to meet the appropriate current safety requirements.

### 260 immersion elements!

One of my first electrical contracts was in Darndale, where I was involved in changing 260 immersion elements while the estate was being redesigned.

So after 30–40 years of working on immersions, I would say I have gained quite a bit of experience with immersion elements, thermostats, switches and the problems that can arise from them.

### Wi-Fi immersion switches

A more recent development is the Wi-Fi immersion switch. These allow you to control your immersion from your phone, including setting timers and using a boost function.

You don't even have to be at home. You could switch the immersion on while you're at work so you have hot water when you get home, or even control it while you're abroad.

Immersions are relatively simple, but they involve electricity, water and a high-power heating element, so problems should always be properly investigated rather than simply resetting a tripped safety device.

If your immersion is not heating, constantly tripping, cutting out or burning the switch, I can inspect it and advise on the most appropriate solution.`,
    date: "August 2026",
    author: "Ian Christie",
    imageUrl: "/images/photo_1.jpg",
    tags: ["Immersion Heaters", "Troubleshooting", "Electrical Safety", "Domestic"],
    published: true
  }
];

export const initialReviews: Review[] = [
  {
    id: "r1",
    authorName: "Gail Firth",
    rating: 5,
    relativeTime: "Verified Google Customer",
    text: "I had an emergency electrical situation I needed handled on Easter Monday and Ian was able to come out within an hour of my call and he did the job perfectly for a great price. He was a very nice man and very professional. I highly recommend him!",
    source: "google",
    googleProfileUrl: "https://www.google.com/maps/place/Ian+Christie+Electrical/@53.3599877,-6.1968889,17z/data=!3m1!4b1!4m6!3m5!1s0x48670fa0aadf3df7:0x73a46927600012cb!8m2!3d53.3599845!4d-6.1943086!16s%2Fg%2F1tptq0h5"
  }
];
