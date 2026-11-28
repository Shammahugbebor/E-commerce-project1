import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceListing } from '../data/marketplace';

interface ServicesPageProps {
  services: ServiceListing[];
  searchQuery: string;
  onSelectService: (service: ServiceListing) => void;
  onNavigateHome: () => void;
}

const SERVICE_CATEGORIES = ['All', 'Services', 'Tech', 'Assistance', 'Cooking', 'Tutor', 'Engineer'];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  searchQuery,
  onSelectService,
  onNavigateHome,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rate-asc'>('popular');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredServices = useMemo(() => {
    const base = services.filter((srv) => {
      if (selectedCategory !== 'All' && srv.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          srv.title.toLowerCase().includes(q) ||
          srv.category.toLowerCase().includes(q) ||
          srv.providerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (sortBy === 'rate-asc') {
      return [...base].sort((a, b) => a.startingRate - b.startingRate);
    }
    return [...base].sort((a, b) => b.visits - a.visits);
  }, [services, selectedCategory, sortBy, searchQuery]);

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filteredServices.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-20">
      {/* Breadcrumb matching Services Page screenshot */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#646175] flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-[#5E35F2] transition-colors cursor-pointer"
        >
          Main page
        </button>
        <span aria-hidden="true">&gt;&gt;</span>
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className="hover:text-[#5E35F2] transition-colors cursor-pointer"
        >
          Category
        </button>
        <span aria-hidden="true">&gt;&gt;</span>
        <span className="text-[#141221] font-medium">Services</span>
      </nav>

      {/* Title & Filter Button */}
      <div className="relative flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141221]">Services</h1>
          <p className="text-sm text-[#646175] mt-1">
            Vetted Lagos specialists for dispatch, tech support, catering, tutoring, and repairs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-expanded={filterOpen}
          className="h-10 px-4 rounded-xl bg-white border border-[#E7E4F5] hover:border-[#5E35F2] text-xs sm:text-sm font-medium text-[#3B384A] flex items-center gap-2.5 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Sort by: Filter</span>
          <SlidersHorizontal className="w-4 h-4 text-[#5E35F2]" />
        </button>

        {filterOpen && (
          <div className="absolute right-0 top-14 w-full sm:w-[360px] bg-white border border-[#E7E4F5] rounded-2xl shadow-xl p-6 z-30 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-[#141221]">Filter Services</span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F6F5FB] text-[#646175] flex items-center justify-center cursor-pointer"
                aria-label="Close service filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Service Category</h3>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                        : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Sort Order</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                    sortBy === 'popular'
                      ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                      : 'border-[#E7E4F5] text-[#3B384A]'
                  }`}
                >
                  Most Visited
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('rate-asc')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                    sortBy === 'rate-asc'
                      ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                      : 'border-[#E7E4F5] text-[#3B384A]'
                  }`}
                >
                  Lowest Rate
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ECEAF6]">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSortBy('popular');
                }}
                className="text-xs font-medium text-[#646175] hover:text-[#141221] cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#5E35F2] text-white text-xs font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3x3 Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((service) => (
          <article
            key={service.id}
            onClick={() => onSelectService(service)}
            className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-4">
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

            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-medium text-[#5E35F2]">{service.category}</span>
              <span className="text-xs font-bold text-[#141221]">{service.priceLabel}</span>
            </div>

            <h2 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] transition-colors line-clamp-1 mb-2">
              {service.title}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-[#5E35F2] mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
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
                className="px-4 py-1.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Preview
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-[#646175]">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2 rounded-lg hover:bg-white disabled:opacity-40 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center tabular-nums cursor-pointer ${
              safePage === page
                ? 'bg-[#5E35F2] text-white font-semibold'
                : 'bg-white border border-[#ECEAF6] text-[#3B384A]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2 rounded-lg hover:bg-white disabled:opacity-40 flex items-center gap-1 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </main>
  );
};

