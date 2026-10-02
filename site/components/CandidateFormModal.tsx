'use client';

import CandidateForm from './CandidateForm';

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJobTitle?: string;
}

export default function CandidateFormModal({ isOpen, onClose, initialJobTitle = '' }: CandidateFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-darkBody border border-white/15 rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          aria-label="Close Modal"
        >
          ✕
        </button>

        <div className="mb-6 border-b border-white/10 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Candidate Network Profile</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Join Our Talent Network</h2>
          <p className="text-xs text-gray-400 mt-1">
            Direct access to prime enterprise engagements. Fast-track your profile drop below.
          </p>
        </div>

        <CandidateForm initialJobTitle={initialJobTitle} onSuccess={() => {}} />
      </div>
    </div>
  );
}
