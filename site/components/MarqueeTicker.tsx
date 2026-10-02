'use client';

const TICKER_ITEMS = [
  'DATA & AI',
  'DEVOPS & CLOUD ARCHITECTURE',
  'IT STRATEGY & ADVISORY',
  'SOFTWARE ENGINEERING',
  'AI-POWERED RECRUITMENT',
  'CUSTOM WEB DEVELOPMENT',
  'TECHNICAL SEO & ANALYTICS',
  'ENTERPRISE STAFFING',
  'CYBERSECURITY & COMPLIANCE',
];

export default function MarqueeTicker() {
  // Duplicate array 3 times for continuous seamless scrolling
  const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-black/60 border-y border-white/10 overflow-hidden py-3.5 relative select-none">
      {/* Edge Blur Gradients */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-darkBody to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-darkBody to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8 text-xs font-mono tracking-widest text-gray-300 uppercase">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 whitespace-nowrap">
            <span className="text-secondary font-bold">◆</span>
            <span className="hover:text-primary transition-colors cursor-default">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
