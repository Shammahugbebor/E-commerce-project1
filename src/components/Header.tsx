import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, ChevronDown, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import {
  Product,
  PRODUCT_CATEGORIES,
  formatNaira,
  matchesProductSearch,
} from '../data/products';
import { AuthUser } from './AuthFlowOverlay';

export type AppView =
  | 'landing'
  | 'catalog'
  | 'product'
  | 'services'
  | 'vendors'
  | 'vendor'
  | 'about'
  | 'seller-dashboard';

interface HeaderProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateView: (view: AppView, category?: string) => void;
  onOpenCart: () => void;
  onOpenAuth: (screen?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  currentUser: AuthUser | null;
  cartCount: number;
  currentView: AppView;
}

export const EazetradesMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="36" height="36" rx="9" fill="#5E35F2" />
    <path
      d="M12.5 14V12.5C12.5 9.46243 14.9624 7 18 7C21.0376 7 23.5 9.46243 23.5 12.5V14"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M10.2 14.2H25.8L27 27.5C27.08 28.4 26.37 29.2 25.46 29.2H10.54C9.63 29.2 8.92 28.4 9 27.5L10.2 14.2Z"
      fill="white"
      fillOpacity="0.16"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 21.8C14.5 19.7 16.05 18.2 18.1 18.2C20.05 18.2 21.4 19.55 21.4 21.25H16.2M20.8 24.1C20.1 24.85 19.15 25.25 18.1 25.25C16.1 25.25 14.5 23.8 14.5 21.8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectProduct,
  onNavigateView,
  onOpenCart,
  onOpenAuth,
  onSignOut,
  currentUser,
  cartCount,
  currentView,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsMenuOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products.filter((p) => matchesProductSearch(p, searchQuery))
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECEAF6]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigateView('landing')}
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E35F2] rounded-lg py-1 pr-2 cursor-pointer"
          aria-label="Eazetrades Marketplace Home"
        >
          <EazetradesMark className="w-8 h-8 shrink-0" />
          <span className="font-display font-bold text-[15px] tracking-wide text-[#5E35F2] whitespace-nowrap">
            EAZETRADES
          </span>
        </button>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-[320px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit?.(searchQuery);
              setSearchFocused(false);
            }}
            className="relative"
          >
            <Search
              className="w-4 h-4 text-[#8A879C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Search products, vehicles, pets..."
              aria-label="Search for product"
              className="w-full h-10 pl-10 pr-9 text-sm bg-[#F6F5FB] border border-[#E7E4F5] rounded-full text-[#141221] placeholder:text-[#8A879C] focus:outline-none focus:bg-white focus:border-[#5E35F2] transition-colors"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="w-6 h-6 rounded-full hover:bg-[#ECE8FD] text-[#646175] flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-12 bg-white border border-[#E7E4F5] rounded-2xl shadow-lg p-2 z-50">
              {searchResults.length > 0 ? (
                <div>
                  <ul className="divide-y divide-[#F3F1FA] max-h-72 overflow-y-auto" role="listbox">
                    {searchResults.slice(0, 6).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProduct(item);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F5FB] text-left transition-colors cursor-pointer"
                        >
                          <img
                            src={item.images[0].src}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#141221] truncate">{item.name}</p>
                            <p className="text-xs text-[#646175]">
                              {item.category} · {item.condition}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#5E35F2] tabular-nums shrink-0">
                            {formatNaira(item.price)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchSubmit?.(searchQuery);
                      setSearchFocused(false);
                    }}
                    className="w-full mt-1.5 py-2 px-3 rounded-xl bg-[#F6F5FB] hover:bg-[#ECE8FD] text-xs font-semibold text-[#5E35F2] text-center transition-colors cursor-pointer"
                  >
                    View all {searchResults.length} matching result{searchResults.length === 1 ? '' : 's'} in Catalog →
                  </button>
                </div>
              ) : (
                <p className="px-3 py-4 text-sm text-[#646175] text-center">
                  No products matching “{searchQuery}”
                </p>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Nav Menu (Products, Services, Vendors, About) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#3B384A]">
          <div ref={productsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProductsMenuOpen((prev) => !prev);
                setServicesMenuOpen(false);
              }}
              className={`flex items-center gap-1 py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer rounded ${
                currentView === 'catalog' || currentView === 'product'
                  ? 'text-[#5E35F2] font-semibold'
                  : 'hover:text-[#5E35F2]'
              }`}
              aria-expanded={productsMenuOpen}
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {productsMenuOpen && (
              <div className="absolute left-0 top-10 w-60 bg-white border border-[#E7E4F5] rounded-2xl shadow-lg py-2 z-50">
                {PRODUCT_CATEGORIES.map((categoryName) => (
                  <button
                    key={categoryName}
                    type="button"
                    onClick={() => {
                      onNavigateView('catalog', categoryName);
                      setProductsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#141221] hover:bg-[#F6F5FB] hover:text-[#5E35F2] cursor-pointer"
                  >
                    {categoryName}
                  </button>
                ))}
                <div className="my-1 border-t border-[#F0EEF8]" />
                <button
                  type="button"
                  onClick={() => {
                    onNavigateView('catalog', 'All');
                    setProductsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-[#5E35F2] hover:bg-[#F6F5FB] cursor-pointer"
                >
                  All Products Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateView('product');
                    setProductsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-[#3B384A] hover:bg-[#F6F5FB] cursor-pointer"
                >
                  Featured Product Page
                </button>
              </div>
            )}
          </div>

          <div ref={servicesRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setServicesMenuOpen((prev) => !prev);
                setProductsMenuOpen(false);
              }}
              className={`flex items-center gap-1 py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer rounded ${
                currentView === 'services' ? 'text-[#5E35F2] font-semibold' : 'hover:text-[#5E35F2]'
              }`}
              aria-expanded={servicesMenuOpen}
            >
              <span>Services</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {servicesMenuOpen && (
              <div className="absolute left-0 top-10 w-52 bg-white border border-[#E7E4F5] rounded-2xl shadow-lg py-2 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateView('services');
                    setServicesMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#141221] hover:bg-[#F6F5FB] hover:text-[#5E35F2] cursor-pointer"
                >
                  All Marketplace Services
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateView('services');
                    setServicesMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#141221] hover:bg-[#F6F5FB] hover:text-[#5E35F2] cursor-pointer"
                >
                  Express Lagos Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateView('services');
                    setServicesMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#141221] hover:bg-[#F6F5FB] hover:text-[#5E35F2] cursor-pointer"
                >
                  Repairs & Tech Help
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('vendors')}
            className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer rounded ${
              currentView === 'vendors' || currentView === 'vendor'
                ? 'text-[#5E35F2] font-semibold'
                : 'hover:text-[#5E35F2]'
            }`}
          >
            Vendors
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('about')}
            className={`py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer rounded ${
              currentView === 'about' ? 'text-[#5E35F2] font-semibold' : 'hover:text-[#5E35F2]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Bag + Get Started / User) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-full bg-[#F6F5FB] text-[#5E35F2] flex items-center justify-center hover:bg-[#ECE8FD] transition-colors cursor-pointer"
            aria-label="Toggle product search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative h-10 px-3 rounded-full bg-[#F6F5FB] text-[#141221] hover:bg-[#ECE8FD] hover:text-[#5E35F2] flex items-center gap-2 transition-colors cursor-pointer"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold tabular-nums whitespace-nowrap">
              {cartCount > 0 ? cartCount : 'Bag'}
            </span>
          </button>

          {currentUser ? (
            <div ref={userRef} className="relative hidden sm:flex items-center gap-2">
              {currentUser.role === 'seller' && currentView !== 'seller-dashboard' && (
                <button
                  type="button"
                  onClick={() => onNavigateView('seller-dashboard')}
                  className="h-10 px-4 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Seller Hub</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setUserMenuOpen((p) => !p)}
                className="h-10 px-4 rounded-full bg-[#EFEFFD] text-[#5E35F2] text-xs font-semibold inline-flex items-center gap-2 hover:bg-[#E3DDFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[110px] truncate">{currentUser.name}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white border border-[#E7E4F5] rounded-2xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F0EEF8]">
                    <p className="text-xs font-bold text-[#141221] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#646175] truncate">
                      {currentUser.role === 'seller' ? 'Seller Account · ' : 'Buyer Account · '}
                      {currentUser.email}
                    </p>
                  </div>
                  {currentUser.role === 'seller' && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateView('seller-dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-[#5E35F2] hover:bg-[#F6F5FB] rounded-xl inline-flex items-center gap-1.5 cursor-pointer mt-1"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Seller Dashboard</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateView('vendor');
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-[#141221] hover:bg-[#F6F5FB] rounded-xl cursor-pointer mt-0.5"
                  >
                    Vendor Storefront
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-700 hover:bg-red-50 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Get started
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 rounded-full bg-[#5E35F2] text-white flex items-center justify-center hover:bg-[#4D26D9] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-b border-[#ECEAF6]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit?.(searchQuery);
              setMobileSearchOpen(false);
            }}
            className="relative"
          >
            <Search className="w-4 h-4 text-[#8A879C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, vehicles, pets..."
              className="w-full h-10 pl-10 pr-9 text-sm bg-[#F6F5FB] border border-[#E7E4F5] rounded-full text-[#141221] placeholder:text-[#8A879C] focus:outline-none focus:border-[#5E35F2]"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear mobile search"
                className="w-6 h-6 rounded-full text-[#646175] flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
          {searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl border border-[#E7E4F5] overflow-hidden">
              <ul className="divide-y divide-[#F3F1FA]">
                {searchResults.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(item);
                        setMobileSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm"
                    >
                      <span className="font-medium text-[#141221] truncate pr-2">{item.name}</span>
                      <span className="font-semibold text-[#5E35F2] tabular-nums shrink-0">
                        {formatNaira(item.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  onSearchSubmit?.(searchQuery);
                  setMobileSearchOpen(false);
                }}
                className="w-full py-2 px-3 bg-[#F6F5FB] text-xs font-semibold text-[#5E35F2] text-center border-t border-[#ECEAF6]"
              >
                View all {searchResults.length} results in Catalog →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 bg-white border-b border-[#ECEAF6] space-y-1.5">
          <button
            type="button"
            onClick={() => {
              onNavigateView('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateView('catalog', 'Fashion');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            Products & Catalog
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateView('product');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            Featured Product Page
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateView('services');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateView('vendors');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            Vendors
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateView('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#141221] hover:bg-[#F6F5FB]"
          >
            About Us
          </button>
          {currentUser?.role === 'seller' && (
            <button
              type="button"
              onClick={() => {
                onNavigateView('seller-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#5E35F2] bg-[#F4F1FE]"
            >
              Seller Dashboard
            </button>
          )}
          <div className="pt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full h-11 rounded-full border border-[#E7E4F5] text-sm font-semibold text-red-700"
              >
                Sign out ({currentUser.name})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full h-11 rounded-full bg-[#5E35F2] text-white text-sm font-semibold"
              >
                Get started
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

