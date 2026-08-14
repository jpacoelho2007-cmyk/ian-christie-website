import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';
import { resolveImageUrl } from '../utils/images';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  items,
  currentIndex,
  onClose,
  onNavigate
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const current = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2.5 py-1 rounded-md">
              {current.category}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative flex items-center justify-center bg-black min-h-[350px] max-h-[70vh] overflow-hidden">
          <img
            src={resolveImageUrl(current.imageUrl)}
            alt={current.title}
            className="max-h-[70vh] max-w-full object-contain mx-auto"
          />

          {/* Navigation Controls */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
                className="absolute left-4 p-3 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700 transition-all cursor-pointer shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate((currentIndex + 1) % items.length)}
                className="absolute right-4 p-3 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full border border-slate-700 transition-all cursor-pointer shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Modal Caption */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-300">{current.caption}</p>
          <span className="text-xs text-slate-500 shrink-0">
            Image {currentIndex + 1} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
