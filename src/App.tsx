import React, { useState, useEffect, useMemo } from 'react';
import {
  FileLock2,
  AudioWaveform,
  Zap,
  ExternalLink,
  Search,
  CheckCircle2,
  Copy,
  Terminal,
  Play,
  Pause,
  Sliders,
  Shield,
  Activity,
  Globe,
  Radio,
  Cpu,
  Lock,
  Sparkles,
  Layers,
  ArrowUpRight,
  Maximize2,
  X,
  RefreshCw,
  FileCheck,
  Share2,
  KeyRound,
  Download,
  Info,
  ChevronRight,
  Command,
  Database,
  Eye,
  ArrowRight
} from 'lucide-react';

interface MicroApp {
  id: string;
  name: string;
  url: string;
  category: 'Document Utility' | 'Audio Intelligence & AI' | 'Data & Media Optimization';
  tagline: string;
  badge: string;
  accentHex: string;
  borderLeftClass: string;
  iconBgClass: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  stats: {
    latency: string;
    metricLabel: string;
    metricValue: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
    coldStart: string;
    privacy: string;
  };
  descriptionDetailed: string;
  curlSnippet: string;
}

const ECOSYSTEM_APPS: MicroApp[] = [
  {
    id: 'audiscribe',
    name: 'AudiScribe',
    url: 'https://audiscribe.cloudage.workers.dev',
    category: 'Audio Intelligence & AI',
    tagline: 'High-accuracy AI speech-to-text engine. Transcribe meetings, lectures, and interviews with automated summary generation and speaker identification.',
    badge: 'AI Powered',
    accentHex: '#8b5cf6',
    borderLeftClass: 'border-l-4 border-[#8b5cf6]',
    iconBgClass: 'bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]',
    badgeClass: 'text-[#8b5cf6] border-[#8b5cf6]/30 bg-[#8b5cf6]/10',
    icon: AudioWaveform,
    features: [
      'Edge-accelerated Whisper large-v3 engine',
      'Multi-speaker diarization & timestamps',
      'Direct SRT, VTT, and JSON export',
      'Real-time chunk streaming over WebSockets'
    ],
    stats: {
      latency: '18ms/tok',
      metricLabel: 'Accuracy',
      metricValue: '99.4%',
      secondaryMetricLabel: 'Processing',
      secondaryMetricValue: 'Real-time',
      coldStart: '12ms',
      privacy: 'Encrypted Isolate'
    },
    descriptionDetailed:
      'AudiScribe deploys quantized acoustic neural models directly to Cloudflare Edge GPU nodes. It streams transcribed phonetic tokens with automated punctuation, speaker separation, and language autodetection across 98 languages.',
    curlSnippet: `# AudiScribe Edge Transcription API
curl -X POST https://audiscribe.cloudage.workers.dev/v1/transcribe \\
  -H "Authorization: Bearer cld_live_token" \\
  -F "audio=@quarterly-call.mp3" \\
  -F "format=srt" \\
  -F "diarization=true"`
  },
  {
    id: 'unlockpdf',
    name: 'UnlockPDF',
    url: 'https://unlockpdf.cloudage.workers.dev',
    category: 'Document Utility',
    tagline: 'Client-side PDF decryption and permission removal. Fast, secure, and browser-based.',
    badge: 'Zero Logs',
    accentHex: '#0284c7',
    borderLeftClass: 'border-l-4 border-[#0284c7]',
    iconBgClass: 'bg-[rgba(2,132,199,0.15)] text-[#0284c7]',
    badgeClass: 'text-[#0284c7] border-[#0284c7]/30 bg-[#0284c7]/10',
    icon: FileLock2,
    features: [
      'In-browser WebAssembly PDF decryptor',
      'Strips master & owner permissions',
      'Zero server byte storage or upload',
      'AES-128 & AES-256 standard support'
    ],
    stats: {
      latency: '4ms',
      metricLabel: 'Decryption Speed',
      metricValue: '120MB/s',
      secondaryMetricLabel: 'Processing',
      secondaryMetricValue: '100% Client',
      coldStart: '0ms (WASM)',
      privacy: '100% Client'
    },
    descriptionDetailed:
      'UnlockPDF parses the PDF binary structure entirely inside a client-side WebAssembly isolate. Password hashes and cryptographic streams are resolved without ever transmitting the document payload over the network.',
    curlSnippet: `# UnlockPDF operates 100% locally via WASM WebWorker
# CLI / Edge Endpoint query:
curl -X POST https://unlockpdf.cloudage.workers.dev/v1/inspect \\
  -H "Accept: application/json" \\
  -F "file=@encrypted-contract.pdf" \\
  -F "mode=strip-restrictions"`
  },
  {
    id: 'cloudtrim',
    name: 'CloudTrim',
    url: 'https://cloudtrim.cloudage.workers.dev',
    category: 'Data & Media Optimization',
    tagline: 'Lossless media compression suite. Reduce file size by up to 90% without quality loss.',
    badge: 'Edge Optimized',
    accentHex: '#10b981',
    borderLeftClass: 'border-l-4 border-[#10b981]',
    iconBgClass: 'bg-[rgba(16,185,129,0.15)] text-[#10b981]',
    badgeClass: 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10',
    icon: Zap,
    features: [
      'Rust-compiled MozJPEG & Oxipng codecs',
      'Next-gen AVIF & WebP automatic transcoding',
      'Lossless Brotli level 11 JSON/text compressor',
      'Metadata stripping with perceptual SSIM ≥ 0.99'
    ],
    stats: {
      latency: '6ms',
      metricLabel: 'Compression',
      metricValue: 'Up to 90%',
      secondaryMetricLabel: 'SSIM Quality',
      secondaryMetricValue: 'Lossless',
      coldStart: '0ms (Edge)',
      privacy: 'Zero Storage'
    },
    descriptionDetailed:
      'CloudTrim passes incoming images and data payloads through optimized Rust compilation targets running at the CDN edge. Media is compressed in a streaming pipeline and returned with maximum bandwidth savings.',
    curlSnippet: `# CloudTrim Edge Optimizer API
curl -X POST https://cloudtrim.cloudage.workers.dev/v1/compress \\
  -H "Content-Type: image/png" \\
  --data-binary "@raw-asset.png" \\
  -H "X-Target-Format: avif" \\
  --output "optimized-asset.avif"`
  }
];

