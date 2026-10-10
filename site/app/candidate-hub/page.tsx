'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CandidateForm from '../../components/CandidateForm';
import CandidateFormModal from '../../components/CandidateFormModal';
import ClientFormModal from '../../components/ClientFormModal';
import BookCallModal from '../../components/BookCallModal';
import FloatingBookCallButton from '../../components/FloatingBookCallButton';

interface JobPosting {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string;
  rate: string;
  techStack: string[];
  summary: string;
  impact: string;
  responsibilities: string[];
}

const SAMPLE_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Cloud & DevOps Architect',
    category: 'Cloud',
    location: 'Remote US',
    type: 'Contract',
    rate: '$90 - $110 / hr (W2 or C2C)',
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Python', 'CI/CD'],
    summary: 'Lead multi-region AWS cloud infrastructure migration for an enterprise fintech client.',
    impact: 'Architect zero-downtime deployment pipelines reducing deployment cycle time from days to minutes.',
    responsibilities: [
      'Design resilient AWS cloud environments using Infrastructure as Code (Terraform).',
      'Optimize Kubernetes clusters for performance and multi-tenant security.',
      'Collaborate with security teams to ensure SOC2 and ISO compliance.',
    ],
  },
  {
    id: 'job-2',
    title: 'Lead Full-Stack Next.js / Node Engineer',
    category: 'Full Stack',
    location: 'Remote US',
    type: 'Full-time',
    rate: '$155,000 - $175,000 / yr + Equity',
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    summary: 'Spearhead core customer dashboard modernization and high-performance Web Vitals delivery.',
    impact: 'Directly influence digital customer conversion across 500k+ monthly active enterprise users.',
    responsibilities: [
      'Architect micro-frontend web platforms with server-side rendering in Next.js.',
      'Develop scalable GraphQL and REST API gateway services in Node.js/TypeScript.',
      'Mentor mid-level frontend and full-stack developers on clean architectural patterns.',
    ],
  },
  {
    id: 'job-3',
    title: 'Senior AI / Data Platform Engineer',
    category: 'Data/AI',
    location: 'Hybrid (New York, NY)',
    type: 'Contract',
    rate: '$95 - $120 / hr (1099 / C2C)',
    techStack: ['Python', 'PyTorch', 'Snowflake', 'Spark', 'Databricks'],
    summary: 'Build high-throughput LLM pipeline integrations and enterprise vector database indexing.',
    impact: 'Power real-time retrieval-augmented generation (RAG) for internal enterprise intelligence tools.',
    responsibilities: [
      'Construct automated ETL/ELT pipelines using Apache Spark and Snowflake.',
      'Integrate LLM API workflows with vector search stores (Pinecone, pgvector).',
      'Ensure strict data privacy and PII masking across data pipelines.',
    ],
  },
  {
    id: 'job-4',
    title: 'Enterprise Java / Microservices Engineer',
    category: 'Backend',
    location: 'Remote US',
    type: 'Temp',
    rate: '$85 - $100 / hr (W2)',
    techStack: ['Java 17', 'Spring Boot', 'Kafka', 'Docker', 'Oracle'],
    summary: 'Execute core transaction engine refactoring for high-volume banking portal.',
    impact: 'Eliminate legacy latency bottlenecks while maintaining 99.999% availability SLAs.',
    responsibilities: [
      'Refactor monolithic legacy code into event-driven Spring Boot microservices.',
      'Implement real-time streaming architectures using Apache Kafka.',
      'Perform thorough unit, integration, and load testing for mission-critical endpoints.',
    ],
  },
  {
    id: 'job-5',
    title: 'Technical SEO Architect & Web Strategist',
    category: 'Product',
    location: 'Remote US',
    type: 'Contract',
    rate: '$75 - $95 / hr',
    techStack: ['Core Web Vitals', 'Headless CMS', 'Next.js', 'Lighthouse', 'GA4'],
    summary: 'Diagnose enterprise web assets for organic ranking authority and Core Web Vitals score optimization.',
    impact: 'Drive organic search market share growth across B2B enterprise SaaS portals.',
    responsibilities: [
      'Conduct complete technical SEO code reviews and indexability remediation.',
      'Partner with engineering teams to optimize LCP, CLS, and INP metrics.',
      'Implement structured schema architectures across large-scale web properties.',
    ],
  },
];

