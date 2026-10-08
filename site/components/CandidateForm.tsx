'use client';

import { useState, useEffect } from 'react';

interface CandidateFormProps {
  onSuccess?: () => void;
  initialJobTitle?: string;
  className?: string;
}

const COUNTRY_CODES = [
  { code: '+1', label: '🇺🇸 +1 (US)' },
  { code: '+1-CA', label: '🇨🇦 +1 (CA)' },
  { code: '+44', label: '🇬🇧 +44 (UK)' },
  { code: '+91', label: '🇮🇳 +91 (IN)' },
  { code: '+61', label: '🇦🇺 +61 (AU)' },
  { code: '+49', label: '🇩🇪 +49 (DE)' },
  { code: '+33', label: '🇫🇷 +33 (FR)' },
  { code: '+81', label: '🇯🇵 +81 (JP)' },
  { code: '+86', label: '🇨🇳 +86 (CN)' },
  { code: '+65', label: '🇸🇬 +65 (SG)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+966', label: '🇸🇦 +966 (SA)' },
  { code: '+353', label: '🇮🇪 +353 (IE)' },
  { code: '+31', label: '🇳🇱 +31 (NL)' },
  { code: '+41', label: '🇨🇭 +41 (CH)' },
  { code: '+46', label: '🇸🇪 +46 (SE)' },
  { code: '+47', label: '🇳🇴 +47 (NO)' },
  { code: '+45', label: '🇩🇰 +45 (DK)' },
  { code: '+358', label: '🇫🇮 +358 (FI)' },
  { code: '+39', label: '🇮🇹 +39 (IT)' },
  { code: '+34', label: '🇪🇸 +34 (ES)' },
  { code: '+351', label: '🇵🇹 +351 (PT)' },
  { code: '+48', label: '🇵🇱 +48 (PL)' },
  { code: '+55', label: '🇧🇷 +55 (BR)' },
  { code: '+52', label: '🇲🇽 +52 (MX)' },
  { code: '+54', label: '🇦🇷 +54 (AR)' },
  { code: '+56', label: '🇨🇱 +56 (CL)' },
  { code: '+57', label: '🇨🇴 +57 (CO)' },
  { code: '+27', label: '🇿🇦 +27 (ZA)' },
  { code: '+20', label: '🇪🇬 +20 (EG)' },
  { code: '+234', label: '🇳🇬 +234 (NG)' },
  { code: '+254', label: '🇰🇪 +254 (KE)' },
  { code: '+64', label: '🇳🇿 +64 (NZ)' },
  { code: '+60', label: '🇲🇾 +60 (MY)' },
  { code: '+62', label: '🇮🇩 +62 (ID)' },
  { code: '+63', label: '🇵🇭 +63 (PH)' },
  { code: '+66', label: '🇹🇭 +66 (TH)' },
  { code: '+84', label: '🇻🇳 +84 (VN)' },
  { code: '+82', label: '🇰🇷 +82 (KR)' },
  { code: '+92', label: '🇵🇰 +92 (PK)' },
  { code: '+880', label: '🇧🇩 +880 (BD)' },
  { code: '+94', label: '🇱🇰 +94 (LK)' },
  { code: '+90', label: '🇹🇷 +90 (TR)' },
  { code: '+974', label: '🇶🇦 +974 (QA)' },
  { code: '+965', label: '🇰🇼 +965 (KW)' },
  { code: 'CUSTOM', label: '✏️ Enter Custom Code...' },
];

export default function CandidateForm({ onSuccess, initialJobTitle = '', className = '' }: CandidateFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [customCode, setCustomCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    discipline: 'Full-Stack / Web Development',
    workModel: 'W2',
    targetRate: '',
    linkedinUrl: '',
    githubUrl: '',
    targetRole: initialJobTitle,
    faxNumber: '', // Honeypot field
  });

  useEffect(() => {
    if (initialJobTitle) {
      setFormData((prev) => ({ ...prev, targetRole: initialJobTitle }));
    }
  }, [initialJobTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMsg('Phone number must be exactly 10 digits.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      if (file && file.size > 5 * 1024 * 1024) {
        setErrorMsg('Resume file size must be under 5MB.');
        setIsSubmitting(false);
        return;
      }

      const payload = new FormData();
      payload.append('type', 'candidate');
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (file) {
        payload.append('resume', file);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: payload, // Do not set Content-Type header for FormData
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(result.error || 'Failed to send request. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => {
            setSubmitted(false);
            setErrorMsg('');
            setFile(null);
            setCustomCode('');
            setFormData({
              fullName: '',
              email: '',
              countryCode: '+1',
              phone: '',
              discipline: 'Full-Stack / Web Development',
              workModel: 'W2',
              targetRate: '',
              linkedinUrl: '',
              githubUrl: '',
              targetRole: initialJobTitle,
              faxNumber: '',
            });
          }}
          className="mt-2 px-5 py-2 text-xs font-bold bg-secondary/20 text-secondary border border-secondary/40 rounded-lg hover:bg-secondary/30 transition cursor-pointer"
        >
          Submit Another Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 text-sm ${className}`}>
      {/* Honeypot Field - Invisible to Real Users */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="faxNumber">Fax Number (Leave this blank)</label>
        <input
          type="text"
          id="faxNumber"
          name="faxNumber"
          tabIndex={-1}
          autoComplete="off"
          value={formData.faxNumber}
          onChange={(e) => setFormData({ ...formData, faxNumber: e.target.value })}
        />
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

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
          <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number *</label>
          <div className="flex gap-2">
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="bg-black border border-white/15 rounded-lg px-2 py-2.5 text-white focus:outline-none focus:border-secondary text-xs w-32 shrink-0"
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            {formData.countryCode === 'CUSTOM' ? (
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="+ Code"
                className="w-24 bg-black/50 border border-white/15 rounded-lg px-2 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs shrink-0"
              />
            ) : null}

            <input
              type="tel"
              required
              maxLength={10}
              pattern="\d{10}"
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: val });
              }}
              placeholder="1234567890"
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-secondary text-xs"
            />
          </div>
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
            <option value="Networking & Infrastructure">Networking & Infrastructure</option>
            <option value="Cybersecurity & InfoSec">Cybersecurity & InfoSec</option>
            <option value="ERP & Enterprise Systems (SAP/Salesforce/Oracle)">ERP & Enterprise Systems (SAP/Salesforce/Oracle)</option>
            <option value="Mobile App Development (iOS/Android)">Mobile App Development (iOS/Android)</option>
            <option value="Technical SEO & Performance">Technical SEO & Performance</option>
            <option value="IT Consulting & Management">IT Consulting & Management</option>
            <option value="Other">Other</option>
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
        <label className="block text-xs font-medium text-gray-300 mb-1">Upload Resume / CV (.pdf, .docx) *</label>
        <input
          type="file"
          required
          accept=".pdf,.docx,.doc"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary/20 file:text-secondary hover:file:bg-secondary/30 border border-white/15 rounded-lg bg-black/50"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-black font-extrabold rounded-lg hover:opacity-90 transition shadow-md shadow-secondary/20 text-xs tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Fast-Track Resume & Profile Submission'}
        </button>
      </div>
    </form>
  );
}
