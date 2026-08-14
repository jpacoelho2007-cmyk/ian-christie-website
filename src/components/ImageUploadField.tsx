import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { resolveImageUrl } from '../utils/images';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  token?: string | null;
  placeholder?: string;
  helpText?: string;
  className?: string;
  darkTheme?: boolean;
}

const STOCK_PRESETS = [
  { name: 'Photo 1 (Hero/Immersion)', path: '/images/photo_1.jpg' },
  { name: 'Photo 2 (Consumer Unit/Sockets)', path: '/images/photo_2.jpg' },
  { name: 'Photo 3 (Lighting Installation)', path: '/images/photo_3.jpg' },
  { name: 'Photo 4 (Kitchen Electrical)', path: '/images/photo_4.jpg' },
  { name: 'Photo 5 (Socket & Switch)', path: '/images/photo_5.jpg' },
  { name: 'Photo 6 (Junction Box)', path: '/images/photo_6.jpg' },
  { name: 'Photo 7 (Florist Commercial Lighting)', path: '/images/photo_7.jpg' }
];

export default function ImageUploadField({
  label,
  value,
  onChange,
  token,
  placeholder = 'e.g. /images/photo_1.jpg or upload from computer',
  helpText = 'Select an image file from your computer or enter an image URL.',
  className = '',
  darkTheme = false
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(true);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // 1. Read as Base64 Data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;

      // Optimistically set the image
      onChange(base64Data);

      // 2. Upload to server if token exists
      const authToken = token || localStorage.getItem('ian_admin_token');
      if (authToken) {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-auth': authToken
          },
          body: JSON.stringify({
            filename: file.name,
            fileData: base64Data
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            onChange(data.url);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
          }
        } else {
          // If server upload failed, we still have the base64 preview preserved
          console.warn('Server storage failed, keeping base64 format');
        }
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError(err.message || 'Failed to process image file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const resolvedSrc = resolveImageUrl(value);

  const containerBg = darkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200';
  const labelColor = darkTheme ? 'text-slate-200' : 'text-slate-700';
  const inputBg = darkTheme ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className={`block text-xs font-bold uppercase tracking-wider ${labelColor}`}>
          {label}
        </label>
        {helpText && (
          <span className="text-[11px] text-slate-400 font-mono">
            Direct upload or URL
          </span>
        )}
      </div>

      {/* Upload Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </>
          )}
        </button>

        {/* Quick Presets Toggle */}
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer shrink-0 ${
            showPresets
              ? 'bg-slate-800 text-amber-400 border-amber-500/50'
              : darkTheme
                ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
          title="Pick from existing stock photos"
        >
          <Layers className="w-4 h-4" />
          <span>Library</span>
        </button>

        {/* Image URL / Path Fallback input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setUploadError(null);
            }}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors ${inputBg}`}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Clear image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stock Presets Dropdown */}
      {showPresets && (
        <div className={`p-3 rounded-2xl border ${darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'} space-y-2 animate-in fade-in duration-150`}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800/40">
            <span>Select Bundled Stock Photo</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STOCK_PRESETS.map((preset) => (
              <button
                key={preset.path}
                type="button"
                onClick={() => {
                  onChange(preset.path);
                  setShowPresets(false);
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  value === preset.path
                    ? 'border-amber-500 bg-amber-500/10'
                    : darkTheme
                      ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <img
                  src={resolveImageUrl(preset.path)}
                  alt={preset.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700/40"
                />
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-slate-200 truncate">{preset.name.split(' ')[0]} {preset.name.split(' ')[1]}</div>
                  <div className="text-[9px] text-slate-500 truncate font-mono">{preset.path}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop / Preview Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 ${containerBg} ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700/60 hover:border-slate-600'
        }`}
      >
        {value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Box */}
            <div className="relative aspect-[16/10] w-full sm:w-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 shadow-inner group">
              <img
                src={resolvedSrc}
                alt="Image Preview"
                onLoad={() => setPreviewLoaded(true)}
                onError={() => setPreviewLoaded(false)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {!previewLoaded && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-2 text-center text-xs">
                  <AlertCircle className="w-5 h-5 text-amber-400 mb-1" />
                  <span>Preview unavailable</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 text-xs font-bold"
                  title="Replace"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 space-y-2 text-center sm:text-left overflow-hidden w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  <Check className="w-3 h-3" />
                  Active Image
                </span>
                {value.startsWith('data:') && (
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono">
                    Local Upload
                  </span>
                )}
                {value.startsWith('/uploads/') && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                    Server Stored
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400 truncate max-w-full" title={value}>
                {value.length > 50 ? `${value.substring(0, 50)}...` : value}
              </div>

              <p className="text-[11px] text-slate-500">
                Drag a new image here or click &quot;Upload Image&quot; to change.
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-6 text-center cursor-pointer space-y-2"
          >
            <div className="p-3 bg-slate-800/80 rounded-2xl text-amber-400 shadow-sm">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className={`text-xs font-bold ${darkTheme ? 'text-slate-200' : 'text-slate-800'}`}>
                Click to upload or drag and drop image here
              </div>
              <div className="text-[11px] text-slate-400">
                Supports JPG, PNG, WebP, GIF
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {uploadSuccess && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl font-mono animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>Image uploaded and stored successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl font-mono animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
