import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Compass,
  HeartPulse,
  PawPrint,
  Car,
  Shirt,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Product, formatNaira, getPaymentPolicyLabel } from '../data/products';
import { ServiceListing, TestimonialItem } from '../data/marketplace';

interface LandingPageProps {
  products: Product[];
  services: ServiceListing[];
  testimonials: TestimonialItem[];
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: ServiceListing) => void;
  onNavigateCatalog: (category?: string) => void;
  onNavigateServices: () => void;
  onOpenAuth: () => void;
  onHeroSearch: (query: string) => void;
}

const CATEGORY_CARDS = [
  {
    label: 'Sport, Art and Outdoors',
    filterKey: 'Sport, Art and Outdoors',
    bg: 'bg-[#FFF5E6]',
    iconColor: 'text-amber-600',
    Icon: Compass,
  },
  {
    label: 'Health and Lifestyle',
    filterKey: 'Health and Lifestyle',
    bg: 'bg-[#EFEFFD]',
    iconColor: 'text-[#5E35F2]',
    Icon: HeartPulse,
  },
  {
    label: 'Animals and Pets',
    filterKey: 'Animals and Pets',
    bg: 'bg-[#EEF6FF]',
    iconColor: 'text-sky-600',
    Icon: PawPrint,
  },
  {
    label: 'Vehicle',
    filterKey: 'Vehicle',
    bg: 'bg-[#FEF2F2]',
    iconColor: 'text-rose-600',
    Icon: Car,
  },
  {
    label: 'Fashion',
    filterKey: 'Fashion',
    bg: 'bg-[#ECFDF5]',
    iconColor: 'text-emerald-700',
    Icon: Shirt,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  products,
  services,
  testimonials,
  onSelectProduct,
  onSelectService,
  onNavigateCatalog,
  onNavigateServices,
  onOpenAuth,
  onHeroSearch,
}) => {
  const [heroQuery, setHeroQuery] = useState('');
  const [relatedOffset, setRelatedOffset] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onHeroSearch(heroQuery);
  };

  const featuredIds = [
    'aeroknit-running-sneakers',
    'sahara-dome-camping-tent',
    'pulsepro-massage-gun',
    'smart-auto-pet-feeder',
    'turbovac-car-vacuum',
    'cognac-leather-tote',
    'studio-beechwood-easel-kit',
    'aethera-hepa-air-purifier',
    'boucle-sisal-cat-tower',
    'roadwarrior-obd2-scanner',
  ];
  const diversePool = [
    ...featuredIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p)),
    ...products.filter((p) => !featuredIds.includes(p.id)),
  ];
  const slideStart = (relatedOffset * 3) % Math.max(1, diversePool.length);
  const relatedWindow =
    diversePool.slice(slideStart, slideStart + 3).length === 3
      ? diversePool.slice(slideStart, slideStart + 3)
      : [...diversePool.slice(slideStart), ...diversePool].slice(0, 3);
  const trendingProducts = diversePool.slice(0, 6);

  return (
    <main className="pb-16">
      {/* HERO BANNER matching Landing Page design with dancing boxes & items */}
      <section className="relative bg-gradient-to-br from-[#EFEFFD] via-[#F7F6FE] to-[#FFFFFF] border-b border-[#ECEAF6] overflow-x-clip">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5 relative z-10">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[1.15] text-[#141221] text-balance">
                Connecting sellers and buyers where convenience meet innovation
              </h1>
              <p className="text-base text-[#48455A] max-w-md">
                Nigeria’s trusted marketplace for verified products, express Lagos dispatch, and
                vetted local services.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="h-11 px-8 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>

            {/* Animated Hero Cart + Dancing Boxes & Floating Mini Items */}
            <div className="lg:col-span-6 py-4 sm:py-6">
              <div className="relative max-w-[540px] mx-auto px-4 sm:px-6">
                {/* Ambient floating glow */}
                <div
                  className="absolute -inset-4 bg-gradient-to-tr from-[#5E35F2]/12 via-[#A78BFA]/10 to-amber-200/20 rounded-[40px] blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Central Marketplace Cart Frame */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: [0, -6, 0], rotate: [0, 0.7, -0.5, 0] }
                  }
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white border border-[#E7E4F5] shadow-[0_18px_46px_rgba(94,53,242,0.14)]"
                >
                  <img
                    src="/src/assets/images/hero_marketplace_shopping_1795486248117.jpg"
                    alt="Curated Eazetrades shopping cart with headphones, gift boxes, and fashion packages"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Dancing Item 1: Top-Left Amber Gift Parcel Box */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [-8, 8, -8],
                          x: [-3, 5, -3],
                          rotate: [-8, 6, -8],
                        }
                  }
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 left-0 sm:-left-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-[#ECEAF6] rounded-2xl p-2 sm:p-2.5 shadow-[0_10px_28px_rgba(20,18,33,0.12)]"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="pr-1.5 hidden sm:block">
                    <p className="text-[11px] font-bold text-[#141221] leading-tight">Express Box</p>
                    <p className="text-[10px] text-[#5E35F2] font-semibold">2–4 hr Lagos</p>
                  </div>
                </motion.div>

                {/* Dancing Item 2: Top-Right Violet Shopping Bag + Headphones Thumb */}
                <motion.button
                  type="button"
                  onClick={() => products[0] && onSelectProduct(products[0])}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [6, -10, 6],
                          x: [4, -4, 4],
                          rotate: [6, -5, 6],
                        }
                  }
                  transition={{ duration: 4.3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute -top-5 right-1 sm:-right-3 z-20 flex items-center gap-2 bg-white border border-[#E2DCF8] rounded-2xl p-2 shadow-[0_12px_30px_rgba(94,53,242,0.18)] cursor-pointer hover:border-[#5E35F2] transition-colors"
                >
                  <img
                    src="/src/assets/images/headphones_main_1795452533961.jpg"
                    alt="Studio Pro Headphones"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover bg-[#F5F5F7]"
                  />
                  <div className="text-left pr-1.5">
                    <p className="text-[11px] font-bold text-[#141221] leading-tight">Studio ANC</p>
                    <p className="text-[11px] font-bold text-[#5E35F2] tabular-nums">₦38,000</p>
                  </div>
                </motion.button>

                {/* Dancing Item 3: Left Floating Coral Shopping Bag */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [8, -9, 8],
                          rotate: [-12, 8, -12],
                          scale: [1, 1.06, 1],
                        }
                  }
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute top-1/2 -left-1 sm:-left-5 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#5E35F2] to-[#7C5CFC] text-white shadow-[0_12px_26px_rgba(94,53,242,0.30)] flex items-center justify-center border-2 border-white"
                  aria-hidden="true"
                >
                  <ShoppingBag className="w-6 h-6" />
                </motion.div>

                {/* Dancing Item 4: Bottom-Left Smartwatch Tile */}
                <motion.button
                  type="button"
                  onClick={() => products[4] && onSelectProduct(products[4])}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [-6, 10, -6],
                          x: [-4, 4, -4],
                          rotate: [4, -6, 4],
                        }
                  }
                  transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.85 }}
                  className="absolute -bottom-5 left-2 sm:left-4 z-20 flex items-center gap-2 bg-white/95 border border-[#ECEAF6] rounded-2xl p-2 shadow-[0_12px_28px_rgba(20,18,33,0.12)] cursor-pointer hover:border-[#5E35F2]"
                >
                  <img
                    src="/src/assets/images/product_smartwatch_1795452534296.jpg"
                    alt="Apex Smartwatch"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover bg-[#F5F5F7]"
                  />
                  <div className="text-left pr-1.5">
                    <p className="text-[11px] font-bold text-[#141221] leading-tight">Apex Watch</p>
                    <p className="text-[11px] font-bold text-[#5E35F2] tabular-nums">₦45,000</p>
                  </div>
                </motion.button>

                {/* Dancing Item 5: Bottom-Right Mint Box & Deal Tag */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [7, -8, 7],
                          x: [3, -5, 3],
                          rotate: [-5, 7, -5],
                        }
                  }
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                  className="absolute -bottom-4 right-2 sm:right-6 z-20 flex items-center gap-2 bg-white/95 border border-[#ECEAF6] rounded-2xl p-2 sm:p-2.5 shadow-[0_12px_28px_rgba(20,18,33,0.12)]"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="pr-1">
                    <p className="text-[11px] font-bold text-[#141221] leading-tight">
                      Pay on Delivery / Escrow
                    </p>
                    <p className="text-[10px] text-[#646175]">Inspect before settlement</p>
                  </div>
                </motion.div>

                {/* Dancing Item 6: Mid-Right Sparkle Parcel Cube */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [-9, 7, -9],
                          rotate: [10, -10, 10],
                          scale: [0.96, 1.06, 0.96],
                        }
                  }
                  transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
                  className="hidden sm:flex absolute top-[38%] -right-4 z-20 w-11 h-11 rounded-2xl bg-[#FFF5E6] border border-amber-200 text-amber-600 shadow-lg items-center justify-center"
                  aria-hidden="true"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Centered Search Bar overlapping Hero Bottom Edge */}
        <div className="max-w-[680px] mx-auto px-4 -mt-8 relative z-10 translate-y-8">
          <form
            onSubmit={handleHeroSubmit}
            className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,18,33,0.08)] border border-[#ECEAF6] p-2.5 flex items-center gap-2"
          >
            <input
              type="search"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              placeholder="Search products, fashion, electronics, or services..."
              aria-label="Search marketplace"
              className="flex-1 h-11 px-4 text-sm text-[#141221] placeholder:text-[#8A879C] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search Eazetrades"
              className="w-11 h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 1: Browse by categories */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221]">
            Browse by categories
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateCatalog('All')}
              aria-label="Previous categories"
              className="w-9 h-9 rounded-full border border-[#E7E4F5] bg-white hover:border-[#5E35F2] text-[#646175] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateCatalog('Fashion')}
              aria-label="Next categories"
              className="w-9 h-9 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.Icon;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => onNavigateCatalog(cat.filterKey)}
                className="group bg-white rounded-2xl border border-[#ECEAF6] hover:border-[#5E35F2] p-5 text-center shadow-[0_4px_16px_rgba(20,18,33,0.03)] hover:shadow-[0_10px_28px_rgba(94,53,242,0.09)] transition-all cursor-pointer flex flex-col items-center gap-3.5"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#141221] group-hover:text-[#5E35F2] transition-colors">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Related searches carousel */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221] mx-auto">
            Related searches
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedWindow.map((product) => (
            <article
              key={`rel-${product.id}`}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-3.5">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                {product.isPremiumAd && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-[#5E35F2]">
                    Premium Ad
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-[#5E35F2]">
                  {product.category} · {product.condition === 'New' ? 'New' : 'Second-Hand'}
                </span>
                <span className="text-sm font-bold text-[#141221] tabular-nums">
                  {formatNaira(product.price)}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] truncate mb-1">
                {product.name}
              </h3>
              <p className="text-[11px] font-medium text-[#646175] mb-2">
                {getPaymentPolicyLabel(product.paymentPolicy)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#5E35F2] mb-3.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.location}</span>
              </div>
              <div className="mt-auto pt-3 border-t border-[#F2F0FA] flex items-center justify-between">
                <span className="text-xs font-medium text-[#3B384A] tabular-nums">
                  {product.visits} Visits
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setRelatedOffset(dotIdx)}
              aria-label={`Show related search slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                relatedOffset === dotIdx ? 'w-5 bg-[#5E35F2]' : 'w-2 bg-[#D6D1EE]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: All trending products */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221] text-center mb-8">
          All trending products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <article
              key={`trend-${product.id}`}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-3.5">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                {product.isPremiumAd && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-[#5E35F2]">
                    Premium Ad
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-[#5E35F2]">
                  {product.category} · {product.condition === 'New' ? 'New' : 'Second-Hand'}
                </span>
                <span className="text-sm font-bold text-[#141221] tabular-nums">
                  {formatNaira(product.price)}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] truncate mb-1">
                {product.name}
              </h3>
              <p className="text-[11px] font-medium text-[#646175] mb-2">
                {getPaymentPolicyLabel(product.paymentPolicy)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#5E35F2] mb-3.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.location}</span>
              </div>
              <div className="mt-auto pt-3 border-t border-[#F2F0FA] flex items-center justify-between">
                <span className="text-xs font-medium text-[#3B384A] tabular-nums">
                  {product.visits} Visits
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigateCatalog('All')}
            className="h-10 px-6 rounded-xl border border-[#D4CCF7] bg-white hover:border-[#5E35F2] hover:text-[#5E35F2] text-xs font-semibold text-[#3B384A] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>View all products</span>
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* SECTION 4: All services */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221] text-center mb-8">
          All services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <article
              key={`land-srv-${service.id}`}
              onClick={() => onSelectService(service)}
              className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-3.5">
                <img
                  src={service.image}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                {service.isPremiumAd && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-[#5E35F2]">
                    Premium Ad
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-[#5E35F2]">{service.category}</span>
                <span className="text-xs font-bold text-[#141221]">{service.priceLabel}</span>
              </div>
              <h3 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] truncate mb-2">
                {service.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#5E35F2] mb-3.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{service.location}</span>
              </div>
              <div className="mt-auto pt-3 border-t border-[#F2F0FA] flex items-center justify-between">
                <span className="text-xs font-medium text-[#3B384A] tabular-nums">
                  {service.visits} Visits
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onNavigateServices}
            className="h-10 px-6 rounded-xl border border-[#D4CCF7] bg-white hover:border-[#5E35F2] hover:text-[#5E35F2] text-xs font-semibold text-[#3B384A] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>View all services</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="text-center space-y-1.5 mb-8">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#5E35F2]">
            Testimonials
          </p>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221]">
            Hear what our clients say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl border p-6 shadow-[0_6px_24px_rgba(20,18,33,0.04)] flex flex-col justify-between gap-5 transition-colors ${
                testimonialIndex === idx ? 'border-[#5E35F2]/50' : 'border-[#ECEAF6]'
              }`}
            >
              <div className="space-y-3">
                <span className="font-display font-bold text-sm text-[#5E35F2]">
                  {item.company}
                </span>
                <p className="text-sm text-[#48455A] leading-relaxed">“{item.quote}”</p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#F2F0FA]">
                <img
                  src={item.avatar}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover bg-[#F5F5F7]"
                />
                <div>
                  <p className="text-xs font-bold text-[#141221]">{item.author}</p>
                  <p className="text-[11px] text-[#646175]">
                    {item.role} · {item.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTestimonialIndex(idx)}
              aria-label={`Highlight testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                testimonialIndex === idx ? 'w-5 bg-[#5E35F2]' : 'w-2 bg-[#D6D1EE]'
              }`}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

