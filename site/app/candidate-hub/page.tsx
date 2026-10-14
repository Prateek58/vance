'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CandidateForm from '../../components/CandidateForm';
import CandidateFormModal from '../../components/CandidateFormModal';
import ClientFormModal from '../../components/ClientFormModal';
import BookCallModal from '../../components/BookCallModal';
import FloatingBookCallButton from '../../components/FloatingBookCallButton';
import LinkedInShareModal from '../../components/LinkedInShareModal';

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
  qualifications?: string[];
  eligibility?: string;
}

const SAMPLE_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Cloud & DevOps Architect',
    category: 'Cloud',
    location: 'Remote US',
    type: 'Contract',
    rate: 'W2',
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
    rate: 'Direct Hire',
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
    rate: 'W2',
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
    type: 'Contract',
    rate: 'W2',
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
    type: 'Full-time',
    rate: 'Direct Hire',
    techStack: ['Core Web Vitals', 'Headless CMS', 'Next.js', 'Lighthouse', 'GA4'],
    summary: 'Diagnose enterprise web assets for organic ranking authority and Core Web Vitals score optimization.',
    impact: 'Drive organic search market share growth across B2B enterprise SaaS portals.',
    responsibilities: [
      'Conduct complete technical SEO code reviews and indexability remediation.',
      'Partner with engineering teams to optimize LCP, CLS, and INP metrics.',
      'Implement structured schema architectures across large-scale web properties.',
    ],
  },
  {
    id: 'job-6',
    title: 'Network & Desktop Support Technician',
    category: 'Networking',
    location: 'Ashburn, VA (100% Onsite)',
    type: 'Full-time',
    rate: '$60,000 - $70,000 / yr Base',
    techStack: ['Cisco', 'Juniper', 'RingCentral VoIP', 'Windows OS', 'macOS', 'MSP'],
    summary: 'Manage onsite Cisco & Juniper network infrastructure, coordinate with external MSP teams, and deliver VIP white-glove technical support to executive leadership and hybrid staff in Ashburn, VA.',
    impact: 'Deliver seamless zero-friction IT operations for executive leadership while maintaining 99.9% onsite network rack uptime and MSP synergy.',
    responsibilities: [
      'Executive & VIP White-Glove Support: Provide high-patience, premium technical assistance to the CEO and executive staff, translating complex technical issues into simple, reassuring solutions for non-technical users.',
      'Network Rack & Infrastructure Support: Perform hands-on maintenance, provisioning, patching, and physical stack-and-rack duties for our Cisco and Juniper network infrastructure.',
      'MSP Coordination: Act as the primary onsite point of contact for our external Managed Service Provider (MSP), collaborating on escalations, complex network troubleshooting, and strategic projects.',
      'Hybrid End-User Support: Troubleshoot hardware, software, and connectivity issues for both local onsite staff and remote teams.',
      'VOIP Management: Administer and maintain our RingCentral VoIP communication systems, including desk phones, softphones, and meeting room configurations.',
      'Multi-Platform & Peripheral Support: Manage deployment, imaging, and troubleshooting for Windows and Mac laptops, alongside office peripherals such as printers, scanners, and conference room AV gear.',
    ],
    qualifications: [
      'Experience: 2–5 years of experience in a dual network and desktop support role, preferably with a history of supporting corporate executives.',
      'Technical Skills: Hands-on experience managing and cabling physical network racks (Cisco and Juniper environment).',
      'Cloud Communications: Familiarity with cloud communication tools, specifically RingCentral VoIP.',
      'Multi-Platform Support: Proficiency in supporting both Windows OS and macOS endpoints and office peripherals.',
      'Collaboration: Proven experience working alongside an external MSP or third-party vendor network team.',
      'Soft Skills: Exceptional patience, communication, and emotional intelligence. Ability to remain calm and professional while providing "white-glove" support to less tech-savvy users.',
    ],
  },
  {
    id: 'job-7',
    title: 'Financial Project Manager (Mid to Senior Level)',
    category: 'Finance & PM',
    location: 'New York, NY (100% Onsite)',
    type: 'Contract-to-Hire',
    rate: 'W2 / C2C',
    eligibility: 'US Citizens / GC Only (No Sponsorship)',
    techStack: ['Jira', 'Confluence', 'MS Project', 'Clarity', 'Financial Governance', 'Capital Markets', 'PMP / Agile'],
    summary: 'Lead complex, high-visibility financial transformation projects, regulatory compliance initiatives, and core system implementations for a premier NYC professional services and consulting firm.',
    impact: 'Drive end-to-end delivery of mid-to-large scale financial initiatives while maintaining rigorous budget variance controls and corporate scope alignment.',
    responsibilities: [
      'Project Leadership: End-to-end delivery of mid-to-large scale financial initiatives, ensuring alignment with corporate timeline, scope, and budget benchmarks.',
      'Stakeholder & Vendor Matrix: Act as a central hub between finance executives, operations, technology teams, and external consulting practices.',
      'Governance & Reporting: Formulate detailed project charters, master schedules, resource planning matrices, and risk assessment registries. Present health dashboards to steering committees.',
      'Financial Tracking: Control project budgets, analyze variances, track delivery-related capital expenditures, and forecast financial resource allocations.',
      'Risk Mitigation: Proactively identify bottlenecks or regulatory blockers, engineering contingency strategies to keep fast-tracked tracks moving seamlessly.',
    ],
    qualifications: [
      'Experience: 6–10 years managing financial workstreams, capital markets projects, or enterprise financial systems deployment within global corporate environments.',
      'Technical Foundations: Mastery of project management suites (e.g., Jira, Confluence, MS Project, Clarity). Deep understanding of corporate finance operations, accounting structures, and financial compliance frameworks.',
      'Locality & Work Authorization: US Citizens or Green Card Holders Only (No sponsorship available). Must reside in the Greater New York area and commute to the Manhattan office daily.',
      'Certifications (Preferred): PMP (Project Management Professional) or Agile/Scrum certifications are highly desirable.',
    ],
  },
  {
    id: 'job-8',
    title: 'Senior Financial Business Analyst',
    category: 'Finance & PM',
    location: 'New York, NY (100% Onsite)',
    type: 'Contract-to-Hire',
    rate: 'W2 / C2C',
    eligibility: 'US Citizens / GC Only (No Sponsorship)',
    techStack: ['SQL', 'Power BI / Tableau', 'Advanced Excel', 'Visio / Signavio', 'BRD / FRD', 'Capital Markets', 'UAT'],
    summary: 'Evaluate complex financial systems, dissect massive regulatory and financial data streams, and translate intricate institutional accounting challenges into structured technical specifications.',
    impact: 'Serve as the primary bridge between raw corporate accounting data and advanced technical delivery squads to accelerate accurate automated financial reporting.',
    responsibilities: [
      'Requirements Gathering: Conduct workshops and cross-departmental focus sessions to elicit, refine, and map comprehensive technical and functional business requirements (BRD/FRD).',
      'Data Lineage & Analysis: Query and manipulate complex relational databases using SQL to run financial reconciliations, historical data modeling, and performance variances.',
      'Process Engineering: Document current-state financial systems and engineer optimized future-state workflows to boost processing accuracy, automation, and speed.',
      'System Testing Integration: Collaborate with QA squads to formulate comprehensive test plans, validate user acceptance criteria (UAT), and troubleshoot calculations during platform migrations.',
      'Executive Translation: Condense vast analytical datasets into crisp business insights and documentation models for non-technical stakeholders and executive teams.',
    ],
    qualifications: [
      'Experience: 5–8 years of experience operating as a Senior Business Analyst within a capital markets environment, investment banking institution, or global financial services sector.',
      'Technical Foundations: High proficiency using SQL, data visualization software (e.g., Power BI, Tableau), advanced Excel forecasting modeling, and BPMN visualization tools (Visio/Signavio).',
      'Industry Knowledge: Thorough understanding of general ledgers, sub-ledgers, global trade lifecycles, and financial reporting standards.',
      'Locality & Work Authorization: US Citizens or Green Card Holders Only (No sponsorship available). Must reside in the Greater New York area and commute to the Manhattan office daily.',
    ],
  },
  {
    id: 'job-9',
    title: 'Senior AI & LLM Systems Engineer',
    category: 'Data/AI',
    location: 'Remote US',
    type: 'Full-time',
    rate: '$165,000 - $190,000 / yr Base + Benefits',
    eligibility: 'US Citizens / GC Only (No Sponsorship)',
    techStack: ['LangChain', 'RAG Architecture', 'LLM Integration', 'Vector DBs (Pinecone/pgvector)', 'Python', 'FastAPI', 'OpenAI / Claude APIs'],
    summary: 'Architect and scale production-grade Generative AI systems, integrating large language models (LLMs) and advanced Retrieval-Augmented Generation (RAG) pipelines using LangChain and high-performance vector databases.',
    impact: 'Power enterprise-grade intelligent workflows with sub-second retrieval latency, robust hallucination mitigation, and strict data security compliance.',
    responsibilities: [
      'LLM & RAG Integration: Architect end-to-end Retrieval-Augmented Generation (RAG) pipelines leveraging LangChain, LlamaIndex, and hybrid search (semantic + dense embeddings).',
      'Vector Database Infrastructure: Implement and optimize vector stores (Pinecone, pgvector, Milvus, Qdrant) for high-throughput semantic similarity queries and automated chunking.',
      'Prompt Engineering & Model Orchestration: Design complex multi-step reasoning chains, agentic workflows, and guarded prompt architectures with strict output validation.',
      'Enterprise API Development: Build high-concurrency microservices using Python (FastAPI/AsyncIO) to expose scalable inference and knowledge retrieval endpoints.',
      'Evaluation & Guardrails: Establish rigorous LLM evaluation frameworks (faithfulness, hallucination metrics, context recall) and safety guardrails across sensitive data pipelines.',
    ],
    qualifications: [
      'Experience: 4–7+ years of software engineering experience with 2+ years dedicated to LLM application development, RAG frameworks, and NLP in production.',
      'Core Frameworks: Deep hands-on proficiency with LangChain, LlamaIndex, OpenAI/Anthropic SDKs, and Hugging Face transformers.',
      'Vector & Data Engineering: Hands-on expertise with vector databases (Pinecone, Weaviate, pgvector), chunking strategies, and metadata filtering.',
      'Eligibility: US Citizens or Green Card Holders Only (No sponsorship available; 100% Remote US).',
    ],
  },
  {
    id: 'job-10',
    title: 'Product Owner – AI Products & Intelligent Platforms',
    category: 'Product',
    location: 'Remote US',
    type: 'Full-time',
    rate: '$160,000 - $185,000 / yr Base + Bonus',
    eligibility: 'US Citizens / GC Only (No Sponsorship)',
    techStack: ['AI Product Roadmaps', 'LLM UX & Workflows', 'RAG Functional Specs', 'Agile / Scrum', 'Jira', 'Data Analytics', 'Prompt Governance'],
    summary: 'Lead product discovery, roadmap vision, and backlog execution for enterprise Generative AI and LLM-powered products, translating complex AI capabilities into intuitive, high-impact business applications.',
    impact: 'Drive product-market fit and enterprise adoption for AI platforms while enforcing ethical governance, data privacy, and measurable business ROI.',
    responsibilities: [
      'AI Product Vision & Roadmap: Define and execute multi-quarter roadmaps for LLM and AI-powered enterprise applications, aligning engineering milestones with user value.',
      'Feature Discovery & Backlog Grooming: Author clear epics, user stories, and acceptance criteria in Jira for RAG architectures, conversational agents, and workflow automations.',
      'Cross-Functional Alignment: Partner closely with AI/ML research engineers, software developers, UX/UI designers, and executive stakeholders to drive iterative Agile delivery.',
      'Product Analytics & Quality Metrics: Track model evaluation KPIs, user adoption, token efficiency, and customer satisfaction to continuously refine product features.',
      'Governance & Ethical Standards: Champion enterprise compliance, data privacy, bias prevention, and safety guardrails across all AI product touchpoints.',
    ],
    qualifications: [
      'Experience: 5–8 years of technical product management or product ownership experience, with at least 2+ years dedicated to AI/ML or Generative AI products.',
      'Domain Expertise: Deep functional understanding of LLM capabilities, RAG pipelines, prompt engineering lifecycle, and AI limitations.',
      'Agile Leadership: Certified Scrum Product Owner (CSPO) or demonstrated track record managing complex backlogs and sprint ceremonies.',
      'Eligibility: US Citizens or Green Card Holders Only (No sponsorship available; 100% Remote US).',
    ],
  },
];

