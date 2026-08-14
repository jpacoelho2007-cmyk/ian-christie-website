import { Star, ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import { BusinessInfo, Review } from '../types';
import SEOHead from '../components/SEOHead';
import ReviewsCarousel from '../components/ReviewsCarousel';

interface ReviewsViewProps {
  businessInfo: BusinessInfo;
  reviews: Review[];
}

export default function ReviewsView({ businessInfo, reviews }: ReviewsViewProps) {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEOHead
        title="Google Reviews | Ian Christie Electrical Dublin"
        description="Read authentic Google customer feedback for Ian Christie Electrical. Professional electrician serving Clontarf, Fairview, Malahide, and Dublin City."
        pagePath="/reviews"
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-8 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
            CLIENT FEEDBACK
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            REVIEWS & RATINGS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Real feedback from Dublin homeowners and local business owners. All reviews are linked directly to our official Google Maps profile for 100% transparency.
          </p>
        </div>

        {/* Verified Rating Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Google Maps Listing</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
              Ian Christie Electrical
            </h2>

            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
              <span className="text-white font-mono font-bold text-lg ml-2">5.0 / 5.0</span>
            </div>

            <p className="text-slate-400 text-xs flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Clontarf, Fairview & Dublin City, Ireland</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a
              href={businessInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Google Maps Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Reviews Carousel */}
        <ReviewsCarousel reviews={reviews} businessInfo={businessInfo} />
      </div>
    </div>
  );
}
