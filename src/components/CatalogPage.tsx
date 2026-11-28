import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, MapPin, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  Product,
  PRODUCT_CATEGORIES,
  formatNaira,
  getPaymentPolicyLabel,
  matchesProductSearch,
} from '../data/products';

interface CatalogPageProps {
  products: Product[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateHome?: () => void;
}

const CATEGORIES = ['All', ...PRODUCT_CATEGORIES];
const FASHION_ITEMS = ['All', 'Clothes', 'Shoes', 'Glasses', 'Accessories'];
const COLOR_OPTIONS = [
  { name: 'Obsidian', hex: '#18181B' },
  { name: 'Black', hex: '#18181B' },
  { name: 'Violet', hex: '#5E35F2' },
  { name: 'Amber', hex: '#EAB308' },
  { name: 'Cobalt', hex: '#2563EB' },
  { name: 'Olive', hex: '#4B5E40' },
  { name: 'Sand', hex: '#D6D3C9' },
];
const SIZE_OPTIONS = ['Size 7', 'Size 8', 'Size 9', 'Size 10'];

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onNavigateHome,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFashionItem, setSelectedFashionItem] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState<'All' | 'New' | 'Second-Hand'>('All');
  const [selectedPaymentFlow, setSelectedPaymentFlow] = useState<
    'All' | 'pay-on-delivery' | 'pay-before-delivery'
  >('All');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    searchQuery,
    selectedFashionItem,
    selectedCondition,
    selectedPaymentFlow,
    maxPrice,
    selectedColor,
    selectedSize,
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== 'All' && product.category !== activeCategory) return false;
      if (selectedFashionItem !== 'All' && product.fashionItem !== selectedFashionItem) return false;
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) return false;
      if (selectedPaymentFlow !== 'All') {
        if (
          selectedPaymentFlow === 'pay-on-delivery' &&
          product.paymentPolicy === 'pay-before-delivery'
        ) {
          return false;
        }
        if (
          selectedPaymentFlow === 'pay-before-delivery' &&
          product.paymentPolicy === 'pay-on-delivery'
        ) {
          return false;
        }
      }
      if (product.price > maxPrice) return false;
      if (
        selectedColor &&
        !product.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      ) {
        return false;
      }
      if (selectedSize && !product.sizes.includes(selectedSize)) return false;
      if (searchQuery.trim() && !matchesProductSearch(product, searchQuery)) return false;
      return true;
    });
  }, [
    products,
    activeCategory,
    selectedFashionItem,
    selectedCondition,
    selectedPaymentFlow,
    maxPrice,
    selectedColor,
    selectedSize,
    searchQuery,
  ]);

  const displayProducts = filteredProducts;
  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(displayProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = displayProducts.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleResetFilters = () => {
    onCategoryChange('All');
    onSearchChange('');
    setSelectedFashionItem('All');
    setSelectedCondition('All');
    setSelectedPaymentFlow('All');
    setMaxPrice(200000);
    setSelectedColor(null);
    setSelectedSize(null);
    setCurrentPage(1);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-20">
      {/* Breadcrumb matching Eazetrades design */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#646175] flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => (onNavigateHome ? onNavigateHome() : onCategoryChange('All'))}
          className="hover:text-[#5E35F2] transition-colors cursor-pointer"
        >
          Main page
        </button>
        <span aria-hidden="true">&gt;&gt;</span>
        <button
          type="button"
          onClick={() => onCategoryChange('All')}
          className="hover:text-[#5E35F2] transition-colors cursor-pointer"
        >
          Category
        </button>
        <span aria-hidden="true">&gt;&gt;</span>
        <span className="text-[#141221] font-medium">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </span>
      </nav>

      {/* Heading + Inline Search + Sort by: Filter Trigger */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141221]">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h1>
          <p className="text-sm text-[#646175] mt-1 tabular-nums">
            Showing {displayProducts.length} verified listing{displayProducts.length === 1 ? '' : 's'}
            {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="w-4 h-4 text-[#8A879C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items, vehicle, pets..."
              aria-label="Search catalog products"
              className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm rounded-xl bg-white border border-[#E7E4F5] text-[#141221] placeholder:text-[#8A879C] focus:outline-none focus:border-[#5E35F2]"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear catalog search"
                className="w-6 h-6 rounded-full hover:bg-[#F6F5FB] text-[#646175] flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
        </div>

        {/* Filter Popover matching the uploaded design */}
        {filterOpen && (
          <div className="absolute right-0 top-14 w-full sm:w-[400px] bg-white border border-[#E7E4F5] rounded-2xl shadow-xl p-6 z-30">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-base text-[#141221]">Filter Products</span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F6F5FB] text-[#646175] flex items-center justify-center cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Category */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                          : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Condition: New vs Second-Hand */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Condition</h3>
                <div className="flex flex-wrap gap-2">
                  {(['All', 'New', 'Second-Hand'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => {
                        setSelectedCondition(cond);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedCondition === cond
                          ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                          : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                      }`}
                    >
                      {cond === 'New' ? 'Brand New' : cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment / Trust Flow */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Checkout Flow</h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { label: 'All Flows', value: 'All' },
                      { label: 'Pay on Delivery', value: 'pay-on-delivery' },
                      { label: 'Pay Before Delivery / Pickup', value: 'pay-before-delivery' },
                    ] as const
                  ).map((flow) => (
                    <button
                      key={flow.value}
                      type="button"
                      onClick={() => {
                        setSelectedPaymentFlow(flow.value);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedPaymentFlow === flow.value
                          ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                          : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                      }`}
                    >
                      {flow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fashion item */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Fashion item</h3>
                <div className="flex flex-wrap gap-2">
                  {FASHION_ITEMS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedFashionItem(item);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedFashionItem === item
                          ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                          : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-[#141221]">Filter by price</h3>
                  <span className="text-xs font-semibold text-[#5E35F2] tabular-nums">
                    Up to {formatNaira(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={200000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum price filter"
                  className="w-full accent-[#5E35F2] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#8A879C] tabular-nums mt-1">
                  <span>15,000 NGN</span>
                  <span>200,000 NGN</span>
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                      aria-label={`Filter by ${c.name}`}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                        selectedColor === c.name
                          ? 'ring-2 ring-offset-2 ring-[#5E35F2] scale-105'
                          : 'border-black/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-xs font-semibold text-[#141221] mb-2.5">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                          : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#ECEAF6]">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-medium text-[#646175] hover:text-[#141221] cursor-pointer"
                >
                  Reset filters
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Switcher Tabs for Instant One-Click Browsing */}
      <div className="flex flex-wrap items-center gap-2 mb-7">
        {CATEGORIES.map((cat) => {
          const catCount =
            cat === 'All'
              ? products.length
              : products.filter((p) => p.category === cat).length;
          return (
            <button
              key={`tab-${cat}`}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#5E35F2] text-white border-[#5E35F2] shadow-xs'
                  : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2] hover:text-[#5E35F2]'
              }`}
            >
              {cat === 'All' ? `All Categories (${catCount})` : `${cat} (${catCount})`}
            </button>
          );
        })}
      </div>

      {/* 3-Column Product Grid matching screenshot */}
      {pageItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ECEAF6] p-12 text-center space-y-3">
          <p className="font-display font-semibold text-lg text-[#141221]">
            No products match your active filters
          </p>
          <p className="text-sm text-[#646175]">
            Try broadening your price range or resetting the category filter.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-2 px-5 py-2.5 rounded-full bg-[#5E35F2] text-white text-sm font-semibold hover:bg-[#4D26D9] cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((product) => (
            <article
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-4">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                {product.isPremiumAd && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#5E35F2]">
                    Premium Ad
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-[#5E35F2]">
                  {product.category} ·{' '}
                  <span
                    className={
                      product.condition === 'Second-Hand' ? 'text-amber-700' : 'text-emerald-700'
                    }
                  >
                    {product.condition === 'Second-Hand' ? 'Second-Hand' : 'New'}
                  </span>
                </span>
                <span className="text-sm font-bold text-[#141221] tabular-nums">
                  {formatNaira(product.price)}
                </span>
              </div>

              <h2 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] transition-colors line-clamp-1 mb-1.5">
                {product.name}
              </h2>

              <p className="text-[11px] font-medium text-[#646175] mb-2">
                {getPaymentPolicyLabel(product.paymentPolicy)}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-[#5E35F2] mb-4">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
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
                  className="px-4 py-1.5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination matching screenshot */}
      <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-[#646175]">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2 rounded-lg hover:bg-white hover:text-[#141221] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center tabular-nums transition-colors cursor-pointer ${
              safePage === page
                ? 'bg-[#5E35F2] text-white font-semibold'
                : 'bg-white border border-[#ECEAF6] text-[#3B384A] hover:border-[#5E35F2]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2 rounded-lg hover:bg-white hover:text-[#141221] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </main>
  );
};