const EDGE_POPS = [
  { code: 'SFO', city: 'San Francisco', region: 'NA-West', ping: 4, status: 'Optimal' },
  { code: 'IAD', city: 'Ashburn', region: 'NA-East', ping: 7, status: 'Optimal' },
  { code: 'LHR', city: 'London', region: 'EU-West', ping: 9, status: 'Optimal' },
  { code: 'FRA', city: 'Frankfurt', region: 'EU-Central', ping: 11, status: 'Optimal' },
  { code: 'NRT', city: 'Tokyo', region: 'AP-North', ping: 14, status: 'Optimal' },
  { code: 'SIN', city: 'Singapore', region: 'AP-South', ping: 16, status: 'Optimal' },
  { code: 'SYD', city: 'Sydney', region: 'Oceania', ping: 19, status: 'Optimal' },
  { code: 'GRU', city: 'São Paulo', region: 'SA-East', ping: 22, status: 'Optimal' }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewApp, setPreviewApp] = useState<MicroApp | null>(null);
  const [previewTab, setPreviewTab] = useState<'sandbox' | 'specs' | 'curl'>('sandbox');
  const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSection, setActiveSection] = useState<'apps' | 'benchmarks' | 'architecture' | 'pops'>('apps');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio preview simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAudioSample, setSelectedAudioSample] = useState<'meeting' | 'keynote' | 'interview'>('meeting');
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);

  // PDF preview simulation state
  const [pdfLocked, setPdfLocked] = useState(true);
  const [pdfIsDecrypting, setPdfIsDecrypting] = useState(false);
  const [pdfPermissions, setPdfPermissions] = useState({
    printing: false,
    copying: false,
    modifying: false
  });

  // CloudTrim preview simulation state
  const [trimFormat, setTrimFormat] = useState<'webp' | 'avif' | 'brotli'>('webp');
  const [trimQuality, setTrimQuality] = useState(85);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Keyboard shortcut listener (Cmd+K / Ctrl+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setPreviewApp(null);
        setNetworkPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio transcription simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setTranscriptionProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 100;
          }
          return prev + 6;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const filteredApps = useMemo(() => {
    return ECOSYSTEM_APPS.filter((app) => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.features.some((f) => f.toLowerCase().includes(q)) ||
        app.badge.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Document Utility', 'Audio Intelligence & AI', 'Data & Media Optimization'];

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    showToast('Snippet copied to clipboard');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUnlockPdfSim = () => {
    setPdfIsDecrypting(true);
    setTimeout(() => {
      setPdfLocked(false);
      setPdfPermissions({ printing: true, copying: true, modifying: true });
      setPdfIsDecrypting(false);
      showToast('PDF decrypted in 3.8ms via client WASM');
    }, 600);
  };

  // Check if we are in default unfiltered view to display the featured Bento Grid layout
  const isDefaultView = searchQuery === '' && selectedCategory === 'All';

  const audiscribeApp = ECOSYSTEM_APPS.find((a) => a.id === 'audiscribe')!;
  const unlockPdfApp = ECOSYSTEM_APPS.find((a) => a.id === 'unlockpdf')!;
  const cloudTrimApp = ECOSYSTEM_APPS.find((a) => a.id === 'cloudtrim')!;

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] relative selection:bg-sky-500/20 selection:text-sky-300 flex flex-col overflow-x-hidden">
      {/* Immersive UI Dot Grid Background */}
      <div className="dot-grid" />

      {/* Immersive Glow Orbs */}
      <div className="glow-purple -top-24 -right-24" />
      <div className="glow-sky -bottom-24 -left-24" />
      <div className="glow-emerald top-1/2 -right-36 hidden lg:block" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/60 text-zinc-200 shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/60 bg-[#030303]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand title & Mark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#8b5cf6] p-[1px] shadow-sm flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M17.5 19L22 12L17.5 5H6.5L2 12L6.5 19H17.5Z" />
              </svg>
            </div>
            <a
              href="#top"
              className="text-xl font-extrabold tracking-tight text-white hover:text-sky-400 transition-colors"
            >
              CloudAge
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-400">
            <button
              onClick={() => {
                setActiveSection('apps');
                document.getElementById('apps-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSection === 'apps' ? 'bg-zinc-800/80 text-white' : 'hover:bg-zinc-900/60 hover:text-white'
              }`}
            >
              Micro-Apps
            </button>
            <button
              onClick={() => {
                setActiveSection('benchmarks');
                document.getElementById('benchmarks-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSection === 'benchmarks' ? 'bg-zinc-800/80 text-white' : 'hover:bg-zinc-900/60 hover:text-white'
              }`}
            >
              Edge Latency
            </button>
            <button
              onClick={() => {
                setActiveSection('architecture');
                document.getElementById('architecture-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSection === 'architecture' ? 'bg-zinc-800/80 text-white' : 'hover:bg-zinc-900/60 hover:text-white'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setActiveSection('pops');
                document.getElementById('pops-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeSection === 'pops' ? 'bg-zinc-800/80 text-white' : 'hover:bg-zinc-900/60 hover:text-white'
              }`}
            >
              Global PoPs
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Live Status Pill & Cmd+K) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                onClick={() => setNetworkPopoverOpen(!networkPopoverOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[rgba(39,39,42,0.5)] border border-zinc-700/50 text-xs font-medium hover:bg-zinc-800/70 transition-colors whitespace-nowrap"
                title="Click to view Edge PoP Status"
              >
                <div className="pulse-green"></div>
                <span className="text-zinc-300 font-medium text-xs">Edge Network: 100% Operational</span>
              </button>

              {/* Edge Network Quick Popover */}
              {networkPopoverOpen && (
                <div className="absolute right-0 mt-2 w-80 p-4 rounded-xl bg-zinc-900/95 border border-zinc-700/60 shadow-2xl backdrop-blur-xl z-50 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                    <div className="flex items-center gap-2 font-semibold text-zinc-100">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Cloudflare Edge Telemetry</span>
                    </div>
                    <button
                      onClick={() => setNetworkPopoverOpen(false)}
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-zinc-400">
                      <span>Global Anycast PoPs</span>
                      <span className="text-zinc-200 font-mono">310+ Active</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Median Edge Latency</span>
                      <span className="text-emerald-400 font-mono">6.4 ms</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Cold Start Penalty</span>
                      <span className="text-zinc-200 font-mono">0 ms (V8 Isolates)</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Client Data Logging</span>
                      <span className="text-sky-400 font-mono">0 Bytes (Zero Retention)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNetworkPopoverOpen(false);
                      document.getElementById('pops-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-center font-medium transition-colors"
                  >
                    View All 8 Regional PoPs &rarr;
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 text-xs font-mono transition-all"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 w-full">
        
        {/* HERO SECTION */}
        <section id="top" className="flex flex-col gap-2 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white m-0">
            The CloudAge Hub.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl m-0">
            Performance-driven micro-apps running at the edge. Private, fast, and optimized for your daily workflows.
          </p>
        </section>

        {/* SEARCH & FILTER CONTROLS */}
        <section id="apps-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search micro-apps by name, capability, or keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/50 border border-zinc-800/80 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                      : 'bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-zinc-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* IMMERSIVE BENTO-GRID CARDS */}
          {filteredApps.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-zinc-300">No matching micro-apps found</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Try searching for "PDF", "Audio", "Whisper", or "Compression".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : isDefaultView ? (
            /* DEFAULT IMMERSIVE BENTO GRID (Featured 2-Row AudiScribe + Stacked UnlockPDF & CloudTrim) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Featured Bento Card (AudiScribe) */}
              <div className="lg:col-span-7 bento-card border-l-4 border-[#8b5cf6] min-h-[420px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-[rgba(139,92,246,0.15)] rounded-xl flex items-center justify-center text-[#8b5cf6]">
                      <AudioWaveform className="w-6 h-6" />
                    </div>
                    <span className="badge-immersive text-[#8b5cf6]">AI Powered</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">AudiScribe</h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {audiscribeApp.tagline}
                  </p>

                  {/* Stat Blocks */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-[rgba(39,39,42,0.4)] p-4 rounded-xl border border-zinc-800/60">
                      <div className="text-[11px] text-zinc-400 mb-1 uppercase font-semibold tracking-wider">Accuracy</div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono">99.4%</div>
                    </div>
                    <div className="bg-[rgba(39,39,42,0.4)] p-4 rounded-xl border border-zinc-800/60">
                      <div className="text-[11px] text-zinc-400 mb-1 uppercase font-semibold tracking-wider">Processing</div>
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono">Real-time</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={audiscribeApp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-launch"
                  >
                    <span>Launch AudiScribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setPreviewApp(audiscribeApp);
                      setPreviewTab('sandbox');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-700/80 border border-zinc-700/50 text-xs font-medium text-zinc-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Quick Preview</span>
                  </button>
                </div>
              </div>

              {/* Stacked Bento Cards Column (UnlockPDF & CloudTrim) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* UnlockPDF Bento Card */}
                <div className="bento-card border-l-4 border-[#0284c7] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-[rgba(2,132,199,0.15)] rounded-xl flex items-center justify-center text-[#0284c7]">
                        <FileLock2 className="w-5 h-5" />
                      </div>
                      <span className="badge-immersive text-[#0284c7]">Zero Logs</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">UnlockPDF</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                      {unlockPdfApp.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setPreviewApp(unlockPdfApp);
                        setPreviewTab('sandbox');
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>Preview</span>
                    </button>
                    <a
                      href={unlockPdfApp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0284c7] hover:text-sky-300 text-xs font-bold tracking-tight inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* CloudTrim Bento Card */}
                <div className="bento-card border-l-4 border-[#10b981] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-[rgba(16,185,129,0.15)] rounded-xl flex items-center justify-center text-[#10b981]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="badge-immersive text-[#10b981]">Edge Optimized</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">CloudTrim</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                      {cloudTrimApp.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setPreviewApp(cloudTrimApp);
                        setPreviewTab('sandbox');
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>
                    <a
                      href={cloudTrimApp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10b981] hover:text-emerald-300 text-xs font-bold tracking-tight inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* FILTERED / SEARCH VIEW GRID */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <div
                    key={app.id}
                    className={`bento-card ${app.borderLeftClass} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 ${app.iconBgClass} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`badge-immersive ${app.badgeClass}`}>{app.badge}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-white">{app.name}</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                        {app.tagline}
                      </p>

                      <div className="space-y-2 py-3 border-t border-zinc-800/60">
                        {app.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: app.accentHex }} />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-zinc-800/40">
                      <button
                        onClick={() => {
                          setPreviewApp(app);
                          setPreviewTab('sandbox');
                        }}
                        className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" style={{ color: app.accentHex }} />
                        <span>Preview</span>
                      </button>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold tracking-tight inline-flex items-center gap-1.5 transition-colors"
                        style={{ color: app.accentHex }}
                      >
                        <span>Open App</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* LATENCY BENCHMARKS COMPARISON TABLE */}
        <section
          id="benchmarks-section"
          className="bento-card space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>REAL-TIME EDGE PERFORMANCE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Execution Benchmarks &amp; Isolation
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Ping benchmark synced with 310 edge nodes')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-mono transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-sky-400" />
                <span>Re-Test Nodes</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 font-semibold">Micro-App</th>
                  <th className="pb-3 font-semibold">Runtime Engine</th>
                  <th className="pb-3 font-semibold">Edge Latency (P95)</th>
                  <th className="pb-3 font-semibold">Memory Ceiling</th>
                  <th className="pb-3 font-semibold">Server Storage</th>
                  <th className="pb-3 font-semibold text-right">Target Domain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {ECOSYSTEM_APPS.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3.5 font-bold text-white flex items-center gap-2 font-sans text-sm">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: app.accentHex }}></div>
                      {app.name}
                    </td>
                    <td className="py-3.5 text-zinc-400">{app.stats.coldStart}</td>
                    <td className="py-3.5 text-emerald-400 font-semibold">{app.stats.latency}</td>
                    <td className="py-3.5 text-zinc-400">128 MB (V8 Isolate)</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                        0 Bytes (Zero Retention)
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline underline-offset-4 inline-flex items-center gap-1"
                      >
                        <span>workers.dev</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* REGIONAL EDGE POPS MONITOR */}
        <section
          id="pops-section"
          className="bento-card space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>GLOBAL EDGE TOPOLOGY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Active Edge Node Locations
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Anycast BGP Routing &bull; 0ms DNS Resolution
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EDGE_POPS.map((pop) => (
              <div
                key={pop.code}
                className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-white">{pop.code}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {pop.ping}ms
                  </span>
                </div>
                <div className="text-xs text-zinc-300 font-medium">{pop.city}</div>
                <div className="text-[10px] font-mono text-zinc-500">{pop.region}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHITECTURE & PRIVACY PRINCIPLES */}
        <section
          id="architecture-section"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bento-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(2,132,199,0.15)] flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Data Retention</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Files, audio streams, and decoded payloads are processed entirely in memory inside ephemeral V8 isolates. Once the response completes, memory is immediately reclaimed.
            </p>
          </div>

          <div className="bento-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">WASM &amp; Native Codecs</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-intensity computation (Rust MozJPEG, WASM PDF parsing, Whisper AI inference) is compiled to binary WebAssembly, delivering near-native throughput on all devices.
            </p>
          </div>

          <div className="bento-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sub-10ms Cold Starts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unlike traditional containerized serverless functions, Cloudflare Workers spin up in less than 5 milliseconds, eliminating cold start stalls for end users.
            </p>
          </div>
        </section>

      </main>

      {/* QUICK PREVIEW & SANDBOX MODAL */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-900"
                  style={{ color: previewApp.accentHex }}
                >
                  <previewApp.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{previewApp.name}</h3>
                    <span className={`badge-immersive ${previewApp.badgeClass}`}>
                      {previewApp.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono truncate max-w-md">{previewApp.url}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewApp(null)}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800 bg-zinc-950/40 text-xs">
              <button
                onClick={() => setPreviewTab('sandbox')}
                className={`pb-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  previewTab === 'sandbox'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Interactive Sandbox</span>
              </button>
              <button
                onClick={() => setPreviewTab('specs')}
                className={`pb-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  previewTab === 'specs'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Edge Architecture</span>
              </button>
              <button
                onClick={() => setPreviewTab('curl')}
                className={`pb-3 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  previewTab === 'curl'
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>API &amp; cURL</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* TAB 1: INTERACTIVE SANDBOX SIMULATOR */}
              {previewTab === 'sandbox' && (
                <div className="space-y-6">
                  {/* UnlockPDF Sandbox */}
                  {previewApp.id === 'unlockpdf' && (
                    <div className="space-y-4 p-5 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Lock className="w-4 h-4 text-sky-400" />
                          <span>PDF Decryption Isolate Demo</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500">WASM Runtime</span>
                      </div>

                      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-mono">Sample Document:</span>
                          <span className="text-zinc-200 font-mono font-medium">Financial_Audit_2026.pdf (4.2 MB)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-mono">Encryption Standard:</span>
                          <span className="text-sky-400 font-mono">AES-256 (Protected Permissions)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-mono">Status:</span>
                          <span
                            className={`font-mono font-bold ${
                              pdfLocked ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {pdfLocked ? '🔒 Password & Permissions Locked' : '🔓 Decrypted & Unlocked'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className={`p-2.5 rounded border ${pdfPermissions.printing ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                          Printing: {pdfPermissions.printing ? 'Allowed' : 'Blocked'}
                        </div>
                        <div className={`p-2.5 rounded border ${pdfPermissions.copying ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                          Copy/Paste: {pdfPermissions.copying ? 'Allowed' : 'Blocked'}
                        </div>
                        <div className={`p-2.5 rounded border ${pdfPermissions.modifying ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                          Modifying: {pdfPermissions.modifying ? 'Allowed' : 'Blocked'}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleUnlockPdfSim}
                          disabled={!pdfLocked || pdfIsDecrypting}
                          className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                          {pdfIsDecrypting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Decrypting in WebAssembly...</span>
                            </>
                          ) : pdfLocked ? (
                            <>
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Execute In-Browser WASM Unlock</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Unlocked Successfully (0ms byte upload)</span>
                            </>
                          )}
                        </button>
                        {!pdfLocked && (
                          <button
                            onClick={() => {
                              setPdfLocked(true);
                              setPdfPermissions({ printing: false, copying: false, modifying: false });
                            }}
                            className="px-3 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AudiScribe Sandbox */}
                  {previewApp.id === 'audiscribe' && (
                    <div className="space-y-4 p-5 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <AudioWaveform className="w-4 h-4 text-purple-400" />
                          <span>Real-time Speech-to-Text Stream</span>
                        </div>
                        <span className="font-mono text-[10px] text-purple-400">Whisper Edge Turbo</span>
                      </div>

                      {/* Sample Selector */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAudioSample('meeting');
                            setTranscriptionProgress(0);
                            setIsPlayingAudio(false);
                          }}
                          className={`px-3 py-1.5 rounded-md font-mono ${
                            selectedAudioSample === 'meeting'
                              ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Product Standup (0:42)
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAudioSample('keynote');
                            setTranscriptionProgress(0);
                            setIsPlayingAudio(false);
                          }}
                          className={`px-3 py-1.5 rounded-md font-mono ${
                            selectedAudioSample === 'keynote'
                              ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Keynote Speech (1:15)
                        </button>
                      </div>

                      {/* Audio Waveform Simulator */}
                      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-4">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-lg"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                            <span>Streaming Tokens</span>
                            <span>{transcriptionProgress}% Processed</span>
                          </div>
                          {/* Animated Waveform Bars */}
                          <div className="flex items-end gap-1 h-8">
                            {[12, 24, 18, 30, 16, 28, 22, 32, 14, 26, 20, 31, 19, 29, 15, 27, 21, 33, 17, 25, 18, 30].map(
                              (height, i) => (
                                <div
                                  key={i}
                                  className={`flex-1 rounded-full transition-all duration-150 ${
                                    isPlayingAudio ? 'bg-purple-400 animate-pulse' : 'bg-zinc-800'
                                  }`}
                                  style={{
                                    height: isPlayingAudio
                                      ? `${Math.max(6, (height * (1 + (i % 3) * 0.2)) % 32)}px`
                                      : '6px'
                                  }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Live Output Box */}
                      <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono space-y-2">
                        <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                          <span>OUTPUT FEED (SPEAKER DIARIZED)</span>
                          <span className="text-emerald-400 font-bold">LIVE CHUNK STREAM</span>
                        </div>
                        <p className="text-zinc-200 text-xs leading-relaxed">
                          {transcriptionProgress > 0 ? (
                            <span>
                              <span className="text-purple-400 font-bold">[Speaker 1 - 00:04]:</span> "The edge architecture allows us to run inference in sub-20 milliseconds directly on Cloudflare GPU workers without persisting raw audio."
                              {transcriptionProgress > 40 && (
                                <>
                                  <br /><br />
                                  <span className="text-sky-400 font-bold">[Speaker 2 - 00:12]:</span> "And by keeping everything in ephemeral memory, we achieve zero logging compliance out of the box."
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="text-zinc-500 italic">Press play above to simulate real-time edge transcription chunking...</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CloudTrim Sandbox */}
                  {previewApp.id === 'cloudtrim' && (
                    <div className="space-y-4 p-5 rounded-xl bg-black/60 border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>Lossless Compression Pipeline</span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400">Rust MozJPEG + Brotli-11</span>
                      </div>

                      {/* Format Selector */}
                      <div className="flex items-center gap-2">
                        {(['webp', 'avif', 'brotli'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setTrimFormat(fmt)}
                            className={`px-3 py-1.5 rounded-md font-mono uppercase ${
                              trimFormat === fmt
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>

                      {/* Quality Slider */}
                      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                          <span>Target SSIM Fidelity</span>
                          <span className="text-emerald-400 font-semibold">{trimQuality}% (Perceptual Lossless)</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="95"
                          value={trimQuality}
                          onChange={(e) => setTrimQuality(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      {/* Comparison Metrics */}
                      <div className="grid grid-cols-3 gap-3 font-mono text-center">
                        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                          <div className="text-zinc-500 text-[10px]">ORIGINAL PAYLOAD</div>
                          <div className="text-sm font-bold text-zinc-300 mt-1">4.80 MB</div>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                          <div className="text-emerald-400 text-[10px]">OPTIMIZED SIZE</div>
                          <div className="text-sm font-bold text-emerald-300 mt-1">
                            {(4.8 * (1 - (100 - trimQuality * 0.9) / 100)).toFixed(2)} MB
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                          <div className="text-zinc-500 text-[10px]">BANDWIDTH SAVED</div>
                          <div className="text-sm font-bold text-emerald-400 mt-1">
                            {Math.round((1 - (1 - (100 - trimQuality * 0.9) / 100)) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SPECS */}
              {previewTab === 'specs' && (
                <div className="space-y-4">
                  <p className="text-zinc-300 text-sm leading-relaxed">{previewApp.descriptionDetailed}</p>
                  <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-zinc-500">Execution Framework</div>
                      <div className="text-zinc-200 font-semibold mt-1">Cloudflare Workers (V8)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-zinc-500">Security Sandbox</div>
                      <div className="text-emerald-400 font-semibold mt-1">POSIX Restricted WASM</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-zinc-500">TLS Encryption</div>
                      <div className="text-zinc-200 font-semibold mt-1">TLS 1.3 / ChaCha20</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800">
                      <div className="text-zinc-500">Global DNS</div>
                      <div className="text-sky-400 font-semibold mt-1">Anycast 1.1.1.1</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CURL & API */}
              {previewTab === 'curl' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                    <span>TERMINAL / CURL REQUEST</span>
                    <button
                      onClick={() => copySnippet(previewApp.curlSnippet)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                    >
                      {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-zinc-200 font-mono text-[11px] leading-relaxed overflow-x-auto">
                    <code>{previewApp.curlSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-500 font-mono truncate">
                Direct Host: <span className="text-zinc-400">{previewApp.url}</span>
              </div>
              <a
                href={previewApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-launch"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* COMMAND PALETTE (⌘K / Ctrl+K) */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-700/60 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-950">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or micro-app name..."
                className="w-full px-3 py-3.5 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">ESC</kbd>
            </div>

            <div className="p-3 space-y-1 max-h-80 overflow-y-auto text-xs">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Ecosystem Micro-Apps
              </div>
              {ECOSYSTEM_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    setPreviewApp(app);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <app.icon className="w-4 h-4" style={{ color: app.accentHex }} />
                    <div>
                      <div className="font-semibold text-zinc-200 group-hover:text-white">{app.name}</div>
                      <div className="text-[11px] text-zinc-400">{app.tagline}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300" />
                </button>
              ))}

              <div className="px-3 pt-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Quick Actions
              </div>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  document.getElementById('benchmarks-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors text-zinc-300"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>View Edge Latency Benchmarks</span>
              </button>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  document.getElementById('pops-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors text-zinc-300"
              >
                <Globe className="w-4 h-4 text-sky-400" />
                <span>View 8 Global Cloudflare PoPs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/60 bg-[#030303] mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6 text-xs text-zinc-500">
          <div>
            &copy; 2026 CloudAge Labs. Built on Cloudflare Workers.
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a
              href="#architecture-section"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="#benchmarks-section"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Status
            </a>
            <a
              href="#pops-section"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
