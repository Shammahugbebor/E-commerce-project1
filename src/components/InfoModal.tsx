import React, { useState } from 'react';
import { X, ShieldCheck, Truck, Store, Check } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  initialTab: 'buyer' | 'vendor' | 'services' | 'Terms' | 'Privacy' | 'Cookies';
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, initialTab, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const isLegal = initialTab === 'Terms' || initialTab === 'Privacy' || initialTab === 'Cookies';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ECEAF6] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ECEAF6] flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#141221]">
            {isLegal
              ? `Eazetrades ${initialTab} Policy`
              : initialTab === 'services'
                ? 'Eazetrades Marketplace Services'
                : initialTab === 'vendor'
                  ? 'Sell on Eazetrades'
                  : 'Get Started with Eazetrades'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-[#F6F5FB] text-[#646175] flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isLegal ? (
            <div className="space-y-3 text-sm text-[#646175] leading-relaxed">
              {initialTab === 'Terms' && (
                <p>
                  Eazetrades connects buyers and verified merchants without forcing online card
                  payments. Every listing states clearly whether it is New or Second-Hand and
                  whether it qualifies for Pay on Delivery (goods + dispatch paid after physical
                  inspection) or Pay Before Delivery / Hub Pickup via Escrow custody.
                </p>
              )}
              {initialTab === 'Privacy' && (
                <p>
                  Eazetrades collects only the contact and delivery details required to fulfill your
                  orders and dispatch notifications. We never sell buyer contact details to third-party
                  brokers. Inquiries can be directed to support@eazetrades.com.
                </p>
              )}
              {initialTab === 'Cookies' && (
                <p>
                  We use lightweight local storage solely to preserve your shopping bag, saved items,
                  and filter selections during your session.
                </p>
              )}
            </div>
          ) : initialTab === 'services' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6F5FB]">
                <Truck className="w-5 h-5 text-[#5E35F2] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#141221]">Pay on Delivery (Goods + Dispatch)</h3>
                  <p className="text-xs text-[#646175] mt-0.5">
                    Submit your contact and address first. Inspect your item at the doorstep and pay
                    both the goods total and dispatch fee upon arrival.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6F5FB]">
                <ShieldCheck className="w-5 h-5 text-[#5E35F2] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#141221]">Escrow Custody & Hub Pickup</h3>
                  <p className="text-xs text-[#646175] mt-0.5">
                    For pre-dispatch or pickup items, verified bank transfer stays in Eazetrades
                    Escrow until you inspect the item condition (New or Second-Hand).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6F5FB]">
                <Store className="w-5 h-5 text-[#5E35F2] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#141221]">Verified Merchant Inspections</h3>
                  <p className="text-xs text-[#646175] mt-0.5">
                    Every Premium Ad seller passes physical storefront and authenticity checks at our
                    Ikeja Care Desk.
                  </p>
                </div>
              </div>
            </div>
          ) : submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ECE8FD] text-[#5E35F2] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#141221]">
                Welcome to Eazetrades, {name || 'Partner'}
              </h3>
              <p className="text-sm text-[#646175]">
                We sent your onboarding checklist to <span className="font-medium text-[#141221]">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#646175]">
                {initialTab === 'vendor'
                  ? 'Open a verified Eazetrades storefront in Ikeja and reach buyers across Nigeria.'
                  : 'Create an Eazetrades account for faster checkout, saved items, and order tracking.'}
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#141221] mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#141221] mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {initialTab === 'vendor' ? 'Request Vendor Access' : 'Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

