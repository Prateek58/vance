'use client';

interface FloatingBookCallButtonProps {
  onOpenBookCall: () => void;
}

export default function FloatingBookCallButton({ onOpenBookCall }: FloatingBookCallButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onOpenBookCall}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary via-secondary to-primary text-black font-extrabold text-xs shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20 backdrop-blur-md"
        aria-label="Book a Call"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
        </span>
        <svg className="w-4 h-4 fill-current text-black group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
        </svg>
        <span className="tracking-tight">Book a Call</span>
      </button>
    </div>
  );
}
