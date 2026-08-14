import { useState, useRef, TouchEvent } from 'react';
import { Star, ChevronLeft, ChevronRight, ExternalLink, Quote } from 'lucide-react';
import { Review, BusinessInfo } from '../types';

interface ReviewsCarouselProps {
  reviews: Review[];
  businessInfo: BusinessInfo;
}

export default function ReviewsCarousel({ reviews, businessInfo }: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            CLIENT FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
            REVIEWS
          </h2>
        </div>

        {/* Carousel Navigation Buttons if multiple reviews */}
        {reviews.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-3 bg-slate-900 border border-slate-800 text-white hover:border-amber-400 hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-2">
              0{currentIndex + 1} / 0{reviews.length}
            </span>
            <button
              onClick={nextSlide}
              className="p-3 bg-slate-900 border border-slate-800 text-white hover:border-amber-400 hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Touch-swipeable Slider Area */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full shrink-0"
            >
              <div className="bg-slate-900/90 border border-slate-800 p-8 sm:p-12 space-y-6 relative">
                <Quote className="absolute top-6 right-8 w-14 h-14 text-slate-800/40 pointer-events-none" />

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-mono font-bold text-slate-400">5.0</span>
                </div>

                {/* Review Body */}
                <p className="text-slate-100 text-lg sm:text-2xl font-medium leading-relaxed italic max-w-4xl">
                  "{review.text}"
                </p>

                {/* Reviewer Name */}
                <div className="pt-4 border-t border-slate-800/80">
                  <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-widest">
                    {review.authorName}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Maps Link Button Underneath */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {reviews.length > 1 ? (
          <div className="flex items-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        ) : <div />}

        <a
          href={businessInfo.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <span>View on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </a>
      </div>
    </div>
  );
}
