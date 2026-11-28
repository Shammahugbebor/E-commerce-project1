import React from 'react';
import { Package, Users, Eye, Mail, MapPin, Phone, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { Product, formatNaira, getPaymentPolicyLabel } from '../data/products';
import { ServiceListing, VendorProfile } from '../data/marketplace';

interface VendorPageProps {
  vendors: VendorProfile[];
  activeVendor: VendorProfile;
  onSelectVendor: (vendor: VendorProfile) => void;
  onBackToVendors: () => void;
  allProducts: Product[];
  allServices: ServiceListing[];
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: ServiceListing) => void;
}

export const VendorPage: React.FC<VendorPageProps> = ({
  vendors,
  activeVendor,
  onSelectVendor,
  onBackToVendors,
  allProducts,
  allServices,
  onSelectProduct,
  onSelectService,
}) => {
  const vendorProducts = allProducts.filter((p) => activeVendor.productIds.includes(p.id));
  const vendorServices = allServices.filter((s) => activeVendor.serviceIds.includes(s.id));

  return (
    <main className="pb-20">
      {/* Breadcrumb & Switch Storefront Bar */}
      <div className="bg-white border-b border-[#ECEAF6]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onBackToVendors}
              className="inline-flex items-center gap-1.5 font-semibold text-[#5E35F2] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Vendors</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#9B97AE]" />
            <span className="font-semibold text-[#141221]">{activeVendor.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-[#646175] mr-1 hidden sm:inline">
              Quick switch:
            </span>
            {vendors.slice(0, 4).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVendor(v)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeVendor.id === v.id
                    ? 'bg-[#5E35F2] text-white'
                    : 'bg-[#F6F5FB] text-[#3B384A] hover:bg-[#ECE8FD]'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Storefront Cover Banner matching Vendor Page screenshot */}
      <section className="relative bg-[#141221] text-white overflow-hidden">
        <img
          src={activeVendor.bannerImage}
          alt={`${activeVendor.name} showroom`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141221]/90 via-[#141221]/55 to-[#141221]/70" />

        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-white/90 shadow-xl overflow-hidden mx-auto bg-white">
            <img
              src={activeVendor.avatarImage}
              alt={activeVendor.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
            {activeVendor.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B49EFF]" />
              {activeVendor.location}
            </span>
            <span aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Phone className="w-3.5 h-3.5 text-[#B49EFF]" />
              {activeVendor.phone}
            </span>
            <span aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B49EFF]" />
              Registered · {activeVendor.registeredDate}
            </span>
          </div>

          <p className="max-w-2xl mx-auto text-sm text-white/80 leading-relaxed pt-1">
            {activeVendor.bio}
          </p>
        </div>
      </section>

      {/* 6-Card Vendor Stats & Social Grid */}
      <section className="relative py-12 bg-gradient-to-b from-[#EFEFFD]/70 to-[#FAFAFC]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <Package className="w-8 h-8 text-[#141221] mx-auto stroke-[1.75]" />
              <p className="text-sm font-bold text-[#141221]">Product</p>
              <p className="text-base font-semibold text-[#646175] tabular-nums">
                {vendorProducts.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <Users className="w-8 h-8 text-[#141221] mx-auto stroke-[1.75]" />
              <p className="text-sm font-bold text-[#141221]">Services</p>
              <p className="text-base font-semibold text-[#646175] tabular-nums">
                {vendorServices.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <Eye className="w-8 h-8 text-[#141221] mx-auto stroke-[1.75]" />
              <p className="text-sm font-bold text-[#141221]">Profile visits</p>
              <p className="text-base font-semibold text-[#646175] tabular-nums">
                {activeVendor.profileVisits}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white mx-auto flex items-center justify-center font-bold text-xs">
                IG
              </div>
              <p className="text-sm font-bold text-[#141221]">Instagram</p>
              <p className="text-xs font-medium text-[#646175] break-all">
                {activeVendor.instagram}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#141221] text-white mx-auto flex items-center justify-center font-display font-bold text-sm">
                X
              </div>
              <p className="text-sm font-bold text-[#141221]">X</p>
              <p className="text-xs font-medium text-[#646175] break-all">
                {activeVendor.xHandle}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECEAF6] p-6 text-center shadow-[0_6px_24px_rgba(20,18,33,0.04)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#141221]">Gmail</p>
              <a
                href={`mailto:${activeVendor.gmail}`}
                className="text-xs font-medium text-[#5E35F2] hover:underline break-all"
              >
                {activeVendor.gmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor's Products */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display font-bold text-2xl text-[#141221] text-center mb-8">
          Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorProducts.map((product) => (
            <article
              key={`vp-${product.id}`}
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
      </section>

      {/* Vendor's Services */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <h2 className="font-display font-bold text-2xl text-[#141221] text-center mb-8">
          Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorServices.map((service) => (
            <article
              key={`vs-${service.id}`}
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
      </section>
    </main>
  );
};

