import { useState } from 'react';
import { BlogPost } from '../types';
import SEOHead from '../components/SEOHead';
import { Calendar, User, ArrowLeft, ArrowUpRight, Tag, BookOpen } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  );

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Electrical Advice & Insights | Ian Christie Electrical Dublin"
        description="Electrical advice, consumer unit guidelines, safety tips, and lighting guides for Dublin homeowners and local business owners."
        pagePath="/blog"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {selectedPost ? (
          /* ARTICLE READING MODE */
          <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            {/* Article Header */}
            <div className="space-y-4 border-b border-slate-800 pb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {selectedPost.author}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {selectedPost.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
                {selectedPost.summary}
              </p>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-400 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Main Featured Image */}
            <div className="relative aspect-video w-full overflow-hidden border border-slate-800">
              <img
                src={resolveImageUrl(selectedPost.imageUrl)}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Article Content */}
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 border-b border-slate-800 pb-12">
              {selectedPost.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-lg sm:text-xl font-black uppercase text-amber-400 tracking-wide pt-4 border-t border-slate-800/60 mt-6">
                      {trimmed.replace(/^###\s*/, '')}
                    </h3>
                  );
                }

                return (
                  <p key={pIdx} className="text-slate-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Article Footer CTA */}
            <div className="bg-slate-900 border border-slate-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-black uppercase text-white tracking-wider">Need Electrical Advice in Dublin?</h3>
                <p className="text-xs text-slate-400">Contact Ian directly for quotes or technical queries.</p>
              </div>

              <a
                href="tel:+353862525331"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                Call +353 86 252 5331
              </a>
            </div>
          </article>
        ) : (
          /* ARTICLES LISTING MODE */
          <div className="space-y-12">
            {/* Header Title */}
            <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block">
                  ELECTRICAL INSIGHTS & ADVICE
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                  ARTICLES & GUIDES
                </h1>
              </div>

              {/* Tag Filters */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                      selectedTag === null
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    All Topics
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid of Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-slate-950 border border-slate-800 hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={resolveImageUrl(post.imageUrl)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest backdrop-blur-sm">
                        {post.tags?.[0] || 'Advice'}
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{post.date}</span>
                      </div>

                      <h2 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-900 mt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:underline flex items-center gap-1">
                      <span>Read Article</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
