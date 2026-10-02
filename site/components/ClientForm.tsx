'use client';

import { useState } from 'react';

interface ClientFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function ClientForm({ onSuccess, className = '' }: ClientFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    orgWebsite: '',
    managerName: '',
    email: '',
    engagementType: 'Direct Placement',
    techStack: '',
    startDate: 'Immediate',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className={`text-center py-10 space-y-4 ${className}`}>
        <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-white">Talent Request Received</h3>
        <p className="text-gray-300 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
          Thank you, <span className="text-white font-medium">{formData.managerName || 'Hiring Leader'}</span>. A senior technical strategist from Vance IT Solutions will contact you at <span className="text-primary font-medium">{formData.email}</span> within 2 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 px-5 py-2 text-xs font-bold bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-sm ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Organization Name *</label>
          <input
            type="text"
            required
            value={formData.orgName}
            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
            placeholder="Acme Corp"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Company Website</label>
          <input
            type="url"
            value={formData.orgWebsite}
            onChange={(e) => setFormData({ ...formData, orgWebsite: e.target.value })}
            placeholder="https://example.com"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Hiring Manager Name *</label>
          <input
            type="text"
            required
            value={formData.managerName}
            onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Corporate Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Engagement Type</label>
          <select
            value={formData.engagementType}
            onChange={(e) => setFormData({ ...formData, engagementType: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary text-xs"
          >
            <option value="Direct Placement">Direct Hire / Permanent Search</option>
            <option value="Temp / Contract">Temp / Contract Sourcing</option>
            <option value="Contract-to-Hire">Contract-to-Hire Placement</option>
            <option value="IT Consulting">IT Consulting & Architecture Advisory</option>
            <option value="Custom Web Project">Custom Web & Enterprise Software Development</option>
            <option value="Digital Marketing & SEO">Digital Marketing & SEO Architecture</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Desired Start Date & Duration</label>
          <select
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary text-xs"
          >
            <option value="Immediate">Immediate (&lt; 48 hours turnaround)</option>
            <option value="Within 2 Weeks">Within 2 Weeks</option>
            <option value="30 Days">30 Days</option>
            <option value="Q3/Q4 Planning">Quarterly Strategic Planning</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">Target Tech Stack & Role Details *</label>
        <textarea
          required
          rows={3}
          value={formData.techStack}
          onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          placeholder="e.g. Senior Cloud Architect (AWS, Terraform, Kubernetes) or Senior Full-Stack Engineer (React, Node, PostgreSQL)."
          className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-lg hover:opacity-90 transition shadow-md shadow-primary/20 text-xs tracking-wide cursor-pointer"
        >
          Submit Enterprise Talent Request
        </button>
      </div>
    </form>
  );
}
