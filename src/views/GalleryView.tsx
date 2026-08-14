import { useState } from 'react';
import { GalleryItem } from '../types';
import SEOHead from '../components/SEOHead';
import { ZoomIn, MapPin } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

interface GalleryViewProps {
  gallery: GalleryItem[];
  onOpenLightbox: (index: number) => void;
}

export default function GalleryView({ gallery, onOpenLightbox }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <SEOHead
        title="Electrical Work Gallery | Ian Christie Electrical Dublin"
        description="Photos of consumer unit upgrades, kitchen LED lighting, socket replacements, and commercial electrical installations in Dublin."
        pagePath="/gallery"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
              REAL DUBLIN PROJECTS
            </span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
              WORK GALLERY
            </h1>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const indexInFullList = gallery.findIndex((g) => g.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(indexInFullList !== -1 ? indexInFullList : 0)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-amber-400 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Real Photo Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-amber-400 text-slate-950 flex items-center gap-2 font-bold text-xs uppercase tracking-wider shadow-xl">
                      <ZoomIn className="w-4 h-4" />
                      <span>Enlarge Photo</span>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    {item.category}
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-5 space-y-1.5 bg-slate-950 border-t border-slate-800/80">
                  <h3 className="font-bold text-white text-base uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.caption}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Dublin, Ireland</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
