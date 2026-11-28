import React, { useState } from 'react';
import { X, MapPin, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ServiceListing } from '../data/marketplace';
import { formatNaira } from '../data/products';

interface ServiceDetailModalProps {
  service: ServiceListing | null;
  onClose: () => void;
  onViewVendor: (vendorName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onViewVendor,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ECEAF6] overflow-hidden my-8">
        <div className="relative h-56 bg-[#F5F5F7]">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            aria-label="Close service preview"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#141221] shadow flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#646175]">
                <span className="font-semibold text-[#5E35F2]">{service.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5E35F2]" />
                  {service.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#5E35F2]" />
                  {service.responseSla}
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#141221]">{service.title}</h2>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewVendor(service.providerName);
                }}
                className="text-xs font-semibold text-[#5E35F2] hover:underline cursor-pointer"
              >
                Provided by {service.providerName} →
              </button>
            </div>

            <div className="text-right">
              <span className="block text-xs text-[#646175]">Starting from</span>
              <span className="font-display font-bold text-xl text-[#141221] tabular-nums">
                {formatNaira(service.startingRate)}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#48455A] leading-relaxed">{service.description}</p>

          <div className="bg-[#F6F5FB] rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[#141221] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#5E35F2]" />
              <span>Included Deliverables</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#48455A]">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5E35F2] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-[#EFEFFD] border border-[#D4CCF7] p-5 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#5E35F2] mx-auto" />
              <h3 className="font-display font-bold text-base text-[#141221]">
                Booking Quote Requested
              </h3>
              <p className="text-xs text-[#48455A]">
                {service.providerName} received your inquiry and will call{' '}
                <strong className="tabular-nums">{phone}</strong> ({service.responseSla}).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#ECEAF6]">
              <h3 className="font-display font-bold text-sm text-[#141221]">
                Request Service Quote
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone / WhatsApp number"
                  className="h-10 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe your request or preferred Lagos schedule..."
                className="w-full p-3 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
              />
              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Request Quote from Provider
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

