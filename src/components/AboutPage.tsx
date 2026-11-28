import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  Truck,
  Smartphone,
  Sparkles,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { ABOUT_FAQS, TEAM_MEMBERS } from '../data/marketplace';

interface AboutPageProps {
  onNavigateCatalog: (category?: string) => void;
  onOpenAuth: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateCatalog, onOpenAuth }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);
  const activeMember = TEAM_MEMBERS[activeTeamIndex] || TEAM_MEMBERS[0];

  return (
    <main className="pb-20">
      {/* Banner Header matching About Us mockup */}
      <section className="relative h-56 sm:h-64 bg-[#141221] flex items-center justify-center overflow-hidden">
        <img
          src="/src/assets/images/vendor_storefront_banner_1795486249885.jpg"
          alt="Eazetrades boutique and warehouse fulfillment"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#141221]/55" />
        <h1 className="relative z-10 font-display font-bold text-3xl sm:text-4xl text-white">
          About Us
        </h1>
      </section>

      {/* Section 1: Our commitment to safety and satisfaction */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight text-[#141221] text-balance">
              Our commitment to safety and satisfaction
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#48455A]">
              At EAZETRADES, we eliminate the guesswork of online buying and selling. Through our
              end-to-end Lagos & interstate delivery network, buyers inspect items on arrival while
              verified sellers receive guaranteed settlement—giving both sides confidence on every
              order.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#EFEFFD] rounded-2xl p-6 flex items-center justify-between gap-4 border border-[#E1DCFA]">
              <div className="space-y-1.5">
                <span className="font-display font-bold text-base text-[#141221] block">
                  Online shopping
                </span>
                <p className="text-xs text-[#48455A]">
                  Verified catalogs with real product angles and transparent NGN pricing.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#5E35F2] flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#DCE6FF] rounded-2xl p-6 flex items-center justify-between gap-4 border border-[#C7D6FE]">
              <div className="space-y-1.5">
                <span className="font-display font-bold text-base text-[#141221] block">
                  End-to-End delivery service
                </span>
                <p className="text-xs text-[#3B384A]">
                  2–4 hour express dispatch across Lagos and tracked nationwide freight.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#5E35F2] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="sm:col-span-2 bg-gradient-to-r from-[#E6E0FE] to-[#DCE6FF] rounded-2xl p-6 flex items-center justify-between gap-4 border border-[#D4CCF7]">
              <div className="space-y-1">
                <span className="font-display font-bold text-base text-[#141221] block">
                  Smooth & protected transactions
                </span>
                <p className="text-xs text-[#48455A] max-w-md">
                  Funds are protected via Eazetrades Escrow or confirmed face-to-face by our
                  courier before final payout.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#5E35F2] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Personalized Discovery */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141221] text-balance">
            Smart curation for a personalized shopping experience
          </h2>
          <p className="text-sm text-[#646175]">
            Discover curated audio gear, home furniture, fashion staples, and local services matched
            to your preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-[#EFEFFD] border border-[#E1DCFA] rounded-3xl p-7 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#141221]">
                Tailored Product Recommendations
              </h3>
              <p className="text-sm text-[#48455A] leading-relaxed">
                Compare verified local vendors side-by-side by rating, warranty coverage, and Ikeja
                dispatch availability.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateCatalog('Fashion')}
              className="self-start px-5 py-2.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Explore Fashion & Tech
            </button>
          </div>

          <div className="md:col-span-7 relative rounded-3xl overflow-hidden min-h-[260px] bg-[#141221]">
            <img
              src="/src/assets/images/hero_marketplace_shopping_1795486248117.jpg"
              alt="Discovering new curated products on Eazetrades"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="relative z-10 h-full p-7 flex flex-col justify-between items-start">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#C7BDF8]" />
                Curated Catalog
              </span>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-2xl text-white">Discovering New Items</h3>
                <p className="text-xs sm:text-sm text-white/85 max-w-md">
                  Weekly vendor drops inspected for quality and ready for same-day Lagos dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What sets us apart */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-10">
          <div className="md:col-span-5">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141221]">
              What sets us apart
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-sm text-[#48455A] leading-relaxed">
              Whether you are shopping for studio headphones, solid oak home furnishings, or booking
              a vetted technician in Lagos, every step is structured around accountability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-7 space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#5E35F2] text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#141221]">
              Seller-to-buyer Delivery
            </h3>
            <p className="text-sm text-[#646175] leading-relaxed">
              Our dispatch riders pick up directly from verified vendor storefronts and hand-deliver
              sealed packages straight to your doorstep.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-7 space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#5E35F2] text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#141221]">Secure transactions</h3>
            <p className="text-sm text-[#646175] leading-relaxed">
              You inspect your product before confirming payment. Once satisfied, payment releases
              instantly to the merchant.
            </p>
          </div>

          <div className="bg-[#C7D6FE]/55 rounded-2xl border border-[#B2C6FD] p-7 space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#5E35F2] text-white flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#141221]">Enhanced safety</h3>
            <p className="text-sm text-[#3B384A] leading-relaxed">
              By managing courier handoffs and merchant verification ourselves, we eliminate the
              risks of unverified meetups and counterfeit listings.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Customer Satisfaction Dark Banner */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-[#141221] min-h-[240px] flex items-center">
          <img
            src="/src/assets/images/about_customer_care_1795486250624.jpg"
            alt="Eazetrades quality fulfillment desk"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141221]/90 via-[#141221]/70 to-[#141221]/40" />
          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-3">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Customer Satisfaction:
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Your satisfaction is our top priority. We strive to provide responsive care from our
              Ikeja hub and ensure every purchase meets your expectations.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-6 py-2.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Join Eazetrades
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Frequently Asked Questions */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-2">
            <h2 className="font-display font-bold text-3xl text-[#141221] text-balance">
              Frequently asked questions
            </h2>
            <p className="text-sm text-[#646175]">
              Clear answers on delivery, escrow protection, and warranty support.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-[#ECEAF6] bg-white rounded-2xl border border-[#ECEAF6] px-6">
            {ABOUT_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q} className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-display font-semibold text-base text-[#141221]">
                      {faq.q}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-[#E7E4F5] flex items-center justify-center shrink-0 text-[#5E35F2]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-[#646175] leading-relaxed pr-10">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: MEET THE TEAM matching About design sheet */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-3xl space-y-2.5 mb-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-wide uppercase text-[#5E35F2]">
            MEET THE TEAM
          </h2>
          <p className="text-sm text-[#48455A] leading-relaxed">
            Our Lagos product, logistics, engineering, and merchant care leads work directly with
            buyers and independent storefronts every day to keep inspection, dispatch, and payouts
            fast and dependable.
          </p>
        </div>

        {/* Desktop Layout: 5-column horizontal strip where active portrait is featured/wider */}
        <div className="hidden lg:flex items-stretch gap-3.5 h-[440px]">
          {TEAM_MEMBERS.map((member, idx) => {
            const isActive = idx === activeTeamIndex;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setActiveTeamIndex(idx)}
                onMouseEnter={() => setActiveTeamIndex(idx)}
                aria-pressed={isActive}
                className={`group relative rounded-2xl overflow-hidden bg-[#141221] text-left transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E35F2] ${
                  isActive ? 'flex-[2.4]' : 'flex-1'
                }`}
              >
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-top transition-all duration-500 ${
                    isActive ? 'scale-100 grayscale-0' : 'scale-105 grayscale-[35%] opacity-85 group-hover:grayscale-0 group-hover:opacity-100'
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t transition-opacity ${
                    isActive
                      ? 'from-black/85 via-black/25 to-transparent'
                      : 'from-black/75 via-black/15 to-black/10'
                  }`}
                />
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <h3
                    className={`font-display font-bold transition-all ${
                      isActive ? 'text-xl' : 'text-xs truncate'
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`text-white/80 mt-0.5 transition-all ${
                      isActive ? 'text-xs font-medium' : 'text-[11px] truncate opacity-85'
                    }`}
                  >
                    {member.role}
                  </p>
                  {isActive && (
                    <p className="text-xs text-white/75 mt-2 line-clamp-2 max-w-sm">
                      {member.bio}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile & Tablet Layout: 1 featured portrait + horizontal thumbnail strip + prev/next arrows */}
        <div className="lg:hidden space-y-3.5 max-w-md mx-auto">
          <article className="relative aspect-[4/4.3] rounded-2xl overflow-hidden bg-[#141221] shadow-sm">
            <img
              src={activeMember.image}
              alt={`${activeMember.name}, ${activeMember.role}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <h3 className="font-display font-bold text-lg">{activeMember.name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{activeMember.role}</p>
              <p className="text-xs text-white/75 mt-1.5 leading-relaxed">{activeMember.bio}</p>
            </div>
          </article>

          <div className="grid grid-cols-5 gap-2">
            {TEAM_MEMBERS.map((member, idx) => {
              const isSelected = idx === activeTeamIndex;
              return (
                <button
                  key={`thumb-${member.id}`}
                  type="button"
                  onClick={() => setActiveTeamIndex(idx)}
                  aria-label={`Select ${member.name}`}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-[#141221] cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#5E35F2] ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                setActiveTeamIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length)
              }
              aria-label="Previous team member"
              className="w-10 h-10 rounded-full border border-[#E2DFF2] bg-white hover:border-[#5E35F2] text-[#141221] hover:text-[#5E35F2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-[#646175] tabular-nums">
              {activeTeamIndex + 1} / {TEAM_MEMBERS.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveTeamIndex((prev) => (prev + 1) % TEAM_MEMBERS.length)}
              aria-label="Next team member"
              className="w-10 h-10 rounded-full border border-[#E2DFF2] bg-white hover:border-[#5E35F2] text-[#141221] hover:text-[#5E35F2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

