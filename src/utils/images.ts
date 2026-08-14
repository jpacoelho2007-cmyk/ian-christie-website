import photo1 from '../assets/images/photo_1.jpg';
import photo2 from '../assets/images/photo_2.jpg';
import photo3 from '../assets/images/photo_3.jpg';
import photo4 from '../assets/images/photo_4.jpg';
import photo5 from '../assets/images/photo_5.jpg';
import photo6 from '../assets/images/photo_6.jpg';
import photo7 from '../assets/images/photo_7.jpg';

export const imageAssets = {
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  hero: photo1,
  kitchen: photo4,
  lighting: photo3,
  socket: photo5,
  junctionBox: photo6,
  floristShop: photo7,
};

const ibbMap: Record<string, string> = {
  'https://ibb.co/x8GxNGpt': photo1,
  'https://ibb.co/Y79N1t8R': photo3,
  'https://ibb.co/Q3Bbdjdc': photo4,
  'https://ibb.co/cXXMwBpB': photo5,
  'https://ibb.co/C5Yk9qKT': photo6,
  'https://ibb.co/4ZsYQ70X': photo7,
};

export function resolveImageUrl(url: string | undefined): string {
  if (!url) return photo1;
  
  // Data URLs, blobs, or direct uploads
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) return url.startsWith('/') ? url : `/${url}`;

  if (ibbMap[url]) return ibbMap[url];

  if (url === '/images/photo_1.jpg' || url === 'photo_1.jpg') return photo1;
  if (url === '/images/photo_2.jpg' || url === 'photo_2.jpg') return photo2;
  if (url === '/images/photo_3.jpg' || url === 'photo_3.jpg') return photo3;
  if (url === '/images/photo_4.jpg' || url === 'photo_4.jpg') return photo4;
  if (url === '/images/photo_5.jpg' || url === 'photo_5.jpg') return photo5;
  if (url === '/images/photo_6.jpg' || url === 'photo_6.jpg') return photo6;
  if (url === '/images/photo_7.jpg' || url === 'photo_7.jpg') return photo7;

  // Legacy mappings fallback
  if (url === '/images/kitchen.jpg') return photo4;
  if (url === '/images/lighting.jpg') return photo3;
  if (url === '/images/hero.jpg') return photo1;
  if (url === '/images/socket.jpg') return photo5;
  if (url === '/images/junction_box.jpg') return photo6;
  if (url === '/images/florist_shop.jpg') return photo7;

  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // If it's another image file in /images/ or /uploads/
  if (url.startsWith('/images/')) return url;

  const lower = url.toLowerCase();
  if (lower.includes('photo_1') || lower.includes('hero')) return photo1;
  if (lower.includes('photo_2')) return photo2;
  if (lower.includes('photo_3') || lower.includes('lighting')) return photo3;
  if (lower.includes('photo_4') || lower.includes('kitchen')) return photo4;
  if (lower.includes('photo_5') || lower.includes('socket')) return photo5;
  if (lower.includes('photo_6') || lower.includes('junction')) return photo6;
  if (lower.includes('photo_7') || lower.includes('florist')) return photo7;

  return url;
}
