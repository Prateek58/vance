'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CandidateForm from '../../components/CandidateForm';
import CandidateFormModal from '../../components/CandidateFormModal';
import ClientFormModal from '../../components/ClientFormModal';
import BookCallModal from '../../components/BookCallModal';
import FloatingBookCallButton from '../../components/FloatingBookCallButton';
import LinkedInShareModal from '../../components/LinkedInShareModal';
import MarkdownRenderer from '../../components/MarkdownRenderer';

/**
 * JobPosting Schema aligned with upcoming Strapi CMS backend:
 * 1. Job title* (textbox)
 * 2. Job type* (contract/ contract to hire/ full time/Other)
 * 3. Location (textbox)
 * 4. Work Authorization (textbox, optional)
 * 5. Tax term (textbox, optional, e.g. W2/C2C)
 * 6. Notes (optional markdown, e.g. role summary, mission/impact)
 * 7. Job Details* (markdown textarea with key responsibilities, qualifications, etc.)
 * 8. Tech keywords / Core Technologies chips
 * + Alphanumeric Job ID (e.g. X3Yt3)
 * + Rate / Salary range (alphanumeric normal text)
 * + Automatic posted date calculation (via createdAt / createdOn for Strapi)
 */
export function formatPostedDate(input?: string | Date | null): string {
  if (!input) return 'Recent';

  // If already relative like "2d ago", "1w ago", return as is
  if (typeof input === 'string' && /^\d+[mhdwy]\s+ago$/i.test(input.trim())) {
    return input.trim();
  }

  const date = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(date.getTime())) {
    return typeof input === 'string' ? input : 'Recent';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return '1d ago';
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Dynamic ISO date generator for static mock jobs
const daysAgoIso = (days: number, hours = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

/**
 * Resolves the workplace model (Remote / Hybrid / Onsite).
 * Prioritizes explicit workplaceType, with auto-detection fallback from location text.
 */
export function getWorkplaceType(job: { workplaceType?: string; location?: string }): 'Remote' | 'Hybrid' | 'Onsite' {
  if (job.workplaceType) {
    const wt = job.workplaceType.trim().toLowerCase();
    if (wt === 'remote') return 'Remote';
    if (wt === 'hybrid') return 'Hybrid';
    if (wt === 'onsite' || wt === 'on-site') return 'Onsite';
  }
  const loc = (job.location || '').toLowerCase();
  if (loc.includes('hybrid')) return 'Hybrid';
  if (loc.includes('onsite') || loc.includes('on-site')) return 'Onsite';
  if (loc.includes('remote')) return 'Remote';
  return 'Onsite';
}

export interface JobPosting {
  id: string; // Alphanumeric code (e.g. 'X3Yt3')
  title: string; // Job title* (textbox)
  type: string; // Job type* (Contract / Contract-to-Hire / Full-time / Other)
  location: string; // Physical location / City (textbox, e.g. "San Francisco, CA", "New York, NY", "Remote US")
  workplaceType?: 'Remote' | 'Hybrid' | 'Onsite' | string; // Workplace Model (dropdown in Strapi)
  createdAt?: string; // Strapi ISO timestamp (e.g. "2026-10-15T12:00:00Z")
  createdOn?: string; // Strapi alias
  postedDate?: string; // Optional manual fallback or formatted string
  workAuthorization?: string; // Work Authorization (textbox, optional)
  taxTerm?: string; // Tax term (textbox, optional, e.g. W2/C2C)
  salaryRange?: string; // Rate / Salary Range (textbox, alphanumeric text)
  techStack?: string[]; // Core Technologies keywords chips
  notes?: string; // Notes (optional markdown formatted text)
  jobDetails: string; // Job Details* (formatted markdown text)
  category: string; // Discipline category for filtering

  // Backward compatibility fields
  rate?: string;
  eligibility?: string;
  summary?: string;
  impact?: string;
  responsibilities?: string[];
  qualifications?: string[];
}

const SAMPLE_JOBS: JobPosting[] = [
  {
    id: 'X3Yt3',
    title: 'Senior Cloud & DevOps Architect',
    category: 'Cloud',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Contract',
    createdAt: daysAgoIso(2, 4),
    postedDate: '2d ago',
    workAuthorization: 'US Citizens / GC Holders',
    taxTerm: 'W2 / C2C',
    salaryRange: '$85 - $105 / hr',
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Python', 'CI/CD'],
    notes: `**Role Summary:** Lead multi-region AWS cloud infrastructure migration for an enterprise fintech client.

**Mission & Impact:** Architect zero-downtime deployment pipelines reducing deployment cycle time from days to minutes.`,
    jobDetails: `### Key Responsibilities
- Design resilient AWS cloud environments using Infrastructure as Code (**Terraform**).
- Optimize **Kubernetes (EKS)** clusters for high throughput, auto-scaling, and multi-tenant security.
- Collaborate closely with enterprise InfoSec teams to enforce strict SOC2, PCI-DSS, and ISO compliance.
- Build automated multi-account AWS Landing Zone governance and cost-allocation frameworks.

### Qualifications & Requirements
- **7+ years** of dedicated DevOps & Cloud Infrastructure architecture experience.
- Deep hands-on mastery of AWS services, Terraform, Docker containerization, and Kubernetes orchestration.
- Proven track record with CI/CD automation tools (GitHub Actions, GitLab CI, ArgoCD).
- Excellent communication skills with both executive engineering leadership and squad engineers.`,
    summary: 'Lead multi-region AWS cloud infrastructure migration for an enterprise fintech client.',
    impact: 'Architect zero-downtime deployment pipelines reducing deployment cycle time from days to minutes.',
    responsibilities: [
      'Design resilient AWS cloud environments using Infrastructure as Code (Terraform).',
      'Optimize Kubernetes clusters for performance and multi-tenant security.',
      'Collaborate with security teams to ensure SOC2 and ISO compliance.',
    ],
  },
  {
    id: 'K9P2M',
    title: 'Lead Full-Stack Next.js / Node Engineer',
    category: 'Full Stack',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Full-time',
    createdAt: daysAgoIso(3, 2),
    postedDate: '3d ago',
    workAuthorization: 'US Citizens / GC Holders / EAD',
    taxTerm: 'Direct Hire',
    salaryRange: '$155,000 - $180,000 / yr Base + Equity',
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    notes: `**Role Summary:** Spearhead core customer dashboard modernization and high-performance Web Vitals delivery.

**Mission & Impact:** Directly influence digital customer conversion across 500k+ monthly active enterprise users.`,
    jobDetails: `### Key Responsibilities
- Architect micro-frontend web platforms with server-side rendering and static optimization in **Next.js**.
- Develop scalable GraphQL and REST API gateway microservices in **Node.js & TypeScript**.
- Mentor mid-level frontend and full-stack developers on clean architectural patterns and testing.
- Partner with product design to ship ultra-fast, accessible, and responsive user experiences.

### Qualifications & Requirements
- **6+ years** of full-stack TypeScript/JavaScript production experience.
- Deep mastery of modern Next.js App Router, React Server Components, and state management paradigms.
- Solid background in SQL (PostgreSQL) schema design, query optimization, and caching strategies (Redis).
- Passion for performance, Lighthouse auditing, and Core Web Vitals optimization.`,
    summary: 'Spearhead core customer dashboard modernization and high-performance Web Vitals delivery.',
    impact: 'Directly influence digital customer conversion across 500k+ monthly active enterprise users.',
    responsibilities: [
      'Architect micro-frontend web platforms with server-side rendering in Next.js.',
      'Develop scalable GraphQL and REST API gateway services in Node.js/TypeScript.',
      'Mentor mid-level frontend and full-stack developers on clean architectural patterns.',
    ],
  },
  {
    id: 'D4W8Q',
    title: 'Senior AI / Data Platform Engineer',
    category: 'Data/AI',
    location: 'Hybrid (New York, NY)',
    workplaceType: 'Hybrid',
    type: 'Contract',
    createdAt: daysAgoIso(4, 5),
    postedDate: '4d ago',
    workAuthorization: 'US Citizens / GC Only',
    taxTerm: 'W2',
    salaryRange: '$90 - $115 / hr',
    techStack: ['Python', 'PyTorch', 'Snowflake', 'Spark', 'Databricks'],
    notes: `**Role Summary:** Build high-throughput LLM pipeline integrations and enterprise vector database indexing.

**Mission & Impact:** Power real-time retrieval-augmented generation (RAG) for internal enterprise intelligence tools.`,
    jobDetails: `### Key Responsibilities
- Construct automated ETL/ELT pipelines using **Apache Spark**, **Databricks**, and **Snowflake**.
- Integrate production LLM API workflows with vector search stores (**Pinecone**, **pgvector**).
- Ensure strict data privacy, PII masking, and role-based data governance across all pipelines.
- Monitor data pipeline latency, embedding generation throughput, and model evaluation metrics.

### Qualifications & Requirements
- **5+ years** of data engineering and distributed computing experience.
- Proficiency with Python, PyTorch, Databricks, and modern cloud data warehouses.
- Hands-on experience deploying vector search and Retrieval-Augmented Generation (RAG) retrieval pipelines.
- Familiarity with enterprise financial or healthcare compliance protocols.`,
    summary: 'Build high-throughput LLM pipeline integrations and enterprise vector database indexing.',
    impact: 'Power real-time retrieval-augmented generation (RAG) for internal enterprise intelligence tools.',
    responsibilities: [
      'Construct automated ETL/ELT pipelines using Apache Spark and Snowflake.',
      'Integrate LLM API workflows with vector search stores (Pinecone, pgvector).',
      'Ensure strict data privacy and PII masking across data pipelines.',
    ],
  },
  {
    id: 'J7R1V',
    title: 'Enterprise Java / Microservices Engineer',
    category: 'Backend',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Contract',
    createdAt: daysAgoIso(5, 2),
    postedDate: '5d ago',
    workAuthorization: 'US Citizens / GC Holders',
    taxTerm: 'W2 / C2C',
    salaryRange: '$80 - $95 / hr',
    techStack: ['Java 17', 'Spring Boot', 'Kafka', 'Docker', 'Oracle'],
    notes: `**Role Summary:** Execute core transaction engine refactoring for high-volume banking portal.

**Mission & Impact:** Eliminate legacy latency bottlenecks while maintaining 99.999% availability SLAs.`,
    jobDetails: `### Key Responsibilities
- Refactor monolithic legacy transaction code into event-driven **Spring Boot** microservices.
- Implement real-time streaming architectures using **Apache Kafka** with strict idempotency.
- Perform thorough unit, integration, and load testing for mission-critical banking endpoints.
- Partner with database administrators to optimize complex Oracle queries and table partitions.

### Qualifications & Requirements
- **6+ years** of enterprise Java development experience (Java 11/17+, Spring Boot, Spring Cloud).
- Deep experience in distributed systems, event-driven messaging, and Apache Kafka.
- Strong SQL proficiency with enterprise relational databases (Oracle, PostgreSQL).
- Experience working under stringent SLA benchmarks in financial services or banking.`,
    summary: 'Execute core transaction engine refactoring for high-volume banking portal.',
    impact: 'Eliminate legacy latency bottlenecks while maintaining 99.999% availability SLAs.',
    responsibilities: [
      'Refactor monolithic legacy code into event-driven Spring Boot microservices.',
      'Implement real-time streaming architectures using Apache Kafka.',
      'Perform thorough unit, integration, and load testing for mission-critical endpoints.',
    ],
  },
  {
    id: 'S2L6N',
    title: 'Technical SEO Architect & Web Strategist',
    category: 'Product',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Full-time',
    createdAt: daysAgoIso(7, 4),
    postedDate: '1w ago',
    workAuthorization: 'US Citizens / GC Holders',
    taxTerm: 'Direct Hire',
    salaryRange: '$120,000 - $145,000 / yr Base',
    techStack: ['Core Web Vitals', 'Headless CMS', 'Next.js', 'Lighthouse', 'GA4'],
    notes: `**Role Summary:** Diagnose enterprise web assets for organic ranking authority and Core Web Vitals score optimization.

**Mission & Impact:** Drive organic search market share growth across B2B enterprise SaaS portals.`,
    jobDetails: `### Key Responsibilities
- Conduct complete technical SEO code reviews, schema audits, and indexability remediation.
- Partner with frontend engineering teams to optimize LCP, CLS, and INP metrics.
- Implement structured schema architectures (JSON-LD) across large-scale web properties.
- Establish automated auditing dashboards using Google Search Console and GA4 APIs.

### Qualifications & Requirements
- **4+ years** specializing in technical SEO for large-scale enterprise web applications.
- In-depth understanding of JavaScript rendering, SSR/SSG architectures in Next.js, and HTTP headers.
- Proven portfolio demonstrating multi-million organic session growth and top-percentile Core Web Vitals.`,
    summary: 'Diagnose enterprise web assets for organic ranking authority and Core Web Vitals score optimization.',
    impact: 'Drive organic search market share growth across B2B enterprise SaaS portals.',
    responsibilities: [
      'Conduct complete technical SEO code reviews and indexability remediation.',
      'Partner with engineering teams to optimize LCP, CLS, and INP metrics.',
      'Implement structured schema architectures across large-scale web properties.',
    ],
  },
  {
    id: 'N5H3T',
    title: 'Network & Desktop Support Technician',
    category: 'Networking',
    location: 'Ashburn, VA (100% Onsite)',
    workplaceType: 'Onsite',
    type: 'Full-time',
    createdAt: daysAgoIso(3, 6),
    postedDate: '3d ago',
    workAuthorization: 'US Citizens / GC Holders',
    taxTerm: 'Direct Hire',
    salaryRange: '$60,000 - $70,000 / yr Base',
    techStack: ['Cisco', 'Juniper', 'RingCentral VoIP', 'Windows OS', 'macOS', 'MSP'],
    notes: `**Role Summary:** Manage onsite Cisco & Juniper network infrastructure, coordinate with external MSP teams, and deliver VIP white-glove technical support to executive leadership and hybrid staff in Ashburn, VA.

**Mission & Impact:** Deliver seamless zero-friction IT operations for executive leadership while maintaining 99.9% onsite network rack uptime and MSP synergy.`,
    jobDetails: `### Key Responsibilities
- **Executive & VIP White-Glove Support:** Provide high-patience, premium technical assistance to executive staff, translating complex technical issues into simple, reassuring solutions.
- **Network Rack & Infrastructure Support:** Perform hands-on maintenance, provisioning, patching, and physical stack-and-rack duties for Cisco and Juniper network infrastructure.
- **MSP Coordination:** Act as the primary onsite point of contact for external Managed Service Provider (MSP) partners, collaborating on escalations and infrastructure changes.
- **Hybrid End-User Support:** Troubleshoot hardware, software, and connectivity issues for local onsite staff and remote team members.
- **VOIP Management:** Administer and maintain RingCentral VoIP communication systems, including desk phones, softphones, and executive conference rooms.
- **Multi-Platform Deployment:** Manage deployment, MDM imaging, and troubleshooting for Windows and Mac laptops, alongside office peripherals and conference room AV gear.

### Qualifications & Requirements
- **2–5 years** of experience in a dual network and desktop support role, preferably with a history of executive support.
- Hands-on experience managing and cabling physical network racks in Cisco/Juniper environments.
- Familiarity with cloud communication tools, specifically RingCentral VoIP.
- High emotional intelligence, professional demeanor, and calm problem-solving ability.`,
    summary: 'Manage onsite Cisco & Juniper network infrastructure, coordinate with external MSP teams, and deliver VIP white-glove technical support.',
    impact: 'Deliver seamless zero-friction IT operations for executive leadership while maintaining 99.9% onsite network rack uptime and MSP synergy.',
    responsibilities: [
      'Executive & VIP White-Glove Support: Provide high-patience, premium technical assistance to CEO and executive staff.',
      'Network Rack & Infrastructure Support: Perform hands-on maintenance, provisioning, and patching for Cisco and Juniper.',
      'MSP Coordination: Act as primary onsite point of contact for external MSP teams.',
    ],
  },
  {
    id: 'F8B1K',
    title: 'Financial Project Manager (Mid to Senior Level)',
    category: 'Finance & PM',
    location: 'New York, NY (100% Onsite)',
    workplaceType: 'Onsite',
    type: 'Contract-to-Hire',
    createdAt: daysAgoIso(1, 4),
    postedDate: '1d ago',
    workAuthorization: 'US Citizens / GC Only (No Sponsorship)',
    taxTerm: 'W2 / C2C',
    salaryRange: '$75 - $95 / hr',
    techStack: ['Jira', 'Confluence', 'MS Project', 'Clarity', 'Financial Governance', 'Capital Markets', 'PMP / Agile'],
    notes: `**Role Summary:** Lead complex, high-visibility financial transformation projects, regulatory compliance initiatives, and core system implementations for a premier NYC professional services and consulting firm.

**Mission & Impact:** Drive end-to-end delivery of mid-to-large scale financial initiatives while maintaining rigorous budget variance controls and corporate scope alignment.`,
    jobDetails: `### Key Responsibilities
- **Project Leadership:** End-to-end delivery of mid-to-large scale financial initiatives, ensuring alignment with corporate timeline, scope, and budget benchmarks.
- **Stakeholder & Vendor Matrix:** Act as a central hub between finance executives, operations, technology teams, and external consulting practices.
- **Governance & Reporting:** Formulate detailed project charters, master schedules, resource planning matrices, and risk assessment registries. Present health dashboards to steering committees.
- **Financial Tracking:** Control project budgets, analyze variances, track delivery-related capital expenditures, and forecast financial resource allocations.
- **Risk Mitigation:** Proactively identify bottlenecks or regulatory blockers, engineering contingency strategies to keep fast-tracked tracks moving seamlessly.

### Qualifications & Requirements
- **6–10 years** managing financial workstreams, capital markets projects, or enterprise financial systems deployment within global corporate environments.
- Mastery of project management suites (e.g., Jira, Confluence, MS Project, Clarity). Deep understanding of corporate finance operations, accounting structures, and financial compliance frameworks.
- **Locality & Work Authorization:** US Citizens or Green Card Holders Only (No sponsorship available). Must reside in the Greater New York area and commute to the Manhattan office daily.
- **Certifications (Preferred):** PMP (Project Management Professional) or Agile/Scrum certifications are highly desirable.`,
    summary: 'Lead complex, high-visibility financial transformation projects, regulatory compliance initiatives, and core system implementations.',
    impact: 'Drive end-to-end delivery of mid-to-large scale financial initiatives while maintaining rigorous budget variance controls.',
    responsibilities: [
      'Project Leadership: End-to-end delivery of mid-to-large scale financial initiatives.',
      'Stakeholder & Vendor Matrix: Act as a central hub between finance executives and tech squads.',
      'Governance & Reporting: Formulate master schedules and present health dashboards to steering committees.',
    ],
  },
  {
    id: 'B9C4E',
    title: 'Senior Financial Business Analyst',
    category: 'Finance & PM',
    location: 'New York, NY (100% Onsite)',
    workplaceType: 'Onsite',
    type: 'Contract-to-Hire',
    createdAt: daysAgoIso(2, 7),
    postedDate: '2d ago',
    workAuthorization: 'US Citizens / GC Only (No Sponsorship)',
    taxTerm: 'W2 / C2C',
    salaryRange: '$70 - $88 / hr',
    techStack: ['SQL', 'Power BI / Tableau', 'Advanced Excel', 'Visio / Signavio', 'BRD / FRD', 'Capital Markets', 'UAT'],
    notes: `**Role Summary:** Evaluate complex financial systems, dissect massive regulatory and financial data streams, and translate intricate institutional accounting challenges into structured technical specifications.

**Mission & Impact:** Serve as the primary bridge between raw corporate accounting data and advanced technical delivery squads to accelerate accurate automated financial reporting.`,
    jobDetails: `### Key Responsibilities
- **Requirements Gathering:** Conduct workshops and cross-departmental focus sessions to elicit, refine, and map comprehensive technical and functional business requirements (BRD/FRD).
- **Data Lineage & Analysis:** Query and manipulate complex relational databases using SQL to run financial reconciliations, historical data modeling, and performance variances.
- **Process Engineering:** Document current-state financial systems and engineer optimized future-state workflows to boost processing accuracy, automation, and speed.
- **System Testing Integration:** Collaborate with QA squads to formulate comprehensive test plans, validate user acceptance criteria (UAT), and troubleshoot calculations during platform migrations.
- **Executive Translation:** Condense vast analytical datasets into crisp business insights and documentation models for non-technical stakeholders and executive teams.

### Qualifications & Requirements
- **5–8 years** of experience operating as a Senior Business Analyst within a capital markets environment, investment banking institution, or global financial services sector.
- High proficiency using SQL, data visualization software (Power BI, Tableau), advanced Excel forecasting modeling, and BPMN visualization tools.
- Thorough understanding of general ledgers, sub-ledgers, global trade lifecycles, and financial reporting standards.
- **Locality & Work Authorization:** US Citizens or Green Card Holders Only (No sponsorship available). Must reside in the Greater New York area and commute to the Manhattan office daily.`,
    summary: 'Evaluate complex financial systems, dissect massive regulatory and financial data streams, and translate intricate institutional accounting challenges.',
    impact: 'Serve as the primary bridge between raw corporate accounting data and advanced technical delivery squads.',
    responsibilities: [
      'Requirements Gathering: Elicit, refine, and map comprehensive technical and functional business requirements (BRD/FRD).',
      'Data Lineage & Analysis: Query and manipulate complex relational databases using SQL.',
      'Process Engineering: Document current-state and engineer optimized future-state workflows.',
    ],
  },
  {
    id: 'A1Z7X',
    title: 'Senior AI & LLM Systems Engineer',
    category: 'Data/AI',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Full-time',
    createdAt: daysAgoIso(3, 2),
    postedDate: '3d ago',
    workAuthorization: 'US Citizens / GC Only (No Sponsorship)',
    taxTerm: 'Direct Hire',
    salaryRange: '$165,000 - $190,000 / yr Base + Benefits',
    techStack: ['LangChain', 'RAG Architecture', 'LLM Integration', 'Vector DBs (Pinecone/pgvector)', 'Python', 'FastAPI', 'OpenAI / Claude APIs'],
    notes: `**Role Summary:** Architect and scale production-grade Generative AI systems, integrating large language models (LLMs) and advanced Retrieval-Augmented Generation (RAG) pipelines using LangChain and high-performance vector databases.

**Mission & Impact:** Power enterprise-grade intelligent workflows with sub-second retrieval latency, robust hallucination mitigation, and strict data security compliance.`,
    jobDetails: `### Key Responsibilities
- **LLM & RAG Integration:** Architect end-to-end Retrieval-Augmented Generation (RAG) pipelines leveraging LangChain, LlamaIndex, and hybrid search (semantic + dense embeddings).
- **Vector Database Infrastructure:** Implement and optimize vector stores (Pinecone, pgvector, Milvus, Qdrant) for high-throughput semantic similarity queries and automated chunking.
- **Prompt Engineering & Model Orchestration:** Design complex multi-step reasoning chains, agentic workflows, and guarded prompt architectures with strict output validation.
- **Enterprise API Development:** Build high-concurrency microservices using Python (FastAPI/AsyncIO) to expose scalable inference and knowledge retrieval endpoints.
- **Evaluation & Guardrails:** Establish rigorous LLM evaluation frameworks (faithfulness, hallucination metrics, context recall) and safety guardrails across sensitive data pipelines.

### Qualifications & Requirements
- **4–7+ years** of software engineering experience with 2+ years dedicated to LLM application development, RAG frameworks, and NLP in production.
- Deep hands-on proficiency with LangChain, LlamaIndex, OpenAI/Anthropic SDKs, and Hugging Face transformers.
- Hands-on expertise with vector databases (Pinecone, Weaviate, pgvector), chunking strategies, and metadata filtering.
- **Eligibility:** US Citizens or Green Card Holders Only (No sponsorship available; 100% Remote US).`,
    summary: 'Architect and scale production-grade Generative AI systems, integrating large language models (LLMs) and advanced RAG pipelines.',
    impact: 'Power enterprise-grade intelligent workflows with sub-second retrieval latency and robust hallucination mitigation.',
    responsibilities: [
      'LLM & RAG Integration: Architect end-to-end Retrieval-Augmented Generation (RAG) pipelines.',
      'Vector Database Infrastructure: Implement and optimize vector stores for high-throughput queries.',
      'Enterprise API Development: Build high-concurrency microservices using Python (FastAPI).',
    ],
  },
  {
    id: 'P3M5D',
    title: 'Product Owner – AI Products & Intelligent Platforms',
    category: 'Product',
    location: 'Remote US',
    workplaceType: 'Remote',
    type: 'Full-time',
    createdAt: daysAgoIso(4, 1),
    postedDate: '4d ago',
    workAuthorization: 'US Citizens / GC Only (No Sponsorship)',
    taxTerm: 'Direct Hire',
    salaryRange: '$160,000 - $185,000 / yr Base + Bonus',
    techStack: ['AI Product Roadmaps', 'LLM UX & Workflows', 'RAG Functional Specs', 'Agile / Scrum', 'Jira', 'Data Analytics', 'Prompt Governance'],
    notes: `**Role Summary:** Lead product discovery, roadmap vision, and backlog execution for enterprise Generative AI and LLM-powered products, translating complex AI capabilities into intuitive, high-impact business applications.

**Mission & Impact:** Drive product-market fit and enterprise adoption for AI platforms while enforcing ethical governance, data privacy, and measurable business ROI.`,
    jobDetails: `### Key Responsibilities
- **AI Product Vision & Roadmap:** Define and execute multi-quarter roadmaps for LLM and AI-powered enterprise applications, aligning engineering milestones with user value.
- **Feature Discovery & Backlog Grooming:** Author clear epics, user stories, and acceptance criteria in Jira for RAG architectures, conversational agents, and workflow automations.
- **Cross-Functional Alignment:** Partner closely with AI/ML research engineers, software developers, UX/UI designers, and executive stakeholders to drive iterative Agile delivery.
- **Product Analytics & Quality Metrics:** Track model evaluation KPIs, user adoption, token efficiency, and customer satisfaction to continuously refine product features.
- **Governance & Ethical Standards:** Champion enterprise compliance, data privacy, bias prevention, and safety guardrails across all AI product touchpoints.

### Qualifications & Requirements
- **5–8 years** of technical product management or product ownership experience, with at least 2+ years dedicated to AI/ML or Generative AI products.
- Deep functional understanding of LLM capabilities, RAG pipelines, prompt engineering lifecycle, and AI limitations.
- Certified Scrum Product Owner (CSPO) or demonstrated track record managing complex backlogs and sprint ceremonies.
- **Eligibility:** US Citizens or Green Card Holders Only (No sponsorship available; 100% Remote US).`,
    summary: 'Lead product discovery, roadmap vision, and backlog execution for enterprise Generative AI and LLM-powered products.',
    impact: 'Drive product-market fit and enterprise adoption for AI platforms while enforcing ethical governance.',
    responsibilities: [
      'AI Product Vision & Roadmap: Define and execute multi-quarter roadmaps for LLM and AI-powered enterprise applications.',
      'Feature Discovery: Author clear epics, user stories, and acceptance criteria in Jira.',
      'Cross-Functional Alignment: Partner closely with AI/ML research engineers and executive stakeholders.',
    ],
  },
];

function JobsBoard() {
  const searchParams = useSearchParams();

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedJobForShare, setSelectedJobForShare] = useState<JobPosting | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>('X3Yt3');
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Support targeting job by alphanumeric code (e.g. ?id=X3Yt3) or legacy ID (?id=job-1)
  useEffect(() => {
    const rawTarget = searchParams.get('id') || searchParams.get('job');
    if (!rawTarget) return;

    const cleanTarget = rawTarget.toLowerCase().trim();
    const matched = SAMPLE_JOBS.find((j) => {
      const cleanId = j.id.toLowerCase().trim();
      return (
        cleanId === cleanTarget ||
        cleanId === `job-${cleanTarget}` ||
        cleanId.replace(/^job-/, '') === cleanTarget ||
        // Backward-compatibility aliases
        (cleanTarget === 'job-1' && cleanId === 'x3yt3') ||
        (cleanTarget === 'job-2' && cleanId === 'k9p2m') ||
        (cleanTarget === 'job-3' && cleanId === 'd4w8q') ||
        (cleanTarget === 'job-4' && cleanId === 'j7r1v') ||
        (cleanTarget === 'job-5' && cleanId === 's2l6n') ||
        (cleanTarget === 'job-6' && cleanId === 'n5h3t') ||
        (cleanTarget === 'job-7' && cleanId === 'f8b1k') ||
        (cleanTarget === 'job-8' && cleanId === 'b9c4e') ||
        (cleanTarget === 'job-9' && cleanId === 'a1z7x') ||
        (cleanTarget === 'job-10' && cleanId === 'p3m5d')
      );
    });

    if (matched) {
      setExpandedJobId(matched.id);
      setHighlightedJobId(matched.id);

      setSelectedCategory('All');
      setSelectedWorkplace('All');
      setSelectedType('All');
      setSearchQuery('');

      const scrollToElement = () => {
        const el = document.getElementById(matched.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      const t1 = setTimeout(scrollToElement, 150);
      const t2 = setTimeout(scrollToElement, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [searchParams]);

  const highlightedJob = useMemo(() => {
    if (!highlightedJobId) return null;
    return SAMPLE_JOBS.find((j) => j.id === highlightedJobId) || null;
  }, [highlightedJobId]);

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const query = searchQuery.toLowerCase();
    const dateStr = formatPostedDate(job.createdAt || job.createdOn || job.postedDate).toLowerCase();
    const workplace = getWorkplaceType(job).toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(query) ||
      job.id.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      workplace.includes(query) ||
      dateStr.includes(query) ||
      (job.notes && job.notes.toLowerCase().includes(query)) ||
      job.jobDetails.toLowerCase().includes(query) ||
      (job.techStack && job.techStack.some((tech) => tech.toLowerCase().includes(query)));

    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesWorkplace = selectedWorkplace === 'All' || workplace === selectedWorkplace.toLowerCase();
    const matchesType =
      selectedType === 'All' ||
      job.type === selectedType ||
      (selectedType === 'Contract' && job.type.includes('Contract'));

    return matchesSearch && matchesCategory && matchesWorkplace && matchesType;
  });

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsCandidateModalOpen(true);
  };

  const handleShareClick = (job: JobPosting) => {
    setSelectedJobForShare(job);
    setIsShareModalOpen(true);
  };

  const clearSelection = () => {
    setHighlightedJobId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      url.searchParams.delete('job');
      window.history.replaceState({}, '', url.pathname);
    }
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

      {/* Direct-Linked Job Top Banner Notification */}
      {highlightedJob && (
        <div className="sticky top-16 sm:top-20 z-40 bg-black/95 backdrop-blur-md border-b border-secondary/40 px-4 py-3 shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-secondary text-black font-bold text-[10px] uppercase tracking-wider shrink-0">
                Selected
              </span>
              <span className="text-gray-200">
                Viewing: <strong className="text-secondary font-semibold">{highlightedJob.title}</strong>{' '}
                <span className="text-primary font-mono text-[11px]">[{highlightedJob.id}]</span>{' '}
                <span className="text-gray-400">({highlightedJob.location} • {highlightedJob.type})</span>
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleApplyClick(highlightedJob.title)}
                className="px-4 py-1.5 rounded-lg bg-secondary text-black font-bold text-xs hover:bg-secondary/90 transition shadow-md shadow-secondary/20 cursor-pointer"
              >
                Apply for this Role
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs transition cursor-pointer"
              >
                View all positions
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Page Header */}
        <section className="relative pt-12 pb-16 bg-gradient-to-b from-black/70 to-darkBody border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider">
              Career Opportunities & Job Board
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
                  placeholder="Role, city (e.g. San Francisco), Job ID, tech"
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
                  <option value="Product">Product & Technical Strategy</option>
                  <option value="Cybersecurity">Cybersecurity & InfoSec</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Workplace Model Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Workplace Model</label>
                <select
                  value={selectedWorkplace}
                  onChange={(e) => setSelectedWorkplace(e.target.value)}
                  className="w-full bg-darkBody border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                >
                  <option value="All">All Workplace Models</option>
                  <option value="Remote">Remote</option>
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
                  <option value="Full-time">Full-time Direct Hire</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table Header for Compact Clean Layout */}
          <div className="hidden lg:grid grid-cols-[minmax(0,3.2fr)_85px_minmax(0,2.5fr)_minmax(0,1.3fr)_80px_auto] gap-4 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 items-center">
            <div>Job Title</div>
            <div>Job ID</div>
            <div>Location</div>
            <div>Type</div>
            <div>Posted</div>
            <div className="text-right pr-1">Apply & Details</div>
          </div>

          {/* Job Postings List */}
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-black/40 rounded-2xl border border-white/10">
                No matching opportunities found. Try adjusting your search query or filters, or submit a fast-track candidate profile below.
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const isTargetHighlight = highlightedJobId === job.id;
                const displayPostedDate = formatPostedDate(job.createdAt || job.createdOn || job.postedDate);

                // Check if any specs exist to show below key responsibilities
                const hasSpecs = Boolean(
                  job.workAuthorization ||
                  job.taxTerm ||
                  job.salaryRange ||
                  job.location ||
                  job.type ||
                  job.id
                );

                return (
                  <div
                    key={job.id}
                    id={job.id}
                    className={`scroll-mt-24 sm:scroll-mt-28 rounded-2xl transition-all duration-300 ${isTargetHighlight
                      ? 'bg-gradient-to-br from-secondary/15 via-black/80 to-black/60 border-2 border-secondary shadow-[0_0_35px_rgba(0,231,175,0.25)] ring-1 ring-secondary/50'
                      : 'bg-black/40 border border-white/10 hover:border-secondary/40'
                      }`}
                  >
                    {/* Highlighted Badge Inside Card */}
                    {isTargetHighlight && (
                      <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-secondary/20 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-semibold tracking-wide">
                          Selected Direct-Linked Role
                        </span>
                        <button
                          onClick={clearSelection}
                          className="text-gray-400 hover:text-white underline cursor-pointer text-[11px]"
                        >
                          View all roles
                        </button>
                      </div>
                    )}

                    {/* COMPACT VIEW ROW:
                        Job Title | JobID | Location | Type | Posted | Apply
                        Optimized column sizing: Job ID is compact (85px), Location and Type have ample breathing room.
                    */}
                    <div className="p-4 sm:p-5">
                      {/* Desktop Grid Layout (lg+) */}
                      <div className="hidden lg:grid grid-cols-[minmax(0,3.2fr)_85px_minmax(0,2.5fr)_minmax(0,1.3fr)_80px_auto] gap-4 items-center">
                        {/* Title */}
                        <div className="pr-2 min-w-0">
                          <button
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="text-left group cursor-pointer"
                          >
                            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                              {job.title}
                            </h3>
                            <span className="text-[11px] text-gray-400">
                              {job.category}
                            </span>
                          </button>
                        </div>

                        {/* Job ID (Alphanumeric Code, e.g. X3Yt3) */}
                        <div>
                          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-primary">
                            <span className="text-[10px] text-gray-400 font-sans">ID:</span>
                            {job.id}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="text-xs text-gray-300 flex items-center gap-1.5 min-w-0">
                          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate" title={job.location}>{job.location}</span>
                        </div>

                        {/* Type */}
                        <div className="text-xs text-gray-300 font-medium truncate" title={job.type}>
                          {job.type}
                        </div>

                        {/* Posted (Automatically calculated) */}
                        <div suppressHydrationWarning className="text-xs text-gray-400 font-mono whitespace-nowrap">
                          {displayPostedDate}
                        </div>

                        {/* Actions (Button Seq: View Details, Apply Now) */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                          <button
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-200 hover:text-white border border-white/20 hover:border-secondary/60 rounded-lg transition-all cursor-pointer whitespace-nowrap bg-white/5 hover:bg-white/10"
                            title="Toggle job details"
                          >
                            {isExpanded ? 'Hide ▲' : 'View ▼'}
                          </button>
                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="px-3.5 py-1.5 text-xs font-bold bg-secondary text-black rounded-lg hover:bg-secondary/85 transition shadow-sm shadow-secondary/20 cursor-pointer whitespace-nowrap"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>

                      {/* Mobile / Tablet Layout (< lg) */}
                      <div className="lg:hidden flex flex-col space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-primary mb-1">
                              <span className="text-[10px] text-gray-400 font-sans">ID:</span>
                              {job.id}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                              {job.title}
                            </h3>
                          </div>
                          <span suppressHydrationWarning className="text-[10px] text-gray-400 font-mono shrink-0 pt-1">
                            {displayPostedDate}
                          </span>
                        </div>

                        {/* Clean minimal info row */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-300">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span>{job.type}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">{job.category}</span>
                        </div>

                        {/* Button Sequence: View Details, Apply Now */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                            className="flex-1 py-2 text-xs font-semibold text-gray-200 hover:text-white border border-white/20 rounded-lg text-center transition cursor-pointer bg-white/5"
                          >
                            {isExpanded ? 'Hide ▲' : 'Show ▼'}
                          </button>
                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="flex-1 py-2 text-xs font-bold bg-secondary text-black rounded-lg hover:bg-secondary/85 text-center transition cursor-pointer shadow-sm shadow-secondary/20"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED VIEW:
                        - Core Technologies (chips)
                        - Notes (optional, markdown formatted - replaces two-column box)
                        - Job Details (markdown formatted text with Key Responsibilities, Qualifications)
                        - Specifications below key responsibilities (Work Authorization, Tax Term, Salary Range, Location, Type, Job ID)
                        - Bottom Actions: Share on LinkedIn, Apply for Role
                    */}
                    {isExpanded && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-white/10 space-y-5 text-xs animate-fade-in">
                        {/* 1. Core Technologies Chips */}
                        {job.techStack && job.techStack.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Core Technologies
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.techStack.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-md bg-white/5 text-gray-200 border border-white/10 text-[11px] font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Notes (Optional Markdown formatted text - e.g. Role Summary, Mission & Impact) */}
                        {job.notes && (
                          <div className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-primary/70 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              Role Context & Overview
                            </span>
                            <MarkdownRenderer content={job.notes} />
                          </div>
                        )}

                        {/* 3. Job Details (Markdown formatted text) */}
                        <div className="space-y-1.5">
                          <MarkdownRenderer content={job.jobDetails} />
                        </div>

                        {/* 4. Specifications & Terms Section (Placed below Key Responsibilities / Job Details)
                            Includes: Work Authorization, Tax Term, Rate / Salary Range, etc.
                            Shown dynamically only if value is provided / non-empty.
                        */}
                        {hasSpecs && (
                          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                                Engagement Specifications & Terms
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {job.workAuthorization && (
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                    Work Authorization
                                  </span>
                                  <p className="text-xs text-white font-medium">{job.workAuthorization}</p>
                                </div>
                              )}
                              {job.taxTerm && (
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                    Tax Term
                                  </span>
                                  <p className="text-xs text-white font-medium">{job.taxTerm}</p>
                                </div>
                              )}
                              {job.salaryRange && (
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                    Rate / Salary Range
                                  </span>
                                  <p className="text-xs text-primary font-semibold">{job.salaryRange}</p>
                                </div>
                              )}
                              {job.location && (
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                    Location / City
                                  </span>
                                  <p className="text-xs text-gray-200 font-medium">{job.location}</p>
                                </div>
                              )}
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                  Workplace Model
                                </span>
                                <p className="text-xs text-white font-medium">{getWorkplaceType(job)}</p>
                              </div>
                              {job.type && (
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                    Employment Model
                                  </span>
                                  <p className="text-xs text-gray-200 font-medium">{job.type}</p>
                                </div>
                              )}
                              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                                <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                                  Job ID
                                </span>
                                <p className="text-xs font-mono text-secondary font-bold">{job.id}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. Bottom Actions inside Expanded Card (Share on LinkedIn lives here) */}
                        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                          <span className="text-gray-400 text-[11px]">
                            Direct Candidate Screening • Verified Enterprise Engagement
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShareClick(job)}
                              className="px-3.5 py-2 text-xs font-semibold text-[#70B5F9] bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/30 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                              title="Share this role on LinkedIn"
                            >
                              <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                              </svg>
                              <span>Share on LinkedIn</span>
                            </button>
                            <button
                              onClick={() => handleApplyClick(job.title)}
                              className="px-4 py-2 text-xs font-bold bg-secondary text-black rounded-lg hover:bg-secondary/80 transition cursor-pointer shadow-md shadow-secondary/20"
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

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-darkBody flex items-center justify-center text-gray-400 text-sm">
          Loading positions...
        </div>
      }
    >
      <JobsBoard />
    </Suspense>
  );
}
