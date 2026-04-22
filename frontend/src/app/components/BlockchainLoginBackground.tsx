export function BlockchainLoginBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      {/* Blockchain nodes - Top Left */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-[#3B82F6] rounded-full shadow-lg shadow-[#3B82F6]/50 animate-pulse" />
      <div className="absolute top-32 left-40 w-3 h-3 bg-[#22C55E] rounded-full shadow-lg shadow-[#22C55E]/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-48 left-24 w-3.5 h-3.5 bg-[#8B5CF6] rounded-full shadow-lg shadow-[#8B5CF6]/50 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Blockchain nodes - Top Right */}
      <div className="absolute top-24 right-32 w-3 h-3 bg-[#F59E0B] rounded-full shadow-lg shadow-[#F59E0B]/50 animate-pulse" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-40 right-20 w-4 h-4 bg-[#3B82F6] rounded-full shadow-lg shadow-[#3B82F6]/50 animate-pulse" style={{ animationDelay: '0.8s' }} />
      <div className="absolute top-56 right-48 w-3 h-3 bg-[#22C55E] rounded-full shadow-lg shadow-[#22C55E]/50 animate-pulse" style={{ animationDelay: '1.2s' }} />

      {/* Blockchain nodes - Bottom Left */}
      <div className="absolute bottom-32 left-24 w-3.5 h-3.5 bg-[#8B5CF6] rounded-full shadow-lg shadow-[#8B5CF6]/50 animate-pulse" style={{ animationDelay: '0.6s' }} />
      <div className="absolute bottom-20 left-48 w-3 h-3 bg-[#3B82F6] rounded-full shadow-lg shadow-[#3B82F6]/50 animate-pulse" style={{ animationDelay: '1.4s' }} />
      <div className="absolute bottom-44 left-32 w-4 h-4 bg-[#22C55E] rounded-full shadow-lg shadow-[#22C55E]/50 animate-pulse" style={{ animationDelay: '0.2s' }} />

      {/* Blockchain nodes - Bottom Right */}
      <div className="absolute bottom-28 right-28 w-3 h-3 bg-[#F59E0B] rounded-full shadow-lg shadow-[#F59E0B]/50 animate-pulse" style={{ animationDelay: '0.9s' }} />
      <div className="absolute bottom-44 right-44 w-3.5 h-3.5 bg-[#8B5CF6] rounded-full shadow-lg shadow-[#8B5CF6]/50 animate-pulse" style={{ animationDelay: '1.1s' }} />
      <div className="absolute bottom-16 right-20 w-4 h-4 bg-[#3B82F6] rounded-full shadow-lg shadow-[#3B82F6]/50 animate-pulse" style={{ animationDelay: '0.4s' }} />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Top connections */}
        <line x1="5%" y1="15%" x2="12%" y2="22%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.4" />
        <line x1="12%" y1="22%" x2="7%" y2="32%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.4" />

        {/* Right connections */}
        <line x1="88%" y1="18%" x2="92%" y2="28%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.4" />
        <line x1="92%" y1="28%" x2="82%" y2="35%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.4" />

        {/* Bottom connections */}
        <line x1="7%" y1="68%" x2="14%" y2="75%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.4" />
        <line x1="14%" y1="75%" x2="10%" y2="85%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.4" />

        {/* Cross connections */}
        <line x1="88%" y1="72%" x2="82%" y2="62%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.4" />
        <line x1="82%" y1="62%" x2="92%" y2="84%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.4" />

        {/* Diagonal connections */}
        <line x1="7%" y1="32%" x2="14%" y2="68%" stroke="url(#lineGradient1)" strokeWidth="1" opacity="0.3" strokeDasharray="4,4" />
        <line x1="82%" y1="35%" x2="88%" y2="72%" stroke="url(#lineGradient2)" strokeWidth="1" opacity="0.3" strokeDasharray="4,4" />
      </svg>

      {/* Hexagonal shapes */}
      <div className="absolute top-1/4 left-12 w-16 h-16 border border-[#3B82F6]/20 rotate-12 animate-spin-slow" style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        animationDuration: '20s'
      }} />
      <div className="absolute bottom-1/4 right-16 w-20 h-20 border border-[#8B5CF6]/20 -rotate-12 animate-spin-slow" style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        animationDuration: '25s',
        animationDirection: 'reverse'
      }} />

      {/* Floating evidence icons */}
      <div className="absolute top-1/3 right-1/4 opacity-10 animate-float">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="absolute bottom-1/3 left-1/4 opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H13L11 4H6C4.89543 4 4 4.89543 4 6V19C4 20.1046 4.89543 21 6 21Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
