import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, History, Settings, Sparkles, Check, Copy, Download, Loader2, Zap, Cloud, Pizza, Bike, Skull, Trash2, ArrowRight, ChevronDown, Globe, MessageSquare, Shield, Terminal, ExternalLink } from 'lucide-react';
import { cn } from './lib/utils';
import { generateEmoji } from './services/emojiApi';

// --- Premium Loader ---
const AppLoader = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
  >
    <div className="relative">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,231,146,0.3)]">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </motion.div>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-6 border-t-2 border-primary/40 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-10 border-b-2 border-primary/10 rounded-full"
      />
    </div>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-16 flex flex-col items-center gap-4"
    >
      <h1 className="text-4xl font-display font-black tracking-[0.2em] text-white uppercase italic">EMORA</h1>
      <p className="text-primary/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Protocol</p>
      
      <div className="mt-8 w-64 h-[1px] bg-white/5 relative overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent w-1/2"
        />
      </div>
    </motion.div>
  </motion.div>
);

const DEFAULT_TRENDING = [
  { name: 'FIRE', emoji: '🔥' },
  { name: 'ROCKET', emoji: '🚀' },
  { name: 'SPARKLES', emoji: '✨', active: true },
  { name: 'LAPTOP', emoji: '💻' },
  { name: 'MELTING', emoji: '🫠' },
  { name: 'ZAP', emoji: '⚡' }
];

const INITIAL_HISTORY = [
  { text: "Late night snacks", type: "pizza" },
  { text: "Alien invasion", type: "cloud" },
  { text: "Weekend vibes", type: "bike" }
];

