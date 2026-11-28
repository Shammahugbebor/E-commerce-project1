import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ZoomIn,
  X,
  ArrowRight,
  Minus,
  Plus,
} from 'lucide-react';
import { Product, ProductReview, formatNaira, getPaymentPolicyLabel } from '../data/products';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  reviews: ProductReview[];
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onAddToBag: (product: Product, color: string, size: string, quantity: number) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onMarkHelpful: (productId: string, reviewId: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCatalog: (category?: string) => void;
  onNavigateHome?: () => void;
  onViewVendor?: (vendorName: string) => void;
  onOpenBag?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  reviews,
  isSaved,
  onToggleSave,
  onAddToBag,
  onAddReview,
  onMarkHelpful,
  onSelectProduct,
  onNavigateCatalog,
  onNavigateHome,
  onViewVendor,
  onOpenBag,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'shipping' | 'warranty' | 'specs'>('shipping');

  // Reviews UI state
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  // Newsletter section state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(product.colors[0]?.name || 'Default');
    setSelectedSize(product.sizes[0] || 'Standard');
    setQuantity(1);
    setAddedFeedback(false);
    setStarFilter('all');
  }, [product]);

  const activeImage = product.images[activeImageIndex] || product.images[0];
  // Main image + 4 additional thumbnails (all 5 gallery views accessible)
  const thumbnails = product.images.slice(0, 5);

  const totalReviewCount = product.reviewCount + Math.max(0, reviews.length - 3);
  const averageRating =
    reviews.length > 0
      ? Number(
          (
            (product.rating * product.reviewCount +
              reviews.slice(3).reduce((acc, r) => acc + r.rating, 0)) /
            totalReviewCount
          ).toFixed(1)
        )
      : product.rating;

  const ratingDistribution = [
    { stars: 5, percent: 82 },
    { stars: 4, percent: 12 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
  ];

  const filteredReviews =
    starFilter === 'all'
      ? reviews
      : starFilter === 3
        ? reviews.filter((r) => r.rating <= 3)
        : reviews.filter((r) => r.rating === starFilter);

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddClick = () => {
    onAddToBag(product, selectedColor, selectedSize, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewTitle.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewerName.trim(),
      location: reviewerLocation.trim() || 'Lagos, Nigeria',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verified: true,
    });
    setReviewerName('');
    setReviewerLocation('');
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewFormOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <main className="pb-16">
      {/* Top Breadcrumb + Catalog Return */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="text-xs text-[#646175] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => (onNavigateHome ? onNavigateHome() : onNavigateCatalog('All'))}
            className="hover:text-[#5E35F2] transition-colors cursor-pointer"
          >
            Main page
          </button>
          <span aria-hidden="true">&gt;&gt;</span>
          <button
            type="button"
            onClick={() => onNavigateCatalog('All')}
            className="hover:text-[#5E35F2] transition-colors cursor-pointer"
          >
            Category
          </button>
          <span aria-hidden="true">&gt;&gt;</span>
          <button
            type="button"
            onClick={() => onNavigateCatalog(product.category)}
            className="hover:text-[#5E35F2] transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <span aria-hidden="true">&gt;&gt;</span>
          <span className="text-[#141221] font-medium truncate max-w-[220px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => onNavigateCatalog(product.category)}
          className="text-xs font-semibold text-[#5E35F2] hover:text-[#4D26D9] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to {product.category}</span>
        </button>
      </div>

      {/* SECTION 1: Product Hero — Gallery (Main + 4 Additional Thumbnails) + Contiguous Purchase Module */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image with 4 Additional Thumbnails */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#F5F5F7] border border-[#ECEAF6] overflow-hidden group">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Gallery Controls */}
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev - 1 + thumbnails.length) % thumbnails.length)
                }
                aria-label="Previous product image"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#141221] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % thumbnails.length)}
                aria-label="Next product image"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#141221] shadow-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Inspect full-size product image"
                className="absolute bottom-3.5 right-3.5 h-9 px-3 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-[#141221] shadow-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#5E35F2]" />
                <span>Zoom</span>
              </button>
            </div>

            {/* 5 Gallery Thumbnails (Main + 4 Additional Views) */}
            <div className="grid grid-cols-5 gap-3" role="tablist" aria-label="Product angles">
              {thumbnails.map((thumb, index) => {
                const isActive = index === activeImageIndex;
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveImageIndex(index)}
                    className={`group text-left rounded-xl overflow-hidden border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E35F2] ${
                      isActive
                        ? 'border-[#5E35F2] ring-2 ring-[#5E35F2]/25 bg-white'
                        : 'border-[#ECEAF6] hover:border-[#C7BDF8] bg-[#F5F5F7]'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={thumb.src}
                        alt={thumb.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="px-2 py-1.5 bg-white hidden sm:block">
                      <p
                        className={`text-[11px] truncate font-medium ${
                          isActive ? 'text-[#5E35F2]' : 'text-[#646175]'
                        }`}
                      >
                        {thumb.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Product Information (Name, Price, Rating), 60-word Description, Variants & Buy Module */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ECEAF6] p-6 sm:p-8 shadow-[0_6px_28px_rgba(20,18,33,0.04)] space-y-6">
            {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#646175]">
              <span className="font-semibold text-[#5E35F2]">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-semibold ${
                  product.condition === 'Second-Hand' ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {product.condition === 'Second-Hand' ? 'Second-Hand' : 'Brand New'}
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onViewVendor?.(product.vendorName)}
                className="hover:text-[#5E35F2] hover:underline transition-colors cursor-pointer"
              >
                {product.vendorName}
              </button>
              <span aria-hidden="true">·</span>
              <span className="text-[#141221] font-medium">
                {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
              </span>
            </div>

            {/* Product Name */}
            <div className="space-y-2.5">
              <h1 className="font-display font-bold text-2xl sm:text-[30px] leading-tight text-[#141221] text-balance">
                {product.name}
              </h1>

              {/* Rating & Review Count */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1" aria-label={`Rated ${averageRating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#DCD9EC]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#141221] tabular-nums">{averageRating}</span>
                <a
                  href="#product-reviews"
                  className="text-[#5E35F2] hover:underline font-medium tabular-nums"
                >
                  {totalReviewCount} verified reviews
                </a>
                <span className="text-[#D4D0E5]" aria-hidden="true">|</span>
                <span className="text-xs text-[#646175] tabular-nums">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-display font-bold text-3xl text-[#141221] tabular-nums">
                {formatNaira(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-base text-[#8A879C] line-through tabular-nums">
                    {formatNaira(product.compareAtPrice)}
                  </span>
                  <span className="text-xs font-semibold text-[#5E35F2] tabular-nums">
                    Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Product Description (60 words) & Condition + Payment Trust Details */}
            <div className="pt-4 border-t border-[#F0EEF8] space-y-4">
              <div>
                <h2 className="text-xs font-semibold text-[#141221] mb-2">Product Overview</h2>
                <p className="text-[15px] leading-relaxed text-[#48455A] max-w-[65ch]">
                  {product.description60Words}
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F7FC] border border-[#E6E4F3] p-4 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-[#141221] shrink-0">Condition:</span>
                  <span className="text-right text-[#48455A]">
                    <strong
                      className={
                        product.condition === 'Second-Hand' ? 'text-amber-700' : 'text-emerald-700'
                      }
                    >
                      {product.condition === 'Second-Hand' ? 'Second-Hand' : 'Brand New'}
                    </strong>{' '}
                    — {product.conditionNote}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#ECEAF6]">
                  <span className="font-semibold text-[#141221] shrink-0">Checkout Flow:</span>
                  <span className="text-right font-medium text-[#5E35F2]">
                    {getPaymentPolicyLabel(product.paymentPolicy)} (No online card needed)
                  </span>
                </div>
              </div>
            </div>

            {/* Color & Edition / Size Variants */}
            <div className="space-y-4 pt-4 border-t border-[#F0EEF8]">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#141221]">Color</span>
                  <span className="text-[#646175]">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((color) => {
                    const active = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={`Select color ${color.name}`}
                        title={color.name}
                        style={{ backgroundColor: color.hex }}
                        className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                          active
                            ? 'ring-2 ring-offset-2 ring-[#5E35F2] scale-105'
                            : 'border-black/15 hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#141221] mb-2">
                  Option / Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#5E35F2] text-white border-[#5E35F2]'
                            : 'bg-white text-[#3B384A] border-[#E7E4F5] hover:border-[#5E35F2]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantity & Primary Purchase CTAs */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center h-12 rounded-full border border-[#E7E4F5] bg-[#FAFAFC] px-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-9 rounded-full hover:bg-white text-[#3B384A] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    aria-label="Increase quantity"
                    className="w-9 h-9 rounded-full hover:bg-white text-[#3B384A] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddClick}
                  className="flex-1 h-12 px-6 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5E35F2]"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSave(product.id)}
                  aria-label={isSaved ? 'Remove from saved items' : 'Save product'}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    isSaved
                      ? 'bg-[#F6F3FF] border-[#5E35F2] text-[#5E35F2]'
                      : 'bg-white border-[#E7E4F5] text-[#646175] hover:border-[#5E35F2]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#5E35F2]' : ''}`} />
                </button>
              </div>

              {/* Direct Reserve / Checkout Shortcut */}
              {onOpenBag && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToBag(product, selectedColor, selectedSize, quantity);
                    onOpenBag();
                  }}
                  className="w-full h-11 rounded-full border border-[#5E35F2] text-[#5E35F2] hover:bg-[#F6F3FF] text-xs font-semibold transition-colors cursor-pointer"
                >
                  {product.paymentPolicy === 'pay-before-delivery'
                    ? 'Enter Details & Reserve (Pay Before Dispatch / Pickup)'
                    : 'Enter Details & Order (Pay on Delivery or Pickup)'}
                </button>
              )}

              {/* Location & Assurance Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#646175]">
                <span className="inline-flex items-center gap-1.5 text-[#5E35F2] font-medium">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dispatched from {product.location}</span>
                </span>
                <span className="tabular-nums">{product.visits} shoppers viewed today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Extra Information (Shipping, Warranty & Technical Specifications) */}
      <section
        id="extra-information"
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#ECEAF6]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#141221]">
              Shipping, Warranty & Extra Information
            </h2>
            <p className="text-sm text-[#646175] mt-1">
              Transparent delivery timelines across Nigeria and official Eazetrades buyer coverage.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Extra product information"
            className="inline-flex items-center p-1 bg-[#F2F0FA] rounded-xl self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeInfoTab === 'shipping'}
              onClick={() => setActiveInfoTab('shipping')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeInfoTab === 'shipping'
                  ? 'bg-white text-[#5E35F2] shadow-xs'
                  : 'text-[#646175] hover:text-[#141221]'
              }`}
            >
              Shipping & Delivery
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeInfoTab === 'warranty'}
              onClick={() => setActiveInfoTab('warranty')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeInfoTab === 'warranty'
                  ? 'bg-white text-[#5E35F2] shadow-xs'
                  : 'text-[#646175] hover:text-[#141221]'
              }`}
            >
              Warranty & Returns
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeInfoTab === 'specs'}
              onClick={() => setActiveInfoTab('specs')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeInfoTab === 'specs'
                  ? 'bg-white text-[#5E35F2] shadow-xs'
                  : 'text-[#646175] hover:text-[#141221]'
              }`}
            >
              Specifications
            </button>
          </div>
        </div>

        {/* Active Tab Content + Always-Visible Shipping/Warranty Highlights */}
        <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 sm:p-8">
          {activeInfoTab === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Same-Day Lagos Dispatch</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.shippingSummary.lagosDispatch}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Nationwide Delivery</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.shippingSummary.nationwideWindow}{' '}
                  {product.shippingSummary.freeShippingThreshold}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Flexible Payment & Escrow</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.shippingSummary.paymentOptions}
                </p>
              </div>
            </div>
          )}

          {activeInfoTab === 'warranty' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{product.warrantySummary.duration}</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.warrantySummary.coverage}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>14-Day Return Window</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.warrantySummary.returnWindow}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5E35F2] font-semibold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Walk-In Service Support</span>
                </div>
                <p className="text-sm text-[#646175] leading-relaxed">
                  {product.warrantySummary.serviceCenter}
                </p>
              </div>
            </div>
          )}

          {activeInfoTab === 'specs' && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-4 py-2.5 border-b border-[#F2F0FA]"
                >
                  <dt className="text-xs font-medium text-[#646175]">{spec.label}</dt>
                  <dd className="text-sm font-semibold text-[#141221] text-right tabular-nums">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* SECTION 3: Product Reviews */}
      <section
        id="product-reviews"
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#ECEAF6]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Rating Summary & Distribution */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#141221]">Customer Reviews</h2>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display font-bold text-4xl text-[#141221] tabular-nums">
                  {averageRating}
                </span>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#DCD9EC]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#646175] mt-1 tabular-nums">
                    Based on {totalReviewCount} verified purchases
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-2.5">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-[#3B384A] font-medium tabular-nums">
                    {row.stars} stars
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#EFEFFD] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5E35F2]"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-[#646175] tabular-nums">{row.percent}%</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReviewFormOpen((prev) => !prev)}
              className="w-full h-11 rounded-full border border-[#5E35F2] text-[#5E35F2] hover:bg-[#5E35F2] hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {reviewFormOpen ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Right: Filter Controls + Write Review Form + Review Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* Star Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: 'All Reviews', value: 'all' },
                    { label: '5 Stars', value: 5 },
                    { label: '4 Stars', value: 4 },
                    { label: '3 Stars & Below', value: 3 },
                  ] as const
                ).map((item) => (
                  <button
                    key={String(item.value)}
                    type="button"
                    onClick={() => setStarFilter(item.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      starFilter === item.value
                        ? 'bg-[#5E35F2] text-white'
                        : 'bg-white border border-[#E7E4F5] text-[#3B384A] hover:border-[#5E35F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-[#646175] tabular-nums">
                Showing {filteredReviews.length} review{filteredReviews.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Interactive Write a Review Form */}
            {reviewFormOpen && (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-2xl border border-[#D4CCF7] p-6 space-y-4"
              >
                <h3 className="font-display font-bold text-base text-[#141221]">
                  Share your experience with {product.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Folake Adewale"
                      className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={reviewerLocation}
                      onChange={(e) => setReviewerLocation(e.target.value)}
                      placeholder="e.g. Lekki, Lagos"
                      className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#141221] mb-1.5">Rating</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} stars`}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#DCD9EC]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your impression"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What stood out about build quality, comfort, or delivery?"
                    className="w-full p-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 h-10 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}

            {/* Review List */}
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ECEAF6] p-8 text-center text-sm text-[#646175]">
                No reviews match this star filter yet.
              </div>
            ) : (
              <div className="divide-y divide-[#ECEAF6] bg-white rounded-2xl border border-[#ECEAF6] px-6">
                {filteredReviews.map((rev) => {
                  const hasVoted = helpfulClicked[rev.id];
                  return (
                    <article key={rev.id} className="py-6 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-[#DCD9EC]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#8A879C] tabular-nums">{rev.date}</span>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#141221]">
                        {rev.title}
                      </h3>
                      <p className="text-sm text-[#48455A] leading-relaxed">{rev.comment}</p>

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-[#646175]">
                        <div>
                          <span className="font-semibold text-[#141221]">{rev.author}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{rev.location}</span>
                          {rev.verified && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span className="text-[#5E35F2] font-medium">Verified Buyer</span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={hasVoted}
                          onClick={() => {
                            setHelpfulClicked((prev) => ({ ...prev, [rev.id]: true }));
                            onMarkHelpful(product.id, rev.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            hasVoted
                              ? 'border-[#5E35F2] bg-[#F6F3FF] text-[#5E35F2]'
                              : 'border-[#ECEAF6] hover:border-[#5E35F2] text-[#646175]'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="tabular-nums">Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: More from Eazetrades Fashion & Lifestyle (Connects smoothly to catalog) */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#ECEAF6]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#141221]">
            Explore More on Eazetrades
          </h2>
          <button
            type="button"
            onClick={() => onNavigateCatalog('Fashion')}
            className="text-sm font-semibold text-[#5E35F2] hover:text-[#4D26D9] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View full catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="group bg-white rounded-2xl border border-[#ECEAF6] p-4 shadow-[0_6px_24px_rgba(20,18,33,0.04)] hover:shadow-[0_12px_32px_rgba(94,53,242,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F5F7] mb-3.5">
                <img
                  src={item.images[0].src}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-[#5E35F2]">{item.category}</span>
                <span className="text-sm font-bold text-[#141221] tabular-nums">
                  {formatNaira(item.price)}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-[#141221] group-hover:text-[#5E35F2] transition-colors truncate">
                {item.name}
              </h3>
              <div className="mt-3 pt-3 border-t border-[#F2F0FA] flex items-center justify-between">
                <span className="text-xs text-[#646175] inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5E35F2]" />
                  {item.location}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#5E35F2] text-white text-xs font-semibold">
                  Preview
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 5: Dedicated Subscribe to Newsletter Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#EFEFFD] border border-[#DFDAFC] rounded-3xl px-6 py-10 sm:px-12 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141221] text-balance">
              Subscribe to the Eazetrades Newsletter
            </h2>
            <p className="text-sm sm:text-base text-[#48455A] leading-relaxed">
              Get early access to curated Lagos vendor drops, restock notifications, and exclusive
              member pricing once a week.
            </p>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterSubscribed) setNewsletterSubscribed(false);
                }}
                placeholder="Enter your email address"
                aria-label="Newsletter email address"
                className="flex-1 h-12 px-4 rounded-full bg-white border border-[#D4CCF7] text-sm text-[#141221] placeholder:text-[#8A879C] focus:outline-none focus:border-[#5E35F2]"
              />
              <button
                type="submit"
                className="h-12 px-7 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {newsletterSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </form>
            {newsletterError && (
              <p className="mt-2 text-xs font-medium text-red-700">{newsletterError}</p>
            )}
            {newsletterSubscribed && (
              <p className="mt-2 text-xs font-medium text-[#4D26D9]">
                Thank you for subscribing — your first weekly curation arrives Friday.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoom view"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#141221] flex items-center justify-center shadow cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              referrerPolicy="no-referrer"
              className="w-full max-h-[80vh] object-contain bg-[#F5F5F7]"
            />
            <div className="px-5 py-3 bg-white border-t border-[#ECEAF6] flex items-center justify-between text-xs text-[#646175]">
              <span className="font-medium text-[#141221]">{activeImage.label}</span>
              <span className="tabular-nums">
                {activeImageIndex + 1} / {thumbnails.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

