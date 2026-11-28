/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PRODUCTS, INITIAL_REVIEWS, Product, ProductReview } from './data/products';
import {
  SERVICES,
  VENDORS,
  TESTIMONIALS,
  SELLER_INITIAL_ORDERS,
  SELLER_INITIAL_TRANSACTIONS,
  ServiceListing,
  VendorProfile,
  SellerOrder,
  SellerTransaction,
  OrderStatus,
} from './data/marketplace';
import { Header, AppView } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CatalogPage } from './components/CatalogPage';
import { ServicesPage } from './components/ServicesPage';
import { VendorsDirectoryPage } from './components/VendorsDirectoryPage';
import { VendorPage } from './components/VendorPage';
import { AboutPage } from './components/AboutPage';
import { SellerDashboardPage } from './components/SellerDashboardPage';
import { Footer } from './components/Footer';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { InfoModal } from './components/InfoModal';
import { AuthFlowOverlay, AuthScreen, AuthUser } from './components/AuthFlowOverlay';
import { ServiceDetailModal } from './components/ServiceDetailModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [services, setServices] = useState<ServiceListing[]>(SERVICES);
  const [vendors, setVendors] = useState<VendorProfile[]>(VENDORS);

  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('Fashion');
  const [searchQuery, setSearchQuery] = useState('');

  // Vendor & Service Preview State
  const [activeVendorId, setActiveVendorId] = useState<string>(VENDORS[0].id);
  const [sellerVendorId, setSellerVendorId] = useState<string>(VENDORS[0].id);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);

  // Auth Flow State
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialScreen, setAuthInitialScreen] = useState<AuthScreen>('signup');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Shopping Bag State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Saved / Wishlist State
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  // Product Reviews State
  const [reviewsByProduct, setReviewsByProduct] =
    useState<Record<string, ProductReview[]>>(INITIAL_REVIEWS);

  // Seller Orders & Escrow Finance State (synced live with buyer CartDrawer checkouts)
  const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>(SELLER_INITIAL_ORDERS);
  const [availableBalance, setAvailableBalance] = useState<number>(486500);
  const [pendingEscrow, setPendingEscrow] = useState<number>(168000);
  const [sellerTransactions, setSellerTransactions] = useState<SellerTransaction[]>(
    SELLER_INITIAL_TRANSACTIONS
  );

  // Info & Legal Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<
    'buyer' | 'vendor' | 'services' | 'Terms' | 'Privacy' | 'Cookies'
  >('buyer');

  const activeVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];
  const sellerVendor = vendors.find((v) => v.id === sellerVendorId) || vendors[0];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (view: AppView, category?: string) => {
    if (category) {
      setActiveCategory(category);
      setSearchQuery('');
    } else if (view !== 'catalog') {
      setSearchQuery('');
    }
    setCurrentView(view);
    scrollToTop();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    scrollToTop();
  };

  const handleSelectVendorProfile = (vendor: VendorProfile) => {
    setActiveVendorId(vendor.id);
    setCurrentView('vendor');
    scrollToTop();
  };

  const handleViewVendorByName = (vendorName: string) => {
    const matched = vendors.find((v) =>
      v.name.toLowerCase().includes(vendorName.toLowerCase().split(' ')[0])
    );
    setActiveVendorId((matched || vendors[0]).id);
    setCurrentView('vendor');
    scrollToTop();
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('All');
    setCurrentView('catalog');
    scrollToTop();
  };

  const handleOpenAuth = (screen: AuthScreen = 'signup') => {
    setAuthInitialScreen(screen);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setAuthOpen(false);
    if (user.role === 'seller') {
      const existing = vendors.find(
        (v) => v.name.toLowerCase() === user.name.trim().toLowerCase()
      );
      if (existing) {
        setSellerVendorId(existing.id);
        setActiveVendorId(existing.id);
      } else {
        setVendors((prev) =>
          prev.map((v) =>
            v.id === sellerVendorId
              ? {
                  ...v,
                  name: user.name.trim() || v.name,
                  gmail: user.email || v.gmail,
                }
              : v
          )
        );
      }
      setCurrentView('seller-dashboard');
      scrollToTop();
    }
  };

  // Seller Dashboard Live Mutations
  const handleSellerCreateProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setVendors((prev) =>
      prev.map((v) =>
        v.id === sellerVendor.id
          ? {
              ...v,
              productIds: [newProduct.id, ...v.productIds],
              productCount: v.productCount + 1,
            }
          : v
      )
    );
  };

  const handleSellerCreateService = (newService: ServiceListing) => {
    setServices((prev) => [newService, ...prev]);
    setVendors((prev) =>
      prev.map((v) =>
        v.id === sellerVendor.id
          ? {
              ...v,
              serviceIds: [newService.id, ...v.serviceIds],
              serviceCount: v.serviceCount + 1,
            }
          : v
      )
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setVendors((prev) =>
      prev.map((v) => ({
        ...v,
        productIds: v.productIds.filter((id) => id !== productId),
      }))
    );
  };

  const handleUpdateVendorProfile = (updates: Partial<VendorProfile>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === sellerVendor.id ? { ...v, ...updates } : v))
    );
  };

  const handlePlaceOrder = (newOrders: SellerOrder[]) => {
    setSellerOrders((prev) => [...newOrders, ...prev]);
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    setSellerOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus: Record<OrderStatus, OrderStatus> = {
          Pending: 'Processing',
          Processing: 'Dispatched',
          Dispatched: 'Delivered',
          Delivered: 'Delivered',
        };
        const updatedStatus = nextStatus[order.status];
        let nextEscrowState = order.escrowState;

        if (order.escrowState === 'Awaiting Transfer' && updatedStatus === 'Processing') {
          nextEscrowState = 'In Escrow';
          setPendingEscrow((e) => e + order.totalAmount);
        } else if (updatedStatus === 'Delivered') {
          if (order.escrowState === 'In Escrow') {
            setPendingEscrow((e) => Math.max(0, e - order.totalAmount));
            setAvailableBalance((b) => b + order.totalAmount);
            setSellerTransactions((txPrev) => [
              {
                id: `tx-${Date.now()}`,
                reference: `PAY-${Math.floor(10000 + Math.random() * 89999)}`,
                title: `Escrow Release · Order #${order.orderNumber}`,
                type: 'Escrow Release',
                amount: order.totalAmount,
                status: 'Completed',
                date: 'Just now',
              },
              ...txPrev,
            ]);
          } else if (order.escrowState === 'Collect on Delivery') {
            setAvailableBalance((b) => b + order.goodsSubtotal);
            setSellerTransactions((txPrev) => [
              {
                id: `tx-${Date.now()}`,
                reference: `COD-${Math.floor(10000 + Math.random() * 89999)}`,
                title: `Pay-on-Delivery Settled · Order #${order.orderNumber}`,
                type: 'Sale',
                amount: order.goodsSubtotal,
                status: 'Completed',
                date: 'Just now',
              },
              ...txPrev,
            ]);
          }
          nextEscrowState = 'Settled';
        }

        return {
          ...order,
          status: updatedStatus,
          escrowState: nextEscrowState,
        };
      })
    );
  };

  const handleWithdrawFunds = (amount: number, bankName: string, accountNumber: string) => {
    setAvailableBalance((b) => Math.max(0, b - amount));
    setSellerTransactions((prev) => [
      {
        id: `tx-w-${Date.now()}`,
        reference: `WDR-${Math.floor(10000 + Math.random() * 89999)}`,
        title: `Bank Payout · ${bankName.split('(')[0].trim()} •••• ${accountNumber.slice(-4)}`,
        type: 'Withdrawal',
        amount: -amount,
        status: 'Completed',
        date: 'Just now',
      },
      ...prev,
    ]);
  };

  const handleAddToBag = (product: Product, color: string, size: string, quantity: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.color === color && item.size === size
      );
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, color, size, quantity }];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item, idx) =>
          idx === index ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleSave = (productId: string) => {
    setSavedIds((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddReview = (
    productId: string,
    newReview: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>
  ) => {
    const entry: ProductReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: '23 Nov 2026',
      helpfulCount: 0,
    };
    setReviewsByProduct((prev) => ({
      ...prev,
      [productId]: [entry, ...(prev[productId] || INITIAL_REVIEWS['studio-pro-headphones'] || [])],
    }));
  };

  const handleMarkHelpful = (productId: string, reviewId: string) => {
    setReviewsByProduct((prev) => {
      const list = prev[productId] || INITIAL_REVIEWS['studio-pro-headphones'] || [];
      return {
        ...prev,
        [productId]: list.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
        ),
      };
    });
  };

  const openModal = (tab: 'buyer' | 'vendor' | 'services' | 'Terms' | 'Privacy' | 'Cookies') => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const activeReviews =
    reviewsByProduct[selectedProduct.id] || INITIAL_REVIEWS['studio-pro-headphones'] || [];

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sellerProducts = products.filter((p) => sellerVendor.productIds.includes(p.id));
  const sellerServices = services.filter((s) => sellerVendor.serviceIds.includes(s.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
      <Header
        products={products}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleHeroSearch}
        onSelectProduct={handleSelectProduct}
        onNavigateView={handleNavigateView}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={(screen = 'signup') => handleOpenAuth(screen)}
        onSignOut={() => {
          setCurrentUser(null);
          if (currentView === 'seller-dashboard') {
            setCurrentView('landing');
          }
        }}
        currentUser={currentUser}
        cartCount={totalBagCount}
        currentView={currentView}
      />

      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            products={products}
            services={services}
            testimonials={TESTIMONIALS}
            onSelectProduct={handleSelectProduct}
            onSelectService={(srv) => setSelectedService(srv)}
            onNavigateCatalog={(cat = 'All') => handleNavigateView('catalog', cat)}
            onNavigateServices={() => handleNavigateView('services')}
            onOpenAuth={() => handleOpenAuth('signup')}
            onHeroSearch={handleHeroSearch}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            products={products}
            activeCategory={activeCategory}
            onCategoryChange={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onNavigateHome={() => handleNavigateView('landing')}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            reviews={activeReviews}
            isSaved={Boolean(savedIds[selectedProduct.id])}
            onToggleSave={handleToggleSave}
            onAddToBag={handleAddToBag}
            onOpenBag={() => setCartOpen(true)}
            onAddReview={handleAddReview}
            onMarkHelpful={handleMarkHelpful}
            onSelectProduct={handleSelectProduct}
            onNavigateCatalog={(cat = 'Fashion') => handleNavigateView('catalog', cat)}
            onNavigateHome={() => handleNavigateView('landing')}
            onViewVendor={handleViewVendorByName}
          />
        )}

        {currentView === 'services' && (
          <ServicesPage
            services={services}
            searchQuery={searchQuery}
            onSelectService={(srv) => setSelectedService(srv)}
            onNavigateHome={() => handleNavigateView('landing')}
          />
        )}

        {currentView === 'vendors' && (
          <VendorsDirectoryPage
            vendors={vendors}
            onSelectVendor={handleSelectVendorProfile}
            onNavigateHome={() => handleNavigateView('landing')}
            onBecomeVendor={() => handleOpenAuth('signup')}
          />
        )}

        {currentView === 'vendor' && (
          <VendorPage
            vendors={vendors}
            activeVendor={activeVendor}
            onSelectVendor={handleSelectVendorProfile}
            onBackToVendors={() => handleNavigateView('vendors')}
            allProducts={products}
            allServices={services}
            onSelectProduct={handleSelectProduct}
            onSelectService={(srv) => setSelectedService(srv)}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onNavigateCatalog={(cat = 'Fashion') => handleNavigateView('catalog', cat)}
            onOpenAuth={() => handleOpenAuth('signup')}
          />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboardPage
            sellerName={currentUser?.name || sellerVendor.name}
            sellerEmail={currentUser?.email || sellerVendor.gmail}
            vendorProfile={sellerVendor}
            sellerProducts={sellerProducts}
            sellerServices={sellerServices}
            orders={sellerOrders}
            availableBalance={availableBalance}
            pendingEscrow={pendingEscrow}
            transactions={sellerTransactions}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onWithdrawFunds={handleWithdrawFunds}
            onCreateProduct={handleSellerCreateProduct}
            onCreateService={handleSellerCreateService}
            onToggleProductStock={handleToggleProductStock}
            onDeleteProduct={handleDeleteProduct}
            onUpdateVendorProfile={handleUpdateVendorProfile}
            onViewLiveStorefront={() => handleSelectVendorProfile(sellerVendor)}
            onPreviewProduct={handleSelectProduct}
          />
        )}
      </div>

      {currentView !== 'seller-dashboard' && (
        <Footer
          onNavigateView={handleNavigateView}
          onOpenLegal={(doc) => openModal(doc)}
          onOpenInfo={(tab) => openModal(tab)}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onPlaceOrder={handlePlaceOrder}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onViewVendor={handleViewVendorByName}
      />

      <AuthFlowOverlay
        isOpen={authOpen}
        initialScreen={authInitialScreen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <InfoModal isOpen={modalOpen} initialTab={modalTab} onClose={() => setModalOpen(false)} />
    </div>
  );
}