const SearchIcon = ({ type }) => {
  switch (type) {
    case 'pizza': return <Pizza className="w-4 h-4 text-orange-400" />;
    case 'cloud': return <Cloud className="w-4 h-4 text-cyan-400" />;
    case 'bike': return <Bike className="w-4 h-4 text-emerald-400" />;
    default: return <Sparkles className="w-4 h-4 text-primary" />;
  }
};

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activePrompt, setActivePrompt] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Functional State
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('emora_searches');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [historyCarousel, setHistoryCarousel] = useState(() => {
    const saved = localStorage.getItem('emora_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('emora_searches', JSON.stringify(recentSearches));
    localStorage.setItem('emora_history', JSON.stringify(historyCarousel));
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [recentSearches, historyCarousel]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (e, overridePrompt) => {
    if (e) e.preventDefault();
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setActivePrompt(finalPrompt);

    const data = await generateEmoji(finalPrompt);
    if (data.success) {
      setResult(data.imageUrl);
      const newSearch = { text: finalPrompt, type: 'sparkles', timestamp: Date.now() };
      const newHistoryItem = { prompt: finalPrompt, imageUrl: data.imageUrl, timestamp: Date.now() };
      setRecentSearches(prev => [newSearch, ...prev.filter(s => s.text.toLowerCase() !== finalPrompt.toLowerCase())].slice(0, 5));
      setHistoryCarousel(prev => [newHistoryItem, ...prev.filter(h => h.prompt.toLowerCase() !== finalPrompt.toLowerCase())]);
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  };

  const clearHistory = () => {
    setRecentSearches(INITIAL_HISTORY);
    setHistoryCarousel([]);
    localStorage.removeItem('emora_searches');
    localStorage.removeItem('emora_history');
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHistoryClick = (item) => {
    setResult(item.imageUrl);
    setActivePrompt(item.prompt);
    setPrompt(item.prompt);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-on-surface-variant font-body px-6 md:px-12 selection:bg-primary/30 overflow-x-hidden">
      
      <AnimatePresence>
        {isInitializing && <AppLoader key="app-loader" />}
      </AnimatePresence>

      {/* Navigation */}
      <header className={cn("fixed top-0 inset-x-0 h-24 z-50 transition-all duration-500 px-6 md:px-12 flex items-center justify-between", isScrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 h-20" : "bg-transparent h-24")}>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,231,146,0.3)] rotate-12 group-hover:rotate-0 transition-transform duration-500">
               <div className="w-4 h-4 border-[3px] border-black rounded-full" />
            </div>
          </div>
          <span className="text-white font-display font-black text-2xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">EMORA</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-12">
          {['Home', 'Trending', 'History', 'About'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase()+'-section')?.scrollIntoView({ behavior: 'smooth' })} className="group relative">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">{item}</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
           <button className="hidden md:flex items-center gap-4 bg-primary text-black px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,231,146,0.2)]">
             Connect Protocol
           </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home-section" className="pt-48 pb-20 relative flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white font-display text-8xl md:text-9xl font-black tracking-tighter text-center leading-[0.85] max-w-5xl uppercase">
          Find Your <span className="text-primary italic">Emoji</span> Instantly
        </motion.h1>
        
        <p className="mt-10 text-primary font-display text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">
          Professional Curation System
        </p>

        {/* Input Field */}
        <div className="mt-16 w-full max-w-xl relative group">
          <form onSubmit={handleGenerate} className="relative z-10">
            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40"><Search className="w-6 h-6" /></div>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Inject prompt for curation..." className="w-full h-20 bg-white/5 rounded-[2.5rem] pl-16 pr-32 text-white font-medium placeholder:text-white/10 focus:outline-none focus:bg-white/10 transition-all duration-500 border border-white/5 group-focus-within:border-primary/20" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-transform active:scale-95">
              <button type="submit" disabled={isLoading || !prompt.trim()} className="bg-primary text-black px-10 h-12 rounded-[1.5rem] font-display font-black text-xs uppercase tracking-tight shadow-[0_0_30px_rgba(255,231,146,0.3)]">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Grid */}
      <main id="trending-section" className="bg-surface-container-low rounded-t-[5rem] p-10 md:p-24 relative overflow-visible shadow-[0_-100px_200px_-50px_rgba(0,0,0,1)] mt-24">
        
        <section className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <p className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4">Trending Now</p>
              <h2 className="text-white font-display text-5xl md:text-6xl font-black tracking-tighter uppercase italic">Global <span className="text-white/10 italic">Signals</span></h2>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-3xl border border-white/5 backdrop-blur-3xl shadow-2xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/10">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <span className="text-white font-bold text-[10px] uppercase tracking-widest italic pr-4">Global Curation Active</span>
            </div>
          </div>

          {/* Results View */}
          <AnimatePresence mode="wait">
            {(result || isLoading || error) && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="flex flex-col items-center py-10 mb-20">
                {isLoading ? (
                  <div className="flex flex-col items-center py-20">
                    <div className="relative">
                       <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="w-40 h-40 rounded-full border-4 border-primary/20" />
                       <Loader2 className="w-16 h-16 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-16 text-primary font-display font-black text-xs uppercase tracking-[0.8em] animate-pulse">Materializing Discovery</p>
                  </div>
                ) : error ? (
                   <div className="text-center">
                     <Skull className="w-20 h-20 text-red-500 mx-auto mb-10 opacity-20" />
                     <p className="text-red-500 font-display text-2xl font-black uppercase mb-8">{error}</p>
                     <button onClick={() => {setResult(null); setPrompt(''); setError(null);}} className="bg-white/5 px-10 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">Retry Protocol</button>
                   </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <motion.div className="bg-white rounded-[5rem] p-16 md:p-24 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] flex items-center justify-center max-w-lg w-full aspect-square relative group">
                      <img src={result} alt={activePrompt} className="w-full h-full object-contain relative z-10" />
                      <div className="absolute inset-x-20 -bottom-10 h-20 bg-primary/20 blur-3xl rounded-full opacity-25" />
                    </motion.div>
                    <div className="mt-20 px-14 py-7 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
                      <h3 className="text-white font-display text-4xl font-black tracking-tighter uppercase italic leading-none">{activePrompt}</h3>
                    </div>
                    <div className="mt-12 flex gap-12">
                      <button onClick={copyToClipboard} className="flex flex-col items-center gap-3 text-white/40 hover:text-white transition-all group">
                        <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                          {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase">Sync</span>
                      </button>
                      <button onClick={() => window.open(result, '_blank')} className="flex flex-col items-center gap-3 text-white/40 hover:text-white transition-all group">
                         <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                          <Download className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase">Export</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trending Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-40">
            {DEFAULT_TRENDING.map((item) => (
              <button key={item.name} onClick={() => {setPrompt(item.name.toLowerCase()); handleGenerate(null, item.name.toLowerCase());}} className={cn("emoji-card group h-72 border-white/[0.03]", item.active && "bg-primary text-black border-none shadow-[0_0_40px_rgba(255,231,146,0.3)]")}>
                <span className="text-9xl mb-10 group-hover:scale-125 transition-transform duration-700">{item.emoji}</span>
                <span className={cn("text-[11px] font-black uppercase tracking-[0.4em] opacity-20 group-hover:opacity-100", item.active && "opacity-100")}>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Curation History Section */}
          {historyCarousel.length > 0 && (
            <section id="history-section" className="mt-40 pt-24 border-t border-white/5">
              <div className="flex justify-between items-center mb-16">
                 <h3 className="text-white font-display text-5xl font-black uppercase tracking-tighter italic">Curation <span className="text-white/10">History</span></h3>
                 <button onClick={clearHistory} className="text-[10px] font-black text-white/20 hover:text-red-500 transition-colors uppercase tracking-[0.4em] flex items-center gap-3">
                   <Trash2 className="w-4 h-4" /> Purge Cache
                 </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {historyCarousel.map((item, idx) => (
                  <motion.button key={idx} whileHover={{ y: -10 }} onClick={() => handleHistoryClick(item)} className="aspect-square bg-white/[0.01] rounded-[3rem] p-10 border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden">
                    <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {/* About Section */}
          <section id="about-section" className="mt-60 pt-40 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-24">
               <div>
                  <p className="text-primary font-black text-[10px] uppercase tracking-[0.6em] mb-6 animate-pulse">Official Documentation</p>
                  <h2 className="text-white font-display text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] mb-12">Beyond <span className="text-white/10 italic">Standard</span> Expression</h2>
                  <p className="text-white/40 text-lg leading-relaxed max-w-xl font-medium">
                    EMORA is a precision curation engine designed for the next generation of digital communicators. 
                    Merging algorithmic intelligence with artisanal design patterns, we transform complex prompts into flawless emoji artifacts instantly.
                  </p>
                  <div className="mt-16 grid grid-cols-2 gap-12">
                     <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Terminal className="w-6 h-6 text-primary" /></div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">Neural Protocol</h4>
                        <p className="text-white/20 text-[11px] leading-relaxed">High-octane generation logic powered by artisanal weights.</p>
                     </div>
                     <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Shield className="w-6 h-6 text-primary" /></div>
                        <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">Curation Safety</h4>
                        <p className="text-white/20 text-[11px] leading-relaxed">Every artifact is verified against global curation standards.</p>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-square bg-white/[0.02] rounded-[5rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                     <Sparkles className="w-40 h-40 text-primary opacity-5 animate-pulse" />
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-20 rotate-12">⚡</div>
                  </div>
               </div>
            </div>
          </section>
        </section>
      </main>

      {/* Footer System */}
      <footer className="pt-60 pb-32 border-t border-white/5 mt-40">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-24 mb-40">
           <div className="space-y-10 lg:col-span-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center rotate-12"><div className="w-4 h-4 border-[3px] border-black rounded-full" /></div>
                <span className="text-white font-display text-4xl font-black tracking-tighter uppercase italic">EMORA</span>
              </div>
              <p className="text-white/20 text-xs font-medium leading-relaxed max-w-xs uppercase tracking-widest">
                The terminal for high-octane digital artifacts. Standardized curated expressions for the digital vanguard.
              </p>
           </div>
           
           <div className="space-y-8">
              <h5 className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Protocol</h5>
              <ul className="space-y-6 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <li className="hover:text-primary transition-colors cursor-pointer">Generator</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Archive</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Analytics</li>
                <li className="hover:text-primary transition-colors cursor-pointer">System Logs</li>
              </ul>
           </div>

           <div className="space-y-8">
              <h5 className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Archive</h5>
              <ul className="space-y-6 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Auth Terms</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Status</li>
              </ul>
           </div>

           <div className="space-y-8">
              <h5 className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Connect</h5>
              <div className="flex gap-6">
                <ExternalLink className="w-5 h-5 text-white/20 hover:text-primary transition-colors cursor-pointer" />
                <Globe className="w-5 h-5 text-white/20 hover:text-primary transition-colors cursor-pointer" />
                <MessageSquare className="w-5 h-5 text-white/20 hover:text-primary transition-colors cursor-pointer" />
              </div>
              <div className="pt-4">
                 <div className="flex items-center gap-3 bg-white/5 py-4 px-6 rounded-2xl border border-white/10 group hover:border-primary/30 transition-all cursor-default">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-white/60 font-black text-[9px] uppercase tracking-widest group-hover:text-white transition-colors">Core Engine 1.4.2</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 opacity-20">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 transition-all hover:opacity-100 cursor-default">&copy; 2026 EMORA SYSTEM PRODUCTIONS. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.3em]">
             <span className="cursor-pointer hover:text-primary transition-colors">Digital Signature: 0XF4E...2026</span>
             <span className="cursor-pointer hover:text-primary transition-colors">Global Node: ASHBURN-01</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
