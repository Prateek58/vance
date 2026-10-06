'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClientForm from '../../components/ClientForm';
import CandidateForm from '../../components/CandidateForm';
import ClientFormModal from '../../components/ClientFormModal';
import CandidateFormModal from '../../components/CandidateFormModal';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'candidate'>('client');
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
              Contact & Discovery Consultation
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Have a Critical Role or Project Deadline?{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Let&apos;s Solve It.
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Speak directly with an executive recruiter or technical consultant today.
            </p>
          </div>
        </section>

        {/* Contact Info Cards & Form Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Quick Contact Info Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/15 space-y-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Enterprise & Clients</span>
              <h3 className="text-base font-bold text-white">Client Inquiry Email</h3>
              <a href="mailto:info@vanceitsolutions.com" className="text-xs text-primary font-semibold hover:underline block">
                info@vanceitsolutions.com
              </a>
              <p className="text-[11px] text-gray-400">Response time under 2 hours during business hours.</p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/15 space-y-2">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">Talent & Careers</span>
              <h3 className="text-base font-bold text-white">Candidate Network Email</h3>
              <a href="mailto:career@vanceitsolutions.com" className="text-xs text-secondary font-semibold hover:underline block">
                career@vanceitsolutions.com
              </a>
              <p className="text-[11px] text-gray-400">Direct resume submissions & contract updates.</p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/15 space-y-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Headquarters & Social</span>
              <h3 className="text-base font-bold text-white">Wyoming, USA</h3>
              <a
                href="https://www.linkedin.com/company/vance-it-solutions-llc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-300 hover:text-primary transition-colors flex items-center gap-1.5 pt-1"
              >
                <svg className="w-4 h-4 fill-current text-primary" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                </svg>
                Connect on LinkedIn
              </a>
              <p className="text-[11px] text-gray-400">Incorporated & Compliant in Wyoming, USA.</p>
            </div>
          </div>

          {/* Tabbed Interactive Lead Capture Container */}
          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-black/60 border border-white/15 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Discovery & Intake Form</h2>
                <p className="text-xs text-gray-400 mt-1">Select your path below to initiate direct communication.</p>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex bg-darkBody p-1 rounded-xl border border-white/15">
                <button
                  onClick={() => setActiveTab('client')}
                  className={`px-5 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    activeTab === 'client'
                      ? 'bg-gradient-to-r from-primary to-secondary text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Enterprise Client Intake
                </button>
                <button
                  onClick={() => setActiveTab('candidate')}
                  className={`px-5 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    activeTab === 'candidate'
                      ? 'bg-gradient-to-r from-secondary to-primary text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Candidate Profile Drop
                </button>
              </div>
            </div>

            {/* Render Selected Form */}
            {activeTab === 'client' ? (
              <div className="space-y-4">
                <div className="text-xs text-primary font-semibold">
                  A. Enterprise Client Talent Request Form
                </div>
                <ClientForm onSuccess={() => {}} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-secondary font-semibold">
                  B. Direct Candidate Resume Drop Form
                </div>
                <CandidateForm onSuccess={() => {}} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
      <CandidateFormModal isOpen={isCandidateModalOpen} onClose={() => setIsCandidateModalOpen(false)} />
    </div>
  );
}
