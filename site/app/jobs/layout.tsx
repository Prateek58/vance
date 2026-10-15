import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Tech Positions & Career Opportunities | Vance IT Solutions',
  description: 'Explore premier enterprise technology contract and direct-hire opportunities. Senior Cloud, DevOps, AI/LLM, Full-Stack, and Financial Systems roles.',
  openGraph: {
    title: 'Open Tech Positions & Career Opportunities | Vance IT Solutions',
    description: 'Explore high-impact enterprise software engineering, cloud, AI, and IT consulting opportunities with transparent terms and rapid hiring.',
    url: 'https://vanceitsolutions.com/jobs',
    type: 'website',
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
