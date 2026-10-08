'use client';

import ClientForm from './ClientForm';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientFormModal({ isOpen, onClose }: ClientFormModalProps) {
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
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Enterprise Client Intake</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Request Talent / Build Your Team</h2>
          <p className="text-xs text-gray-400 mt-1">
            Tell us about your technical requirements and timeline. Our team will review and respond shortly.
          </p>
        </div>

        <ClientForm onSuccess={() => {}} />
      </div>
    </div>
  );
}
