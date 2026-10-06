import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-darkBody border-t border-white/10 pt-16 pb-12 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Company Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.svg"
                alt="Vance IT Solutions"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xs tracking-tight font-medium text-primary block mt-1">
                Empowering your Tech Journey
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Boutique precision, enterprise scale, AI-accelerated delivery. Connecting ambitious organizations with elite tech talent and digital solution capabilities.
            </p>
            <div className="pt-2 text-xs">
              <span className="text-white font-medium block">Headquarters:</span>
              <span>Wyoming, USA</span>
            </div>
          </div>

          {/* Client Solutions */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Client Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/client-solutions#staffing" className="hover:text-primary transition-colors">
                  AI Technical Staffing
                </Link>
              </li>
              <li>
                <Link href="/client-solutions#consulting" className="hover:text-primary transition-colors">
                  IT Consulting & Architecture
                </Link>
              </li>
              <li>
                <Link href="/client-solutions#web-dev" className="hover:text-primary transition-colors">
                  Custom Web Development
                </Link>
              </li>
              <li>
                <Link href="/client-solutions#seo" className="hover:text-primary transition-colors">
                  Digital Marketing & SEO
                </Link>
              </li>
            </ul>
          </div>

          {/* Candidate Hub */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Candidate Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/candidate-hub#jobs" className="hover:text-secondary transition-colors">
                  Active Opportunities
                </Link>
              </li>
              <li>
                <Link href="/candidate-hub#fast-track" className="hover:text-secondary transition-colors">
                  Fast-Track Profile Drop
                </Link>
              </li>
              <li>
                <Link href="/candidate-hub#contractor-protocol" className="hover:text-secondary transition-colors">
                  Contractor Protocol
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Social */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Direct Inquiries</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400 block">Client & Corporate:</span>
                <a href="mailto:info@vanceitsolutions.com" className="text-primary hover:underline">
                  info@vanceitsolutions.com
                </a>
              </div>
              <div>
                <span className="text-gray-400 block">Candidate Careers:</span>
                <a href="mailto:career@vanceitsolutions.com" className="text-secondary hover:underline">
                  career@vanceitsolutions.com
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.linkedin.com/company/vance-it-solutions-llc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-primary transition-colors border border-white/10 px-3 py-1.5 rounded-md"
                >
                  <svg className="w-4 h-4 fill-current text-primary" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Vance IT Solutions LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-400">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-400">Compliance & Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
