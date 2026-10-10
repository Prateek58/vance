'use client';

import { useState, useEffect } from 'react';

interface BookCallFormProps {
  onSuccess?: () => void;
}

interface TimeSlot {
  time: string;
  displayTime: string;
  available: boolean;
  reason?: string;
}

const SUBJECT_OPTIONS = [
  'General Discovery Call',
  'Technical Talent / Staffing Request',
  'IT Consulting & Project Architecture',
  'Custom Web & App Engineering',
  'Digital Marketing & SEO Strategy',
  'Other / Custom Subject',
];

const BASE_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST - UTC+5:30)' },
  { value: 'America/New_York', label: 'US Eastern Time (EDT/EST - UTC-4/5)' },
  { value: 'America/Chicago', label: 'US Central Time (CDT/CST - UTC-5/6)' },
  { value: 'America/Denver', label: 'US Mountain Time (MDT/MST - UTC-6/7)' },
  { value: 'America/Los_Angeles', label: 'US Pacific Time (PDT/PST - UTC-7/8)' },
  { value: 'America/Phoenix', label: 'US Arizona Time (MST - UTC-7)' },
  { value: 'America/Toronto', label: 'Canada Eastern Time (Toronto)' },
  { value: 'America/Vancouver', label: 'Canada Pacific Time (Vancouver)' },
  { value: 'Europe/London', label: 'UK London (BST/GMT - UTC+1/0)' },
  { value: 'Europe/Paris', label: 'Europe Central (Paris/Berlin - UTC+2/1)' },
  { value: 'Europe/Athens', label: 'Europe Eastern (Athens/Helsinki - UTC+3/2)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai/UAE - UTC+4)' },
  { value: 'Asia/Riyadh', label: 'Arabia Standard Time (Riyadh - UTC+3)' },
  { value: 'Asia/Singapore', label: 'Singapore / Malaysia (SST - UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST - UTC+9)' },
  { value: 'Australia/Sydney', label: 'Australia Eastern (Sydney/Melbourne)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
];