export default function CandidateHub() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>('job-1');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || job.location.includes(selectedLocation);
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesSearch && matchesCategory && matchesLocation && matchesType;
  });

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsCandidateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-darkBody text-white flex flex-col font-sans selection:bg-secondary selection:text-black">
      <Navbar
        onOpenClientForm={() => setIsClientModalOpen(true)}
        onOpenCandidateForm={() => {
          setSelectedJobTitle('');
          setIsCandidateModalOpen(true);
        }}
        onOpenBookCall={() => setIsBookCallModalOpen(true)}
      />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="relative pt-12 pb-16 bg-gradient-to-b from-black/70 to-darkBody border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider">
              Candidate Hub & Developer Portal
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Step Into Your Next{' '}
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                High-Impact Engagement.
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              We respect your time. When you submit your profile to Vance IT Solutions, it is reviewed by experienced technical recruiters who understand software engineering concepts, compensation benchmarks, and contract nuances.
            </p>
          </div>
        </section>

        {/* Active Opportunities & Filterable Job Board */}
        <section id="jobs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">Active Opportunities</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Active Opportunities & Job Board</h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Real-time searchable roles across premier enterprise technology teams.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Showing <span className="text-secondary font-bold">{filteredJobs.length}</span> active positions
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Keyword Search Input */}
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Search Keywords</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Role, tech stack (e.g. AWS, React)"
                  className="w-full bg-darkBody border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Skill / Discipline Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Skill / Role</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-darkBody border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Cloud">Cloud & DevOps</option>
                  <option value="Full Stack">Full Stack / Web</option>
                  <option value="Data/AI">Data & AI/ML</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Networking">Networking & Infrastructure</option>
                  <option value="Cybersecurity">Cybersecurity & InfoSec</option>
                  <option value="ERP">ERP & Enterprise Systems</option>
                  <option value="Mobile">Mobile Development</option>
                  <option value="Product">SEO & Product</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-darkBody border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                >
                  <option value="All">All Locations</option>
                  <option value="Remote">Remote US</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              {/* Employment Model Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Employment Model</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-darkBody border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                >
                  <option value="All">All Models</option>
                  <option value="Contract">Contract / 1099 / C2C</option>
                  <option value="Temp">Temp / Short-term</option>
                  <option value="Full-time">Full-time Direct Hire</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Postings List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-black/40 rounded-2xl border border-white/10">
                No matching opportunities found. Try adjusting your search query or filters, or submit a fast-track candidate profile below.
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-secondary/40 transition duration-200 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/30 text-[10px] font-bold">
                            {job.type}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10 text-[10px] font-semibold">
                            {job.location}
                          </span>
                          <span className="text-xs font-semibold text-primary">{job.rate}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                          className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white border border-white/15 rounded-lg transition cursor-pointer"
                        >
                          {isExpanded ? 'Hide Details ▲' : 'View Wireframe Details ▼'}
                        </button>
                        <button
                          onClick={() => handleApplyClick(job.title)}
                          className="px-5 py-2 text-xs font-extrabold bg-gradient-to-r from-secondary to-primary text-black rounded-lg hover:opacity-90 transition cursor-pointer shadow-md shadow-secondary/20"
                        >
                          One-Click Apply
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300">{job.summary}</p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Job Detail Wireframe Box */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4 bg-darkBody/80 p-5 rounded-xl border border-white/10 text-xs">
                        <div>
                          <span className="text-secondary font-bold uppercase tracking-wider block text-[10px] mb-1">Business Impact</span>
                          <p className="text-gray-300">{job.impact}</p>
                        </div>

                        <div>
                          <span className="text-secondary font-bold uppercase tracking-wider block text-[10px] mb-1">Key Responsibilities</span>
                          <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {job.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 flex justify-between items-center border-t border-white/10">
                          <span className="text-gray-400 text-[11px]">Direct Candidate Screening • Zero Automation Dumps</span>
                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="px-4 py-2 text-xs font-bold bg-secondary text-black rounded-lg hover:bg-secondary/80 transition cursor-pointer"
                          >
                            Apply for {job.title}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Fast-Track Candidate Drop Form */}
        <section id="fast-track" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-white/10">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Candidate Registration</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Fast-Track Candidate Profile Drop</h2>
            <p className="text-gray-300 text-sm">
              Don&apos;t see a matching role listed above? Submit your details directly into our talent network for immediate evaluation on upcoming contracts.
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-black/60 border border-secondary/30 shadow-2xl">
            <CandidateForm initialJobTitle="" onSuccess={() => {}} />
          </div>
        </section>

        {/* Contractor & Onboarding Protocol */}
        <section id="contractor-protocol" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Onboarding Protocol</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Contractor & Onboarding Protocol</h2>
            <p className="text-gray-400 text-sm max-w-2xl">
              Transparent terms, predictable payment cycles, and dedicated recruiter support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white">Flexible Contracting Models</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Full compliance support across W2 employment, 1099 independent contractor arrangements, and Corp-to-Corp (C2C) entity structures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white">Transparent Rate Benchmarks</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                We state pay rates and contract durations upfront. Zero hidden margins or deceptive compensation structures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white">Rapid Feedback & Onboarding</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Clear timeline communication after every interview round, streamlined background check verification, and prompt automated billing cycles.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
      <CandidateFormModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        initialJobTitle={selectedJobTitle}
      />
      <BookCallModal isOpen={isBookCallModalOpen} onClose={() => setIsBookCallModalOpen(false)} />

      <FloatingBookCallButton onOpenBookCall={() => setIsBookCallModalOpen(true)} />
    </div>
  );
}
