import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  pagePath?: string;
  schemaType?: 'LocalBusiness' | 'FAQ' | 'Article';
  schemaData?: any;
}

export default function SEOHead({
  title = "Ian Christie Electrical | Professional Electrician in Dublin",
  description = "Ian Christie Electrical provides professional electrical services in Dublin, Ireland. Specialising in electrical installations, lighting, fault finding, fuse board upgrades, and domestic repairs.",
  pagePath = "/",
  schemaType = 'LocalBusiness',
  schemaData
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // Dynamic JSON-LD Structured Data Injection
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';

    let jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "Electrician",
      "name": "Ian Christie Electrical",
      "image": "/images/hero.jpg",
      "telephone": "+353862525331",
      "email": "Ianc4000@gmail.com",
      "url": window.location.origin + pagePath,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dublin",
        "addressCountry": "IE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 53.3599845,
        "longitude": -6.1943086
      },
      "hasMap": "https://www.google.com/maps/place/Ian+Christie+Electrical/@53.3599877,-6.1968889,17z/data=!3m1!4b1!4m6!3m5!1s0x48670fa0aadf3df7:0x73a46927600012cb!8m2!3d53.3599845!4d-6.1943086!16s%2Fg%2F1tptq0h5",
      "areaServed": ["Dublin", "Clontarf", "Fairview", "Raheny", "Howth", "Malahide", "Drumcondra", "County Dublin"],
      "priceRange": "€€"
    };

    if (schemaType === 'FAQ' && schemaData) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": schemaData.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    } else if (schemaType === 'Article' && schemaData) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": schemaData.title,
        "description": schemaData.summary,
        "image": schemaData.imageUrl,
        "author": {
          "@type": "Person",
          "name": schemaData.author || "Ian Christie"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Ian Christie Electrical",
          "logo": {
            "@type": "ImageObject",
            "url": "/images/hero.jpg"
          }
        },
        "datePublished": schemaData.date
      };
    }

    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [title, description, pagePath, schemaType, schemaData]);

  return null;
}
