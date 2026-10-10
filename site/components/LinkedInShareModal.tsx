'use client';

import { useState, useEffect } from 'react';

export interface JobPostingForShare {
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

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPostingForShare | null;
}

export default function LinkedInShareModal({ isOpen, onClose, job }: LinkedInShareModalProps) {
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customPostText, setCustomPostText] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (job) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vanceitsolutions.com';
      const fullUrl = `${origin}/candidate-hub?job=${job.id}`;
      setShareUrl(fullUrl);

      const hashtags = [
        '#Hiring',
        '#TechJobs',
        '#VanceIT',
        `#${job.category.replace(/[^a-zA-Z0-9]/g, '')}`,
        '#CareerOpportunity',
        ...job.techStack.slice(0, 3).map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`)
      ].join(' ');

      const defaultText = `🚀 We are looking for a ${job.title}!

📍 Location: ${job.location}
💼 Model: ${job.type} | Rate: ${job.rate}
⚡ Tech Stack: ${job.techStack.join(', ')}

📝 Role Summary:
${job.summary}

📌 Key Impact & Focus:
${job.impact}

Apply directly or check full role details here:
${fullUrl}

${hashtags}`;

      setCustomPostText(defaultText);
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleCopyPost = async () => {
    try {
      await navigator.clipboard.writeText(customPostText);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleOpenLinkedIn = async () => {
    try {
      await navigator.clipboard.writeText(customPostText);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 5000);
    } catch (err) {
      console.error('Failed to copy text automatically: ', err);
    }

    // Replace & with 'and' for URL query param to prevent LinkedIn query parser from truncating at &
    const safeUrlText = customPostText.replaceAll('&', 'and');
    const linkedinFeedUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(safeUrlText)}`;
    window.open(linkedinFeedUrl, '_blank', 'width=700,height=700,scrollbars=yes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-darkBody border border-white/15 rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-5 border-b border-white/10 pb-4 pr-8">
          <div className="flex items-center gap-2 text-[#70B5F9] text-xs font-bold uppercase tracking-wider">
            <svg className="w-4 h-4 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
            </svg>
            LinkedIn Job Sharing Helper
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Share &quot;{job.title}&quot;
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Easily share this job posting directly on LinkedIn or copy a formatted post caption with deep link.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-5">
          {copiedPost && (
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-xs flex items-center justify-between gap-2 animate-fade-in">
              <span>📋 <strong>Full Caption Copied to Clipboard!</strong> Just press <strong>Ctrl+V</strong> (or Paste) in LinkedIn if needed.</span>
            </div>
          )}

          {/* Job Overview Card */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-white text-sm">{job.title}</span>
              <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/30 font-semibold text-[10px]">
                {job.type} • {job.location}
              </span>
            </div>
            <div className="text-gray-300 text-[11px]">{job.rate}</div>
            <div className="flex flex-wrap gap-1 pt-1">
              {job.techStack.map((tech, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10 text-[10px]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Editable Post Draft */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-300">
                LinkedIn Post Caption Draft:
              </label>
              <span className="text-[11px] text-gray-400">Feel free to customize before copying</span>
            </div>
            <textarea
              value={customPostText}
              onChange={(e) => setCustomPostText(e.target.value)}
              rows={8}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#0A66C2] font-mono leading-relaxed resize-y"
            />
          </div>

          {/* Direct Link Box */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="overflow-hidden text-ellipsis w-full sm:w-auto">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Job Deep Link:</span>
              <span className="text-secondary font-mono text-[11px] break-all">{shareUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0 transition cursor-pointer"
            >
              {copiedLink ? '✓ Link Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
            <button
              onClick={handleCopyPost}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                copiedPost
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              {copiedPost ? (
                <>
                  <span>✓ Caption Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  <span>Copy LinkedIn Caption</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenLinkedIn}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0A66C2] hover:bg-[#084e96] text-white shadow-lg shadow-[#0A66C2]/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
              </svg>
              <span>Share Directly on LinkedIn ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
