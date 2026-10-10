'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PolyAnimation from '../components/PolyAnimation';
import MarqueeTicker from '../components/MarqueeTicker';
import ClientFormModal from '../components/ClientFormModal';
import CandidateFormModal from '../components/CandidateFormModal';
import BookCallModal from '../components/BookCallModal';
import FloatingBookCallButton from '../components/FloatingBookCallButton';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darkBody text-white flex flex-col font-sans selection:bg-primary selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        onOpenClientForm={() => setIsClientModalOpen(true)}
        onOpenCandidateForm={() => setIsCandidateModalOpen(true)}
        onOpenBookCall={() => setIsBookCallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* ============================================================ */}
        {/* HERO SECTION (Fits Above The Fold)                           */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden pt-4 pb-10 lg:pt-6 lg:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 Cols on LG) */}
            <div className="lg:col-span-7 space-y-5 z-10">
              {/* Eyebrow Chip */}
              <ScrollReveal variant="fade-down" delay={50} duration={600}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-semibold tracking-wide uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Enterprise Talent Acquisition & Digital Engineering
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={150} duration={700}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Boutique Precision.{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Enterprise Scale.
                  </span>{' '}
                  AI-Accelerated Delivery.
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={250} duration={700}>
                <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
                  For 15+ years, Vance IT Solutions has eliminated the friction between ambitious tech initiatives and the elite engineers required to execute them. By pairing seasoned human recruitment intuition with next-generation AI sourcing, we deliver contract, direct-hire, and end-to-end digital solutions at enterprise speed.
                </p>
              </ScrollReveal>

              {/* Dual Action CTAs */}
              <ScrollReveal variant="fade-up" delay={350} duration={700}>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={() => setIsClientModalOpen(true)}
                    className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-xl hover:opacity-90 transition shadow-lg shadow-primary/25 text-center text-sm cursor-pointer"
                  >
                    Request Talent - Build Your Team
                  </button>
                  <Link
                    href="/candidate-hub"
                    className="px-6 py-3.5 border border-white/20 text-gray-200 font-bold rounded-xl hover:border-secondary hover:text-secondary hover:bg-secondary/10 transition text-center text-sm cursor-pointer"
                  >
                    Join Our Talent Network
                  </Link>
                </div>
              </ScrollReveal>

              {/* Key Metric Proof Bar */}
              <ScrollReveal variant="fade-up" delay={450} duration={700}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-left">
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer space-y-0.5">
                    <div className="text-xl font-black text-primary group-hover:scale-105 transition-transform origin-left">15+ Years</div>
                    <div className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">Proven Track Record</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-lg hover:shadow-secondary/10 group cursor-pointer space-y-0.5">
                    <div className="text-xl font-black text-secondary group-hover:scale-105 transition-transform origin-left">&lt; 48 Hours</div>
                    <div className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">Sourcing Turnaround</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer space-y-0.5">
                    <div className="text-xl font-black text-primary group-hover:scale-105 transition-transform origin-left">Multi-Stage</div>
                    <div className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">Human & AI Screening</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-lg hover:shadow-secondary/10 group cursor-pointer space-y-0.5">
                    <div className="text-xl font-black text-secondary group-hover:scale-105 transition-transform origin-left">Full Lifecycle</div>
                    <div className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">Staffing, Web & SEO</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Side: 3D Faceted Animation Canvas (5 Cols on LG) */}
            <div className="lg:col-span-5 w-full h-[360px] sm:h-[440px] lg:h-[480px] relative flex items-center justify-center">
              <ScrollReveal variant="zoom-in" delay={200} duration={800} className="w-full h-full">
                <div className="w-full h-full relative overflow-hidden">
                  <PolyAnimation />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INFINITE MARQUEE TICKER BANNER                               */}
        {/* ============================================================ */}
        <MarqueeTicker />

        {/* ============================================================ */}
        {/* SECTION 2: AUDIENCE PATHWAY SEGMENTER                        */}
        {/* ============================================================ */}
        <section id="audience" className="py-16 bg-black/30 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="fade-up" delay={50}>
              <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Dual Pathway Architecture</h2>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Configured for Hiring Leaders & Elite Engineers</h3>
                <p className="text-gray-400 text-sm">
                  Whether you need senior cloud architects to hit upcoming roadmap deadlines, or seek direct access to top-tier enterprise contracts, Vance IT Solutions provides focused, direct execution.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card A: Hiring Leaders & Procurement */}
              <ScrollReveal variant="slide-left" delay={150}>
                <div className="p-8 rounded-2xl bg-darkBody/90 border border-white/15 hover:border-primary/50 transition duration-300 space-y-6 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                      <svg className="w-6 h-6 fill-current text-primary" viewBox="0 0 24 24">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider block">For Hiring Leaders & Procurement</span>
                    <h4 className="text-2xl font-bold text-white">Accelerate Your Technical Roadmap</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Unburden your engineering leaders from sifting through thousands of misaligned resumes. Get interview-ready senior developers, cloud architects, and data practitioners pre-vetted against your exact architecture, budget, and culture.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => setIsClientModalOpen(true)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition cursor-pointer"
                    >
                      Request Client Talent →
                    </button>
                    <Link
                      href="/client-solutions"
                      className="text-xs text-gray-400 hover:text-white transition underline"
                    >
                      Explore Solutions Page
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card B: Senior Developers & Contractors */}
              <ScrollReveal variant="slide-right" delay={250}>
                <div className="p-8 rounded-2xl bg-darkBody/90 border border-white/15 hover:border-secondary/50 transition duration-300 space-y-6 flex flex-col justify-between group h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                      <svg className="w-6 h-6 fill-current text-secondary" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">For Senior Developers & Contractors</span>
                    <h4 className="text-2xl font-bold text-white">Direct Access to Prime Engagements</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We don’t run automated resume dumps. We build direct relationships with elite independent contractors and career engineers, placing you in high-visibility roles with transparent terms and rapid feedback loops.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      href="/candidate-hub"
                      className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-white transition cursor-pointer"
                    >
                      View Open Roles & Candidate Hub →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: CORE SERVICE PILLARS                              */}
        {/* ============================================================ */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal variant="fade-up" delay={50}>
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Complete Technical Capability</h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Modern Engineering & Sourcing Pillars</h3>
              <p className="text-gray-400 text-sm">
                Built on 15 years of consulting foundations, modernized for the AI era.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <ScrollReveal variant="fade-up" delay={100} className="h-full">
              <div className="p-6 rounded-xl bg-black/40 border border-white/10 hover:border-primary/40 transition space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">AI-Enhanced Technical Staffing</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Temp, Contract-to-Hire, Direct Placement. We leverage cutting-edge AI talent intelligence tools alongside deep industry sourcing networks to surface passive, high-caliber tech talent in record time.
                  </p>
                </div>
                <Link href="/client-solutions#staffing" className="text-xs font-bold text-primary hover:underline pt-2 block">
                  Learn More →
                </Link>
              </div>
            </ScrollReveal>

            {/* Pillar 2 */}
            <ScrollReveal variant="fade-up" delay={200} className="h-full">
              <div className="p-6 rounded-xl bg-black/40 border border-white/10 hover:border-secondary/40 transition space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">IT Consulting & Architecture</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Modernization roadmaps, cloud readiness, tech stack evaluation, and team topology consulting to guarantee your engineering investments yield tangible business throughput.
                  </p>
                </div>
                <Link href="/client-solutions#consulting" className="text-xs font-bold text-secondary hover:underline pt-2 block">
                  Learn More →
                </Link>
              </div>
            </ScrollReveal>

            {/* Pillar 3 */}
            <ScrollReveal variant="fade-up" delay={300} className="h-full">
              <div className="p-6 rounded-xl bg-black/40 border border-white/10 hover:border-primary/40 transition space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Custom Web & App Development</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Bespoke enterprise portals, responsive web platforms, and API integrations built with modern engineering practices (React, Node, WordPress headless/monolithic, Python) designed for security and scalability.
                  </p>
                </div>
                <Link href="/client-solutions#web-dev" className="text-xs font-bold text-primary hover:underline pt-2 block">
                  Learn More →
                </Link>
              </div>
            </ScrollReveal>

            {/* Pillar 4 */}
            <ScrollReveal variant="fade-up" delay={400} className="h-full">
              <div className="p-6 rounded-xl bg-black/40 border border-white/10 hover:border-secondary/40 transition space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Digital Marketing & SEO</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Data-driven acquisition engines. We diagnose infrastructure bottlenecks, execute enterprise search optimization, and optimize conversion funnels so your digital assets command search market share.
                  </p>
                </div>
                <Link href="/client-solutions#seo" className="text-xs font-bold text-secondary hover:underline pt-2 block">
                  Learn More →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: THE BOUTIQUE ADVANTAGE                            */}
        {/* ============================================================ */}
        <section id="advantage" className="py-16 bg-black/40 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <ScrollReveal variant="fade-up" delay={50}>
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Why 15+ Years Experience Matters</h2>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Why Enterprises Choose Vance Over Volume Agencies</h3>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal variant="fade-up" delay={100}>
                <div className="p-6 rounded-xl bg-darkBody border border-white/10 flex gap-4 items-start h-full">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Zero Middlemen, Pure Seniority</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      You speak directly with seasoned talent leads and technical strategists, not junior account coordinators reading keyword scripts.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={200}>
                <div className="p-6 rounded-xl bg-darkBody border border-white/10 flex gap-4 items-start h-full">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Precision Over Spam</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We present 2–3 thoroughly verified finalists rather than 50 unqualified profiles.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={300}>
                <div className="p-6 rounded-xl bg-darkBody border border-white/10 flex gap-4 items-start h-full">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">AI Speed with Human Discretion</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Algorithmic speed surfaces the market; human vetting verifies problem-solving depth, communication nuance, and authentic cultural alignment.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={400}>
                <div className="p-6 rounded-xl bg-darkBody border border-white/10 flex gap-4 items-start h-full">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Flexible Engagement Models</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Transparent contingent, direct placement, or statement-of-work (SOW) deliverables configured to your procurement parameters.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal variant="fade-up" delay={500}>
              <div className="text-center pt-2">
                <Link href="/about" className="text-xs font-bold text-primary hover:underline">
                  Read Full About Us & Comparative Matrix →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: CONTACT & DISCOVERY INLINE BAND                   */}
        {/* ============================================================ */}
        <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="zoom-in" delay={150} duration={800}>
            <div className="rounded-3xl bg-gradient-to-br from-darkBody via-black to-darkBody border border-primary/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-widest text-primary">Direct Executive Discovery</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Have a Critical Role or Project Deadline? Let’s Solve It.</h3>
              <p className="text-gray-300 text-sm max-w-2xl mx-auto">
                Speak directly with an executive recruiter or technical consultant today.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                <button
                  onClick={() => setIsBookCallModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-xl hover:opacity-90 transition text-sm shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Schedule a Discovery Call
                </button>
                <Link
                  href="/contact"
                  className="px-8 py-4 border border-white/20 text-gray-200 font-bold rounded-xl hover:border-primary hover:text-primary transition text-sm cursor-pointer"
                >
                  Go to Contact & Intake Hub
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Form Modals */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
      <CandidateFormModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />
      <BookCallModal
        isOpen={isBookCallModalOpen}
        onClose={() => setIsBookCallModalOpen(false)}
      />

      {/* Floating Call Booking Action Button */}
      <FloatingBookCallButton onOpenBookCall={() => setIsBookCallModalOpen(true)} />
    </div>
  );
}
