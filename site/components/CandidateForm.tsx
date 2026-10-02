'use client';

import { useState, useEffect } from 'react';

interface CandidateFormProps {
  onSuccess?: () => void;
  initialJobTitle?: string;
  className?: string;
}

export default function CandidateForm({ onSuccess, initialJobTitle = '', className = '' }: CandidateFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    discipline: 'Full-Stack / Web Development',
    workModel: 'W2',
    targetRate: '',
    linkedinUrl: '',
    githubUrl: '',
    targetRole: initialJobTitle,
  });

  useEffect(() => {
    if (initialJobTitle) {
      setFormData((prev) => ({ ...prev, targetRole: initialJobTitle }));
    }
  }, [initialJobTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className={`text-center py-10 space-y-4 ${className}`}>
        <div className="w-14 h-14 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-white">Profile Submitted</h3>
        <p className="text-gray-300 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
          Thank you, <span className="text-white font-medium">{formData.fullName}</span>. Your technical profile has been logged into the Vance Talent Network. Our recruiting leads will contact you at <span className="text-secondary font-medium">{formData.email}</span> when matching opportunities arise.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 px-5 py-2 text-xs font-bold bg-secondary/20 text-secondary border border-secondary/40 rounded-lg hover:bg-secondary/30 transition cursor-pointer"
        >
          Submit Another Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-sm ${className}`}>
      {formData.targetRole && (
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-xs text-secondary font-semibold">
          Applying for Position: {formData.targetRole}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Jane Smith"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Primary Discipline *</label>
          <select
            value={formData.discipline}
            onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-secondary text-xs"
          >
            <option value="Full-Stack / Web Development">Full-Stack / Web Development</option>
            <option value="Cloud Architecture / DevOps">Cloud Architecture / DevOps</option>
            <option value="Data Engineering / AI & ML">Data Engineering / AI & ML</option>
            <option value="Backend Development (Java/Go/Node)">Backend Development (Java/Go/Node)</option>
            <option value="Technical SEO & Performance">Technical SEO & Performance</option>
            <option value="IT Consulting & Management">IT Consulting & Management</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Preferred Work Model</label>
          <select
            value={formData.workModel}
            onChange={(e) => setFormData({ ...formData, workModel: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-secondary text-xs"
          >
            <option value="W2">W2 Employee</option>
            <option value="1099">1099 Independent Contractor</option>
            <option value="Corp-to-Corp / C2C">Corp-to-Corp / C2C</option>
            <option value="Direct Hire / Full-Time">Direct Hire / Full-Time</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Desired Hourly Rate / Target ($)</label>
          <input
            type="text"
            value={formData.targetRate}
            onChange={(e) => setFormData({ ...formData, targetRate: e.target.value })}
            placeholder="e.g. $85/hr or $140k/yr"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn Profile URL</label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">GitHub / Portfolio URL</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/username"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Upload Resume / CV (.pdf, .docx)</label>
        <input
          type="file"
          accept=".pdf,.docx,.doc"
          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary/20 file:text-secondary hover:file:bg-secondary/30 border border-white/15 rounded-lg bg-black/50"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-black font-extrabold rounded-lg hover:opacity-90 transition shadow-md shadow-secondary/20 text-xs tracking-wide cursor-pointer"
        >
          Fast-Track Resume & Profile Submission
        </button>
      </div>
    </form>
  );
}
