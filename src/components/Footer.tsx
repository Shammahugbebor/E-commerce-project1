import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Clock, Check } from 'lucide-react';
import { EazetradesMark, AppView } from './Header';

interface FooterProps {
  onNavigateView: (view: AppView, category?: string) => void;
  onOpenLegal: (doc: 'Terms' | 'Privacy' | 'Cookies') => void;
  onOpenInfo: (tab: 'buyer' | 'vendor' | 'services') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateView,
  onOpenLegal,
  onOpenInfo,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#EFEFFD] border-t border-[#E1DCFA] text-[#141221]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#DED8FA]">
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#141221] mb-4">Product</h3>
              <ul className="space-y-2.5 text-sm text-[#646175]">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'Fashion')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Fashion & Apparel
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('product')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Featured Product
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'Health and Lifestyle')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Health and Lifestyle
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'Sport, Art and Outdoors')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Sport, Art and Outdoors
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'Animals and Pets')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Animals and Pets
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'Vehicle')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Vehicle
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('catalog', 'All')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    All Products
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#141221] mb-4">Service</h3>
              <ul className="space-y-2.5 text-sm text-[#646175]">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('services')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Browse Services
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('vendors')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Vendor Storefronts
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfo('services')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Buyer Escrow
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfo('services')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Warranty Care
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#141221] mb-4">Information</h3>
              <ul className="space-y-2.5 text-sm text-[#646175]">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('about')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigateView('about')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfo('services')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Shipping Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfo('vendor')}
                    className="hover:text-[#5E35F2] transition-colors cursor-pointer"
                  >
                    Become a Vendor
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#141221] mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-[#646175]">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href="mailto:support@eazetrades.com"
                    className="hover:text-[#5E35F2] transition-colors break-all"
                  >
                    support@eazetrades.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href="tel:+2348003293872"
                    className="hover:text-[#5E35F2] transition-colors tabular-nums"
                  >
                    +234 800 329 3872
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>24 Allen Avenue, Ikeja, Lagos, Nigeria</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Mon – Sat · 8:00 AM – 6:00 PM WAT</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#E3DDFC] rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-[#141221] mb-3">Subscribe</h3>
              <form onSubmit={handleFooterSubscribe} noValidate>
                <div className="flex items-center bg-white rounded-xl overflow-hidden border border-[#D4CCF7] focus-within:border-[#5E35F2] transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribed) setSubscribed(false);
                    }}
                    placeholder="Email address"
                    aria-label="Footer newsletter email address"
                    className="flex-1 min-w-0 h-11 px-3.5 text-sm text-[#141221] placeholder:text-[#8A879C] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to Eazetrades updates"
                    className="w-11 h-11 bg-[#5E35F2] hover:bg-[#4D26D9] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  >
                    {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-700 font-medium">{error}</p>}
                {subscribed && (
                  <p className="mt-2 text-xs text-[#4D26D9] font-medium">
                    Subscribed! Welcome to Eazetrades weekly curations.
                  </p>
                )}
              </form>
              <p className="mt-4 text-xs leading-relaxed text-[#646175]">
                Verified Lagos & nationwide vendors, curated product drops, and buyer protection
                updates delivered straight to your inbox.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => onNavigateView('landing')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <EazetradesMark className="w-8 h-8" />
            <span className="text-xs text-[#646175]">
              © {new Date().getFullYear()} Eazetrades Marketplace
            </span>
          </button>

          <div className="flex items-center gap-6 text-xs font-medium text-[#3B384A]">
            <button
              type="button"
              onClick={() => onOpenLegal('Terms')}
              className="hover:text-[#5E35F2] transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('Privacy')}
              className="hover:text-[#5E35F2] transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('Cookies')}
              className="hover:text-[#5E35F2] transition-colors cursor-pointer"
            >
              Cookies
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#linkedin"
              onClick={(e) => {
                e.preventDefault();
                onNavigateView('about');
              }}
              aria-label="Eazetrades on LinkedIn"
              className="w-9 h-9 rounded-full border border-[#D4CCF7] bg-white/70 hover:bg-[#5E35F2] hover:text-white hover:border-[#5E35F2] text-[#3B384A] flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="#facebook"
              onClick={(e) => {
                e.preventDefault();
                onNavigateView('about');
              }}
              aria-label="Eazetrades on Facebook"
              className="w-9 h-9 rounded-full border border-[#D4CCF7] bg-white/70 hover:bg-[#5E35F2] hover:text-white hover:border-[#5E35F2] text-[#3B384A] flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
              </svg>
            </a>
            <a
              href="#twitter"
              onClick={(e) => {
                e.preventDefault();
                onNavigateView('about');
              }}
              aria-label="Eazetrades on X / Twitter"
              className="w-9 h-9 rounded-full border border-[#D4CCF7] bg-white/70 hover:bg-[#5E35F2] hover:text-white hover:border-[#5E35F2] text-[#3B384A] flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>
            <a
              href="#instagram"
              onClick={(e) => {
                e.preventDefault();
                onNavigateView('about');
              }}
              aria-label="Eazetrades on Instagram"
              className="w-9 h-9 rounded-full border border-[#D4CCF7] bg-white/70 hover:bg-[#5E35F2] hover:text-white hover:border-[#5E35F2] text-[#3B384A] flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

