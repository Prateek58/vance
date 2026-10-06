'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClientFormModal from '../../components/ClientFormModal';
import CandidateFormModal from '../../components/CandidateFormModal';

export default function ClientSolutions() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darkBody text-white flex flex-col font-sans selection:bg-primary selection:text-black">
      <Navbar
        onOpenClientForm={() => setIsClientModalOpen(true)}
        onOpenCandidateForm={() => setIsCandidateModalOpen(true)}
      />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="relative pt-12 pb-16 bg-gradient-to-b from-black/60 to-darkBody border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              Client Solutions & Service Directory
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Engineering Teams & Digital Solutions,{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Assembled with Precision.
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Tailored talent acquisition, architecture advisory, software development, and performance SEO configured to enterprise procurement standards.
            </p>
          </div>
        </section>

        {/* AI-Augmented Technical Staffing */}
        <section id="staffing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-b border-white/10">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Technical Staffing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Technical Staffing & Talent Acquisition</h2>
            <p className="text-gray-400 text-sm max-w-2xl">
              Rapid deployment of pre-vetted engineers across flexible engagement models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Contract & Temporary Staffing</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Rapid deployment of seasoned specialist contractors to fill acute skill gaps, manage project surges, or execute specialized sprints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Direct Hire & Executive Search</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Permanent placements vetted for sustained technical excellence and leadership potential. Low attrition, high long-term retention.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Contract-to-Hire Placement</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Evaluate candidate performance, team dynamics, and problem-solving capability on your actual codebase before committing to a permanent offer.
              </p>
            </div>
          </div>

          {/* AI-Human Screening Matrix Breakdown */}
          <div className="p-8 rounded-3xl bg-black/60 border border-primary/20 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Methodology</span>
              <h3 className="text-xl font-bold text-white mt-1">Our AI-Human Screening Matrix</h3>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-gray-300">
              <li className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-white">Step 1: Deep Requirement Deconstruction</strong> — We align on tech stack, codebase challenges, team velocity, and organizational constraints.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-white">Step 2: AI-Powered Talent Radar</strong> — Proprietary search vectors and algorithmic enrichment scan passive pools to identify top-tier developers not actively on public job boards.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-white">Step 3: Rigorous Human Qualification</strong> — Deep-dive interviews examining actual architectural trade-offs, past delivery ownership, and soft-skill execution.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-white">Step 4: Seamless Onboarding Support</strong> — Complete facilitation of contracts, background verification, compliance documentation, and timeline alignment.
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* IT Consulting & Workforce Advisory */}
        <section id="consulting" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-white/10">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Consulting & Advisory</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">IT Consulting & Workforce Advisory</h2>
            <p className="text-gray-400 text-sm">
              Strategic Guidance to Scale Modern Engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Technical Roadmap & Tech Stack Selection</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Objective evaluation of framework, language, and cloud ecosystem choices to minimize tech debt and maximize scalability.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Distributed Team Structuring & Audits</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Optimizing developer productivity, CI/CD pipelines, and communication topology across remote and hybrid engineering cohorts.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Cloud Migration & Architecture Modernization</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Step-by-step modernization roadmaps transitioning legacy monolithic systems to resilient cloud-native microservices.
              </p>
            </div>
          </div>
        </section>

        {/* Custom Web & Enterprise Software Development */}
        <section id="web-dev" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-white/10">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Custom Development</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Custom Web & Enterprise Software Development</h2>
            <p className="text-gray-400 text-sm">
              Digital Products Built for Performance, Longevity, and Scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">WordPress, Headless CMS & Modern Web Apps</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Bespoke enterprise portals, responsive web platforms, and CMS implementations engineered for sub-second speeds.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Enterprise & Partner Portals</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Secure internal dashboards, workflow automation tools, and client portals built using React, Next.js, Node, and Python.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">RESTful & GraphQL API Integration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Robust API architectures, third-party system integrations, microservices communication, and cloud infrastructure deployment.
              </p>
            </div>
          </div>
        </section>

        {/* Digital Marketing & Technical SEO */}
        <section id="seo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Digital Marketing & SEO</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Digital Marketing & Technical SEO</h2>
            <p className="text-gray-400 text-sm">
              High-Authority Digital Footprints Built on Data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Technical SEO & Core Web Vitals</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Full-site infrastructure audits, indexability fixes, schema markup, and speed optimizations to dominate search rankings.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">B2B Content Marketing Frameworks</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                High-intent search targeting, technical whitepapers, case study creation, and authority-building content pipelines.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-darkBody border border-white/10 space-y-2">
              <h3 className="text-base font-bold text-white">Conversion Rate Optimization (CRO)</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Friction-free customer journeys, landing page experimentation, and high-conversion lead capture design.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="pt-8">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-black to-secondary/20 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white">Ready to scale your engineering team or project?</h3>
                <p className="text-xs text-gray-300 mt-1">Schedule a discovery call with a senior Vance technical manager.</p>
              </div>
              <button
                onClick={() => setIsClientModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-xl hover:opacity-90 transition text-xs shrink-0 cursor-pointer"
              >
                Request Client Consultation
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
      <CandidateFormModal isOpen={isCandidateModalOpen} onClose={() => setIsCandidateModalOpen(false)} />
    </div>
  );
}
