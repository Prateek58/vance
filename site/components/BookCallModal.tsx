'use client';

import BookCallForm from './BookCallForm';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  if (!isOpen) return null;

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
        <div className="mb-5 border-b border-white/10 pb-3.5 pr-8">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Executive Discovery Call
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Book a Teams Meeting</h2>
          <p className="text-xs text-gray-400 mt-1">
            Direct 1-on-1 consultation with Vance IT Solutions leadership (<strong className="text-gray-200">mail@vanceitsolutions.com</strong>).
          </p>
        </div>

        {/* Form Wizard Component */}
        <BookCallForm onSuccess={() => {}} />
      </div>
    </div>
  );
}
