'use client';

import { useState } from 'react';

interface ClientFormProps {
  onSuccess?: () => void;
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
  { code: '+94', label: '🇱🇱 +94 (LK)' },
  { code: '+90', label: '🇹🇷 +90 (TR)' },
  { code: '+974', label: '🇶🇦 +974 (QA)' },
  { code: '+965', label: '🇰🇼 +965 (KW)' },
  { code: 'CUSTOM', label: '✏️ Enter Custom Code...' },
];

export default function ClientForm({ onSuccess, className = '' }: ClientFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    orgWebsite: '',
    managerName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    workType: 'Direct Placement',
    techStack: '',
    startDate: 'Immediate',
    faxNumber: '', // Honeypot field
  });

  const getWordCount = (str: string) => {
    const trimmed = str.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(formData.techStack);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < 50 || wordCount > 1000) {
      setErrorMsg(`Please enter between 50 and 1000 words in the details field (current: ${wordCount} words).`);
      return;
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setErrorMsg('Phone number must be exactly 10 digits.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append('type', 'client');
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: payload, // Browser sets multipart/form-data headers automatically
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

  return (
    <div>
      {submitted ? (
        <div className={`text-center py-10 space-y-4 ${className}`}>
          <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="text-xl font-bold text-white">Talent Request Received</h3>
          <p className="text-gray-300 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            Thank you, <span className="text-white font-medium">{formData.managerName || 'Hiring Leader'}</span>. A senior technical strategist from Vance IT Solutions will contact you at <span className="text-primary font-medium">{formData.email}</span> shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setErrorMsg('');
              setFormData({
                companyName: '',
                orgWebsite: '',
                managerName: '',
                email: '',
                countryCode: '+1',
                phone: '',
                workType: 'Direct Placement',
                techStack: '',
                startDate: 'Immediate',
                faxNumber: '',
              });
              setCustomCode('');
            }}
            className="mt-2 px-5 py-2 text-xs font-bold bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
              <label className="block text-xs font-medium text-gray-300 mb-1">Manager Name *</label>
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
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number (Optional)</label>
              <div className="flex gap-2">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="bg-black border border-white/15 rounded-lg px-2 py-2.5 text-white focus:outline-none focus:border-primary text-xs w-32 shrink-0"
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
                    className="w-24 bg-black/50 border border-white/15 rounded-lg px-2 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs shrink-0"
                  />
                ) : null}

                <input
                  type="tel"
                  maxLength={10}
                  pattern="\d{10}"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: val });
                  }}
                  placeholder="1234567890"
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Work Type</label>
              <select
                value={formData.workType}
                onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary text-xs"
              >
                <option value="Direct Placement">Direct Hire / Permanent Search</option>
                <option value="Temp / Contract">Temp / Contract Sourcing</option>
                <option value="Contract-to-Hire">Contract-to-Hire Placement</option>
                <option value="IT Consulting">IT Consulting & Architecture Advisory</option>
                <option value="Custom Web Project">Custom Web & Enterprise Software Development</option>
                <option value="Digital Marketing & SEO">Digital Marketing & SEO Architecture</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Desired Start Date</label>
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
            <label className="block text-xs font-medium text-gray-300 mb-1">Target Tech Stack & Details *</label>
            <textarea
              required
              rows={4}
              value={formData.techStack}
              onChange={(e) => {
                setFormData({ ...formData, techStack: e.target.value });
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Please describe your project or team requirements, target tech stack, roles needed, budget parameters, and organizational timeline (minimum 50 words)."
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-xs"
            />
            <div className="flex justify-between items-center text-[11px] mt-1">
              <span className={wordCount > 0 && (wordCount < 50 || wordCount > 1000) ? 'text-amber-400 font-semibold' : 'text-gray-400'}>
                Word count: {wordCount} (min 50, max 1000 words required)
              </span>
              {wordCount > 0 && wordCount < 50 && (
                <span className="text-amber-400 text-[10px]">Add {50 - wordCount} more words</span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-lg hover:opacity-90 transition shadow-md shadow-primary/20 text-xs tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enterprise Talent Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
