'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClientFormModal from '../../components/ClientFormModal';
import CandidateFormModal from '../../components/CandidateFormModal';
import BookCallModal from '../../components/BookCallModal';
import FloatingBookCallButton from '../../components/FloatingBookCallButton';

export default function AboutUs() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darkBody text-white flex flex-col font-sans selection:bg-primary selection:text-black">
      <Navbar
        onOpenClientForm={() => setIsClientModalOpen(true)}
        onOpenCandidateForm={() => setIsCandidateModalOpen(true)}
        onOpenBookCall={() => setIsBookCallModalOpen(true)}
      />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="relative pt-12 pb-16 bg-gradient-to-b from-black/60 to-darkBody border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              About Us & The Vance Advantage
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Fifteen Years of Industry Craftsmanship,{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Amplified by Modern Tech.
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Vance IT Solutions LLC operates as a high-velocity boutique partner, pairing human recruitment intuition with next-generation AI talent sourcing.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Company History & Mission</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Solving the Corporate Sourcing Dilemma</h2>
              <div className="space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  Vance IT Solutions LLC was established to solve a persistent corporate dilemma: large agencies treat technical talent like commodity data points, while solo recruiters lack the infrastructure to deliver at scale.
                </p>
                <p>
                  With more than 15 years of continuous presence across IT services, technical recruiting, and digital engineering, we operate as a high-velocity boutique partner. We combine the personal accountability of a dedicated search firm with the technological agility of modern AI tooling.
                </p>
                <p>
                  Whether we are staffing mission-critical engineers for a Fortune 500 team or engineering a custom web presence from the ground up, we take total ownership over velocity, compliance, and long-term results.
                </p>
              </div>
            </div>

            {/* Metric Highlights Sidebar Card */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-black/60 border border-primary/30 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">The Vance Benchmark</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Founded Track Record:</span>
                  <span className="text-primary font-bold text-sm">15+ Years Experience</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Turnaround Speed:</span>
                  <span className="text-secondary font-bold text-sm">&lt; 48 Hours Sourcing</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Headquarters Location:</span>
                  <span className="text-white font-bold text-sm">Wyoming, USA</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Vetting Methodology:</span>
                  <span className="text-primary font-bold text-sm">Dual AI & Human Matrix</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Comparative Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Enterprises Choose Boutique Precision</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/15">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-black/80 text-white uppercase tracking-wider text-[11px] border-b border-white/15">
                <tr>
                  <th className="py-4 px-6 font-bold">Operational Metric</th>
                  <th className="py-4 px-6 font-bold text-primary">Vance IT Solutions (Boutique)</th>
                  <th className="py-4 px-6 font-bold text-gray-400">Traditional Volume Agencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-darkBody/90">
                <tr>
                  <td className="py-4 px-6 font-semibold text-white">Account Management</td>
                  <td className="py-4 px-6 text-primary font-medium">Direct Senior Recruiters & Technical Strategists</td>
                  <td className="py-4 px-6 text-gray-400">Junior Coordinators reading keyword scripts</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-white">Submission Volume</td>
                  <td className="py-4 px-6 text-primary font-medium">2 to 3 pre-vetted, highly qualified finalists</td>
                  <td className="py-4 px-6 text-gray-400">50+ unvetted resumes dumped into inbox</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-white">Sourcing Technology</td>
                  <td className="py-4 px-6 text-primary font-medium">Proprietary AI Radar + Human Problem-Solving Vetting</td>
                  <td className="py-4 px-6 text-gray-400">Basic public job board keyword matching</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-white">Engagement Flexibility</td>
                  <td className="py-4 px-6 text-primary font-medium">Tailored Contingent, Direct Hire, 1099, C2C & SOW</td>
                  <td className="py-4 px-6 text-gray-400">Rigid automated agency templates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Grid Layout: The 4 Boutique Pillars */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Core Pillars</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The Vance Advantage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Zero Middlemen, Pure Seniority</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                You speak directly with seasoned talent leads and technical strategists, not junior account coordinators reading keyword scripts.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Precision Over Spam</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                We present 2–3 thoroughly verified finalists rather than 50 unqualified profiles.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white">AI Speed with Human Discretion</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Algorithmic speed surfaces the market; human vetting verifies problem-solving depth, communication nuance, and authentic cultural alignment.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-black/40 border border-white/15 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-white">Flexible Engagement Models</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Transparent contingent, direct placement, or statement-of-work (SOW) deliverables configured to your procurement parameters.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
      <CandidateFormModal isOpen={isCandidateModalOpen} onClose={() => setIsCandidateModalOpen(false)} />
      <BookCallModal isOpen={isBookCallModalOpen} onClose={() => setIsBookCallModalOpen(false)} />

      <FloatingBookCallButton onOpenBookCall={() => setIsBookCallModalOpen(true)} />
    </div>
  );
}
