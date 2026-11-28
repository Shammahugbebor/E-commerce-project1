import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  Package,
  Users,
  Eye,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { VendorProfile } from '../data/marketplace';

interface VendorsDirectoryPageProps {
  vendors: VendorProfile[];
  onSelectVendor: (vendor: VendorProfile) => void;
  onNavigateHome: () => void;
  onBecomeVendor: () => void;
}

const SPECIALTY_FILTERS: Array<
  'All' | 'Fashion & Footwear' | 'Audio & Tech' | 'Home & Living' | 'Services & Repairs'
> = ['All', 'Fashion & Footwear', 'Audio & Tech', 'Home & Living', 'Services & Repairs'];

export const VendorsDirectoryPage: React.FC<VendorsDirectoryPageProps> = ({
  vendors,
  onSelectVendor,
  onNavigateHome,
  onBecomeVendor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'visits' | 'rating' | 'listings'>('visits');

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        if (selectedSpecialty !== 'All' && vendor.specialty !== selectedSpecialty) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            vendor.name.toLowerCase().includes(q) ||
            vendor.location.toLowerCase().includes(q) ||
            vendor.specialty.toLowerCase().includes(q) ||
            vendor.bio.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'listings') {
          return b.productIds.length + b.serviceIds.length - (a.productIds.length + a.serviceIds.length);
        }
        return b.profileVisits - a.profileVisits;
      });
  }, [vendors, selectedSpecialty, searchQuery, sortBy]);

  return (
    <main className="pb-20">
      {/* Directory Header Banner */}
      <section className="bg-gradient-to-br from-[#EFEFFD] via-[#F7F6FE] to-white border-b border-[#ECEAF6]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#646175] mb-5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#5E35F2] transition-colors cursor-pointer"
            >
              Main page
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#9B97AE]" />
            <span className="font-semibold text-[#141221]">Verified Vendors</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5E35F2]">
                Eazetrades Merchant Directory
              </p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#141221]">
                Browse Verified Vendors & Studios
              </h1>
              <p className="text-sm sm:text-base text-[#48455A]">
                Explore trusted storefronts across Lagos and Abuja. Select any vendor to inspect
                their live catalog, service offerings, and customer response times.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onBecomeVendor}
                className="h-11 px-6 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Open Seller Storefront
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-8 bg-white rounded-2xl border border-[#E5E2F5] p-3 shadow-[0_8px_28px_rgba(20,18,33,0.05)] flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A879C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors by store name, Ikeja, Abuja, or specialty..."
                aria-label="Search vendors"
                className="w-full h-10 pl-10 pr-4 text-sm bg-[#F8F7FC] border border-[#E7E4F5] rounded-xl text-[#141221] placeholder:text-[#8A879C] focus:outline-none focus:bg-white focus:border-[#5E35F2]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="vendor-sort" className="text-xs font-semibold text-[#646175] shrink-0">
                Sort by:
              </label>
              <select
                id="vendor-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'visits' | 'rating' | 'listings')}
                className="h-10 px-3 rounded-xl border border-[#E7E4F5] bg-[#F8F7FC] text-xs font-semibold text-[#141221] focus:outline-none focus:border-[#5E35F2] cursor-pointer"
              >
                <option value="visits">Most Visited</option>
                <option value="rating">Highest Rated</option>
                <option value="listings">Most Listings</option>
              </select>
            </div>
          </div>

          {/* Specialty Filter Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {SPECIALTY_FILTERS.map((specialty) => {
              const active = selectedSpecialty === specialty;
              return (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#5E35F2] text-white'
                      : 'bg-white border border-[#E5E2F5] text-[#48455A] hover:border-[#5E35F2] hover:text-[#5E35F2]'
                  }`}
                >
                  {specialty}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vendors Directory Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-[#646175] tabular-nums">
            Showing <strong className="text-[#141221]">{filteredVendors.length}</strong> verified
            storefronts
          </p>
        </div>

        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <article
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                className="group bg-white rounded-2xl border border-[#ECEAF6] overflow-hidden shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_14px_34px_rgba(94,53,242,0.10)] hover:border-[#C7BDF8] transition-all cursor-pointer flex flex-col"
              >
                {/* Cover Banner + Overlapping Avatar */}
                <div className="relative h-36 bg-[#141221] overflow-hidden">
                  <img
                    src={vendor.bannerImage}
                    alt={`${vendor.name} storefront banner`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-[#5E35F2]">
                    {vendor.specialty}
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141221]/80 text-[11px] font-semibold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="px-5 pt-0 pb-5 flex-1 flex flex-col">
                  {/* Avatar + Store Name Row */}
                  <div className="flex items-end justify-between gap-3 -mt-8 relative z-10 mb-3">
                    <div className="w-16 h-16 rounded-2xl border-3 border-white bg-white shadow-md overflow-hidden shrink-0">
                      <img
                        src={vendor.avatarImage}
                        alt={vendor.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-[#F6F5FB] px-2.5 py-1 rounded-lg border border-[#E7E4F5]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-[#141221] tabular-nums">
                        {vendor.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-[#646175] tabular-nums">
                        ({vendor.reviewCount})
                      </span>
                    </div>
                  </div>

                  <h2 className="font-display font-bold text-lg text-[#141221] group-hover:text-[#5E35F2] transition-colors">
                    {vendor.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#646175] mt-1 mb-3">
                    <span className="inline-flex items-center gap-1 text-[#5E35F2] font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {vendor.location}
                    </span>
                    <span>· {vendor.responseRate}</span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#48455A] leading-relaxed line-clamp-2 mb-4">
                    {vendor.bio}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F2F0FA] text-center mb-4 mt-auto">
                    <div>
                      <p className="inline-flex items-center gap-1 text-xs font-bold text-[#141221] tabular-nums">
                        <Package className="w-3.5 h-3.5 text-[#5E35F2]" />
                        {vendor.productIds.length}
                      </p>
                      <p className="text-[11px] text-[#646175]">Products</p>
                    </div>
                    <div>
                      <p className="inline-flex items-center gap-1 text-xs font-bold text-[#141221] tabular-nums">
                        <Users className="w-3.5 h-3.5 text-[#5E35F2]" />
                        {vendor.serviceIds.length}
                      </p>
                      <p className="text-[11px] text-[#646175]">Services</p>
                    </div>
                    <div>
                      <p className="inline-flex items-center gap-1 text-xs font-bold text-[#141221] tabular-nums">
                        <Eye className="w-3.5 h-3.5 text-[#5E35F2]" />
                        {vendor.profileVisits}
                      </p>
                      <p className="text-[11px] text-[#646175]">Visits</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVendor(vendor);
                    }}
                    className="w-full h-10 rounded-full bg-[#F6F5FB] group-hover:bg-[#5E35F2] text-[#5E35F2] group-hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Visit Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#ECEAF6] p-12 text-center space-y-3">
            <p className="font-display font-bold text-lg text-[#141221]">
              No vendors matched your filter
            </p>
            <p className="text-sm text-[#646175]">
              Try clearing your search query or switching to All Vendors.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="px-5 py-2 rounded-full bg-[#5E35F2] text-white text-xs font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