export default function CandidateHub() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedJobForShare, setSelectedJobForShare] = useState<JobPosting | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>('job-1');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetJob = params.get('job');
      if (targetJob) {
        setExpandedJobId(targetJob);
        setTimeout(() => {
          const el = document.getElementById(targetJob);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
    }
  }, []);

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || job.location.includes(selectedLocation);
    const matchesType =
      selectedType === 'All' ||
      job.type === selectedType ||
      (selectedType === 'Contract' && job.type.includes('Contract'));

    return matchesSearch && matchesCategory && matchesLocation && matchesType;
  });

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsCandidateModalOpen(true);
  };

  const handleShareClick = (job: JobPosting) => {
    setSelectedJobForShare(job);
    setIsShareModalOpen(true);
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
                  <option value="Finance & PM">Finance & Project Management</option>
                  <option value="Cybersecurity">Cybersecurity & InfoSec</option>
                  <option value="ERP">ERP & Enterprise Systems</option>
                  <option value="Mobile">Mobile Development</option>
                  <option value="Product">Product & Technical Strategy</option>
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
                  <option value="Contract-to-Hire">Contract-to-Hire</option>
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
                    id={job.id}
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
                          {job.eligibility && (
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                              {job.eligibility}
                            </span>
                          )}
                          {job.rate && (
                            <span className="text-xs font-semibold text-primary">{job.rate}</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => handleShareClick(job)}
                          title="Share this job on LinkedIn"
                          className="px-3 py-2 text-xs font-semibold bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 text-[#70B5F9] border border-[#0A66C2]/40 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                          </svg>
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                          className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white border border-white/15 rounded-lg transition cursor-pointer"
                        >
                          {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
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
                        {job.eligibility && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-amber-300">Eligibility & Clearance: </span>
                              <span>{job.eligibility}</span>
                            </div>
                            <span className="text-[11px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                              {job.location.includes('Onsite') ? 'Daily Onsite Commute Required' : '100% Remote US'}
                            </span>
                          </div>
                        )}

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

                        {job.qualifications && job.qualifications.length > 0 && (
                          <div>
                            <span className="text-secondary font-bold uppercase tracking-wider block text-[10px] mb-1">Qualifications & Skills</span>
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                              {job.qualifications.map((qual, idx) => (
                                <li key={idx}>{qual}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
                          <span className="text-gray-400 text-[11px]">Direct Candidate Screening • Zero Automation Dumps</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShareClick(job)}
                              className="px-3.5 py-2 text-xs font-semibold text-[#70B5F9] bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/30 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                              </svg>
                              <span>Share on LinkedIn</span>
                            </button>
                            <button
                              onClick={() => handleApplyClick(job.title)}
                              className="px-4 py-2 text-xs font-bold bg-secondary text-black rounded-lg hover:bg-secondary/80 transition cursor-pointer"
                            >
                              Apply for {job.title}
                            </button>
                          </div>
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
            <CandidateForm initialJobTitle="" onSuccess={() => { }} />
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
      <LinkedInShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        job={selectedJobForShare}
      />

      <FloatingBookCallButton onOpenBookCall={() => setIsBookCallModalOpen(true)} />
    </div>
  );
}