export default function BookCallForm({ onSuccess }: BookCallFormProps) {
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const detectedTimeZone = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'Asia/Kolkata';

  // Construct comprehensive timezone list with auto-detected timezone guaranteed
  const timezoneList = (() => {
    const exists = BASE_TIMEZONES.some(tz => tz.value === detectedTimeZone);
    if (!exists && detectedTimeZone) {
      return [
        { value: detectedTimeZone, label: `📍 Auto-Detected: ${detectedTimeZone}` },
        ...BASE_TIMEZONES
      ];
    }
    return BASE_TIMEZONES;
  })();

  // Step 1 = Date & Time, Step 2 = Details
  const [step, setStep] = useState<1 | 2>(1);

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState(detectedTimeZone);

  const [subjectOption, setSubjectOption] = useState(SUBJECT_OPTIONS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [faxNumber, setFaxNumber] = useState(''); // Honeypot

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    joinUrl: string | null;
    date: string;
    formattedDate: string;
    timeSlot: string;
    timeZone: string;
  } | null>(null);

  // Helper to format YYYY-MM-DD into unambiguous human string e.g. "Monday, Oct 12, 2026"
  const formatHumanDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate 7 days for quick date selection
  const getQuickDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      const year = d.getFullYear();
      const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = d.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      dates.push({
        dateStr,
        dayName,
        monthName,
        dayNum,
        label: `${dayName}, ${monthName} ${dayNum}`,
        isToday: i === 0,
      });
    }
    return dates;
  };

  const quickDates = getQuickDates();

  // Fetch slots on date or timezone change
  useEffect(() => {
    let isMounted = true;
    async function fetchSlots() {
      if (!selectedDate) return;
      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);
      try {
        const res = await fetch(`/api/booking/slots?date=${selectedDate}&timezone=${encodeURIComponent(selectedTimeZone)}`);
        const data = await res.json();
        if (!isMounted) return;
        if (data.success && Array.isArray(data.slots)) {
          setSlots(data.slots);
        } else {
          setSlotsError(data.error || 'Failed to load availability slots.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to fetch slots:', err);
        setSlotsError('Could not connect to calendar server.');
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }
    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedTimeZone]);

  // Group slots into Morning & Afternoon
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12;
  });

  const getDisplaySelectedSlot = () => {
    const found = slots.find(s => s.time === selectedSlot);
    return found ? found.displayTime : selectedSlot;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalSubject = subjectOption === 'Other / Custom Subject' ? customSubject.trim() : subjectOption;

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        subject: finalSubject || 'General Discovery Call',
        name,
        phone,
        email,
        description,
        date: selectedDate,
        timeSlot: selectedSlot,
        timeZone: selectedTimeZone,
        faxNumber,
      };

      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setBookingSuccess(true);
        setConfirmedData({
          joinUrl: result.joinUrl || null,
          date: selectedDate,
          formattedDate: formatHumanDate(selectedDate),
          timeSlot: getDisplaySelectedSlot() || selectedSlot,
          timeZone: selectedTimeZone,
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(result.error || 'Failed to book meeting. Please try again.');
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (bookingSuccess && confirmedData) {
    return (
      <div className="space-y-6 text-center py-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10">
          ✓
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-white">Call Confirmed!</h3>
          <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
            Your video call has been scheduled and added to the <strong className="text-primary">mail@vanceitsolutions.com</strong> Outlook Calendar.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/15 text-left max-w-md mx-auto space-y-3 shadow-xl">
          <div className="flex justify-between items-center text-xs text-gray-400 pb-2.5 border-b border-white/10">
            <span className="font-medium">Scheduled Date</span>
            <span className="font-bold text-primary text-xs sm:text-sm">{confirmedData.formattedDate}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400 pb-2.5 border-b border-white/10">
            <span className="font-medium">Time Slot</span>
            <span className="font-bold text-white text-xs sm:text-sm">{confirmedData.timeSlot}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400 pb-2.5 border-b border-white/10">
            <span className="font-medium">Attendee Email</span>
            <span className="font-bold text-white truncate max-w-[200px]">{email}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span className="font-medium">Timezone</span>
            <span className="font-semibold text-gray-300">{confirmedData.timeZone}</span>
          </div>
        </div>

        {/* Teams Join Button */}
        {confirmedData.joinUrl ? (
          <div className="pt-2">
            <a
              href={confirmedData.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-primary/25 cursor-pointer hover:scale-105"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              Join Microsoft Teams Meeting
            </a>
          </div>
        ) : (
          <div className="text-xs text-gray-400 bg-white/5 p-3.5 rounded-xl max-w-md mx-auto border border-white/10">
            ℹ️ A Microsoft Teams invite email with calendar details has been sent to <strong className="text-white">{email}</strong>.
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => {
              setBookingSuccess(false);
              setStep(1);
              setSelectedSlot(null);
              setName('');
              setEmail('');
              setPhone('');
              setDescription('');
            }}
            className="text-xs font-semibold text-gray-400 hover:text-white underline cursor-pointer"
          >
            Book Another Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="faxNumber">Fax Number</label>
        <input
          type="text"
          id="faxNumber"
          name="faxNumber"
          tabIndex={-1}
          autoComplete="off"
          value={faxNumber}
          onChange={(e) => setFaxNumber(e.target.value)}
        />
      </div>

      {/* Step Indicator Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 text-xs font-bold transition ${
              step === 1 ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 1 ? 'bg-primary text-black font-extrabold' : 'bg-white/10 text-gray-300'
            }`}>
              1
            </span>
            <span>Date & Time</span>
          </button>

          <span className="text-gray-600">→</span>

          <button
            type="button"
            onClick={() => {
              if (selectedSlot) setStep(2);
            }}
            disabled={!selectedSlot}
            className={`flex items-center gap-2 text-xs font-bold transition ${
              step === 2 ? 'text-primary' : selectedSlot ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? 'bg-primary text-black font-extrabold' : 'bg-white/10 text-gray-400'
            }`}>
              2
            </span>
            <span>Your Info</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Outlook Sync Active
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* STEP 1: DATE & TIME SELECTION */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          {/* Timezone Selector Bar */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
              <span className="text-primary text-base">🌐</span> Timezone:
            </div>
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className="w-full sm:w-auto max-w-full px-3 py-1.5 rounded-lg bg-darkBody border border-white/20 text-white text-xs focus:outline-none focus:border-primary transition truncate"
            >
              {timezoneList.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-darkBody text-white">
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Day Picker Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-300">
                1. Select Meeting Date
              </label>
              <span className="text-[11px] text-primary font-bold">
                {formatHumanDate(selectedDate)}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {quickDates.map((q) => {
                const isSelected = selectedDate === q.dateStr;
                return (
                  <button
                    type="button"
                    key={q.dateStr}
                    onClick={() => setSelectedDate(q.dateStr)}
                    className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-b from-primary/25 to-secondary/25 border-primary text-white shadow-lg shadow-primary/20 scale-105'
                        : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="text-[9px] uppercase font-bold tracking-wider text-gray-400">{q.dayName}</div>
                    <div className={`text-sm font-black mt-0.5 ${isSelected ? 'text-primary' : 'text-gray-200'}`}>
                      {q.dayNum}
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{q.monthName}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Date Input for manual picker */}
            <div className="pt-2 flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10">
              <span className="text-xs text-gray-300 font-medium">Or pick any future date manually:</span>
              <input
                type="date"
                value={selectedDate}
                min={getTodayStr()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-darkBody border border-white/20 text-white text-xs focus:outline-none focus:border-primary cursor-pointer font-semibold"
              />
            </div>
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-300">
                2. Pick Available Time Slot
              </label>
              {loadingSlots && (
                <span className="text-xs text-primary font-medium animate-pulse flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Syncing Outlook...
                </span>
              )}
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : slotsError ? (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs text-center">
                {slotsError}
              </div>
            ) : slots.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/5 text-gray-400 text-xs text-center border border-white/10">
                No slots available on this date. Please select another date above.
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {/* Morning Section */}
                {morningSlots.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                      <span>🌅</span> Morning (9:00 AM - 12:00 PM)
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {morningSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.time;
                        const isAvailable = slot.available;
                        return (
                          <button
                            type="button"
                            key={slot.time}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary to-secondary text-black font-extrabold border-transparent shadow-lg shadow-primary/25 scale-105'
                                : isAvailable
                                ? 'bg-black/50 border-white/15 text-gray-200 hover:border-primary hover:text-primary'
                                : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through'
                            }`}
                          >
                            {slot.displayTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Afternoon Section */}
                {afternoonSlots.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                      <span>☀️</span> Afternoon (12:00 PM - 5:30 PM)
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {afternoonSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.time;
                        const isAvailable = slot.available;
                        return (
                          <button
                            type="button"
                            key={slot.time}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary to-secondary text-black font-extrabold border-transparent shadow-lg shadow-primary/25 scale-105'
                                : isAvailable
                                ? 'bg-black/50 border-white/15 text-gray-200 hover:border-primary hover:text-primary'
                                : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed line-through'
                            }`}
                          >
                            {slot.displayTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer for Step 1 */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {selectedSlot ? (
                <span className="text-primary font-semibold">
                  Selected: {formatHumanDate(selectedDate)} @ {getDisplaySelectedSlot()}
                </span>
              ) : (
                'Select a slot to continue'
              )}
            </div>

            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setStep(2)}
              className={`px-6 py-3 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center gap-2 ${
                selectedSlot
                  ? 'bg-gradient-to-r from-primary to-secondary text-black hover:opacity-90 shadow-lg shadow-primary/20'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Details →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: USER DETAILS & SUBMISSION */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          {/* Selected Slot Summary Chip */}
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-primary">📅</span>
              <span className="font-bold text-white">
                {formatHumanDate(selectedDate)} @ {getDisplaySelectedSlot()}
              </span>
              <span className="text-gray-400">({selectedTimeZone})</span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-primary font-bold hover:underline text-[11px]"
            >
              Change
            </button>
          </div>

          {/* Subject Dropdown */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-200">
              Meeting Subject / Topic <span className="text-primary">*</span>
            </label>
            <select
              value={subjectOption}
              onChange={(e) => setSubjectOption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-primary transition"
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-darkBody text-white">
                  {opt}
                </option>
              ))}
            </select>

            {subjectOption === 'Other / Custom Subject' && (
              <input
                type="text"
                placeholder="Specify subject..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-primary transition"
                required
              />
            )}
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-200">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-200">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Corporate Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-200">
              Work / Corporate Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              placeholder="sarah@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-200">Optional Notes / Agenda</label>
            <textarea
              rows={2}
              placeholder="Briefly describe what you would like to discuss..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl border border-white/20 text-gray-300 font-bold text-xs hover:bg-white/5 transition cursor-pointer"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black font-extrabold text-xs transition cursor-pointer shadow-lg shadow-primary/25 hover:opacity-90 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scheduling Teams Call...
                </>
              ) : (
                'Confirm & Schedule Teams Call'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
