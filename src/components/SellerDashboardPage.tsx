import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Upload,
  Package,
  ShoppingCart,
  Wallet,
  Users,
  BarChart3,
  Settings,
  Plus,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Trash2,
  UserPlus,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import {
  Product,
  ProductCondition,
  ProductPaymentPolicy,
  formatNaira,
  getPaymentPolicyLabel,
} from '../data/products';
import {
  ServiceListing,
  VendorProfile,
  SellerOrder,
  SellerTransaction,
  SellerEmployee,
  OrderStatus,
  SELLER_INITIAL_ORDERS,
  SELLER_INITIAL_TRANSACTIONS,
  SELLER_INITIAL_EMPLOYEES,
  SELLER_ANALYTICS_SERIES,
} from '../data/marketplace';

export type SellerTab =
  | 'overview'
  | 'upload'
  | 'orders'
  | 'money'
  | 'employees'
  | 'analytics'
  | 'settings';

interface SellerDashboardPageProps {
  sellerName: string;
  sellerEmail: string;
  vendorProfile: VendorProfile;
  sellerProducts: Product[];
  sellerServices: ServiceListing[];
  orders?: SellerOrder[];
  availableBalance?: number;
  pendingEscrow?: number;
  transactions?: SellerTransaction[];
  onAdvanceOrderStatus?: (orderId: string) => void;
  onWithdrawFunds?: (amount: number, bankName: string, accountNumber: string) => void;
  onCreateProduct: (product: Product) => void;
  onCreateService: (service: ServiceListing) => void;
  onToggleProductStock: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateVendorProfile: (updates: Partial<VendorProfile>) => void;
  onViewLiveStorefront: () => void;
  onPreviewProduct: (product: Product) => void;
}

const STUDIO_GALLERY_CHOICES = [
  { label: 'Studio Headphones', src: '/src/assets/images/headphones_main_1795452533961.jpg' },
  { label: 'Solid Oak Stool', src: '/src/assets/images/product_wooden_stool_1795452534731.jpg' },
  { label: 'Thermal Flask', src: '/src/assets/images/product_insulated_flask_1795452534646.jpg' },
  { label: 'Comfort Clogs', src: '/src/assets/images/product_colorful_clogs_1795452533961.jpg' },
  { label: 'AMOLED Smartwatch', src: '/src/assets/images/product_smartwatch_1795452534296.jpg' },
  { label: 'Acoustic Speaker', src: '/src/assets/images/product_smart_speaker_1795452534163.jpg' },
  { label: 'Express Logistics', src: '/src/assets/images/service_delivery_logistics_1795486249157.jpg' },
  { label: 'Tech Care Desk', src: '/src/assets/images/service_tech_support_1795486248698.jpg' },
];

const PERMISSION_OPTIONS = [
  'Upload Listings',
  'Manage Orders',
  'View Analytics',
  'Approve Withdrawals',
];

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  sellerName,
  sellerEmail,
  vendorProfile,
  sellerProducts,
  sellerServices,
  orders: ordersProp,
  availableBalance: availableBalanceProp,
  pendingEscrow: pendingEscrowProp,
  transactions: transactionsProp,
  onAdvanceOrderStatus: onAdvanceOrderStatusProp,
  onWithdrawFunds: onWithdrawFundsProp,
  onCreateProduct,
  onCreateService,
  onToggleProductStock,
  onDeleteProduct,
  onUpdateVendorProfile,
  onViewLiveStorefront,
  onPreviewProduct,
}) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('overview');

  // Orders & Finance State (uses lifted App state when provided)
  const [localOrders, setLocalOrders] = useState<SellerOrder[]>(SELLER_INITIAL_ORDERS);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [orderQuery, setOrderQuery] = useState('');

  const [localTransactions, setLocalTransactions] = useState<SellerTransaction[]>(
    SELLER_INITIAL_TRANSACTIONS
  );
  const [txTypeFilter, setTxTypeFilter] = useState<
    'All' | 'Sale' | 'Escrow Release' | 'Withdrawal' | 'Platform Fee'
  >('All');
  const [localAvailableBalance, setLocalAvailableBalance] = useState<number>(486500);
  const [localPendingEscrow, setLocalPendingEscrow] = useState<number>(168000);

  const orders = ordersProp ?? localOrders;
  const transactions = transactionsProp ?? localTransactions;
  const availableBalance = availableBalanceProp ?? localAvailableBalance;
  const pendingEscrow = pendingEscrowProp ?? localPendingEscrow;
  const [bankAccount, setBankAccount] = useState({
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0239484821',
    accountName: vendorProfile.name,
  });
  const [withdrawAmount, setWithdrawAmount] = useState('100000');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawFeedback, setWithdrawFeedback] = useState('');

  // Employees & Team Sub-Accounts State
  const [employees, setEmployees] = useState<SellerEmployee[]>(SELLER_INITIAL_EMPLOYEES);
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [empForm, setEmpForm] = useState({
    name: '',
    email: '',
    role: 'Inventory Clerk' as SellerEmployee['role'],
    permissions: ['Upload Listings', 'Manage Orders'] as string[],
  });

  // Upload Product / Service Form State
  const [uploadType, setUploadType] = useState<'product' | 'service'>('product');
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [listingSearch, setListingSearch] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    category: 'Fashion' as Product['category'],
    fashionItem: 'Accessories' as Product['fashionItem'],
    serviceCategory: 'Services' as ServiceListing['category'],
    condition: 'New' as ProductCondition,
    conditionNote: 'Brand new factory-sealed unit inspected by our Ikeja quality desk.',
    paymentPolicy: 'both' as ProductPaymentPolicy,
    price: '28000',
    compareAtPrice: '34000',
    stockCount: '20',
    location: vendorProfile.location || 'Lagos, Ikeja',
    description:
      'Crafted for everyday durability in Lagos and nationwide, this item pairs clean modern finishing with reliable performance. Carefully inspected at our Allen Avenue desk prior to dispatch, it includes protective packaging, responsive merchant support, and clear Pay-on-Delivery or Escrow pickup verification so buyers can inspect every detail before final settlement.',
    image: STUDIO_GALLERY_CHOICES[0].src,
    customImageDataUrl: '',
    sizes: 'Standard, Large',
    colorName: 'Obsidian',
    colorHex: '#18181B',
  });

  // Analytics State
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: vendorProfile.name,
    location: vendorProfile.location,
    phone: vendorProfile.phone,
    bio: vendorProfile.bio,
    instagram: vendorProfile.instagram,
    xHandle: vendorProfile.xHandle,
    gmail: vendorProfile.gmail,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const wordCount = useMemo(() => {
    return formState.description.trim().split(/\s+/).filter(Boolean).length;
  }, [formState.description]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (orderQuery.trim()) {
        const q = orderQuery.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.itemName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderQuery]);

  const filteredTransactions = useMemo(() => {
    if (txTypeFilter === 'All') return transactions;
    return transactions.filter((t) => t.type === txTypeFilter);
  }, [transactions, txTypeFilter]);

  const filteredListings = useMemo(() => {
    if (!listingSearch.trim()) return sellerProducts;
    const q = listingSearch.toLowerCase();
    return sellerProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [sellerProducts, listingSearch]);

  const handleAdvanceOrderStatus = (orderId: string) => {
    if (onAdvanceOrderStatusProp) {
      onAdvanceOrderStatusProp(orderId);
      return;
    }

    setLocalOrders((prev) =>
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
          setLocalPendingEscrow((e) => e + order.totalAmount);
        } else if (updatedStatus === 'Delivered') {
          if (order.escrowState === 'In Escrow') {
            setLocalPendingEscrow((e) => Math.max(0, e - order.totalAmount));
            setLocalAvailableBalance((b) => b + order.totalAmount);
            setLocalTransactions((txPrev) => [
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
            setLocalAvailableBalance((b) => b + order.goodsSubtotal);
            setLocalTransactions((txPrev) => [
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

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormState((prev) => ({ ...prev, customImageDataUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!formState.title.trim()) {
      setUploadError('Please enter a clear product or service title.');
      return;
    }

    const numericPrice = Math.max(500, Number(formState.price) || 0);
    const chosenImage = formState.customImageDataUrl || formState.image;

    if (uploadType === 'product') {
      const id = `seller-prod-${Date.now()}`;
      const paymentOptionsCopy =
        formState.paymentPolicy === 'pay-on-delivery'
          ? 'Pay on Delivery only (buyer pays goods + dispatch fee after doorstep inspection; no online card).'
          : formState.paymentPolicy === 'pay-before-delivery'
            ? 'Pay Before Delivery or at Hub Pickup via verified Eazetrades Escrow transfer (no online card).'
            : 'Pay on Delivery (goods + dispatch on arrival) OR Pay Before Delivery / Hub Pickup via Escrow.';

      const newProduct: Product = {
        id,
        slug: formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: formState.title.trim(),
        category: formState.category,
        fashionItem: formState.fashionItem,
        condition: formState.condition,
        conditionNote:
          formState.conditionNote.trim() ||
          (formState.condition === 'New'
            ? 'Brand new factory-sealed unit.'
            : 'Verified pre-owned item tested for full functionality.'),
        paymentPolicy: formState.paymentPolicy,
        price: numericPrice,
        compareAtPrice:
          Number(formState.compareAtPrice) > numericPrice
            ? Number(formState.compareAtPrice)
            : undefined,
        rating: 5.0,
        reviewCount: 1,
        location: formState.location.trim() || 'Lagos, Ikeja',
        visits: 1,
        isPremiumAd: true,
        inStock: Number(formState.stockCount) > 0,
        stockCount: Math.max(1, Number(formState.stockCount) || 10),
        vendorName: vendorProfile.name,
        sku: `EZ-${Math.floor(100 + Math.random() * 899)}`,
        description60Words: formState.description.trim(),
        colors: [
          { name: formState.colorName || 'Obsidian', hex: formState.colorHex || '#18181B' },
          { name: 'Violet Core', hex: '#5E35F2' },
        ],
        sizes: formState.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        images: [
          { id: `${id}-1`, src: chosenImage, alt: `${formState.title} main view`, label: 'Main' },
          {
            id: `${id}-2`,
            src: STUDIO_GALLERY_CHOICES[1].src,
            alt: `${formState.title} angle 2`,
            label: 'Angle 2',
          },
          {
            id: `${id}-3`,
            src: STUDIO_GALLERY_CHOICES[2].src,
            alt: `${formState.title} detail`,
            label: 'Detail',
          },
          {
            id: `${id}-4`,
            src: STUDIO_GALLERY_CHOICES[3].src,
            alt: `${formState.title} lifestyle`,
            label: 'Lifestyle',
          },
          {
            id: `${id}-5`,
            src: chosenImage,
            alt: `${formState.title} packaging`,
            label: 'Packaging',
          },
        ],
        specs: [
          { label: 'Item Condition', value: formState.condition },
          { label: 'Fulfillment Hub', value: formState.location.trim() || 'Ikeja, Lagos' },
          { label: 'Merchant', value: vendorProfile.name },
          { label: 'Availability', value: `${formState.stockCount || 10} Units Ready` },
          { label: 'Inspection', value: 'Eazetrades Escrow Verified' },
        ],
        shippingSummary: {
          lagosDispatch: 'Same-day 2–4 hour dispatch within Lagos Metro.',
          nationwideWindow: '2–4 business days tracked delivery nationwide.',
          freeShippingThreshold: 'Zero dispatch fee when collected at an Eazetrades Hub.',
          paymentOptions: paymentOptionsCopy,
        },
        warrantySummary: {
          duration:
            formState.condition === 'New'
              ? '12-Month Official Seller Warranty'
              : '30-Day Pre-Owned Hardware Guarantee',
          coverage: 'Covers undisclosed faults verified during physical inspection.',
          returnWindow: '14-day easy return or instant replacement.',
          serviceCenter: `${vendorProfile.name} · ${vendorProfile.location}`,
        },
      };

      onCreateProduct(newProduct);
      setUploadSuccess(`"${newProduct.name}" (${newProduct.condition}) is now live in the Marketplace & your Storefront.`);
    } else {
      const id = `seller-srv-${Date.now()}`;
      const newService: ServiceListing = {
        id,
        title: formState.title.trim(),
        category: formState.serviceCategory,
        priceLabel: `From ${formatNaira(numericPrice)}`,
        startingRate: numericPrice,
        location: formState.location.trim() || 'Lagos, Ikeja',
        visits: 1,
        isPremiumAd: true,
        providerName: vendorProfile.name,
        responseSla: 'Replies within 30 mins',
        image: chosenImage,
        description: formState.description.trim(),
        deliverables: [
          'Verified consultation & written scope',
          'Direct Lagos or remote execution',
          'Escrow milestone confirmation',
        ],
      };
      onCreateService(newService);
      setUploadSuccess(`Service "${newService.title}" has been published to Eazetrades Services.`);
    }

    setFormState((prev) => ({ ...prev, title: '', customImageDataUrl: '' }));
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 1000) {
      setWithdrawFeedback('Minimum payout withdrawal is ₦1,000.');
      return;
    }
    if (amt > availableBalance) {
      setWithdrawFeedback('Amount exceeds your available settled balance.');
      return;
    }
    if (onWithdrawFundsProp) {
      onWithdrawFundsProp(amt, bankAccount.bankName, bankAccount.accountNumber);
    } else {
      setLocalAvailableBalance((b) => b - amt);
      setLocalTransactions((prev) => [
        {
          id: `tx-w-${Date.now()}`,
          reference: `WDR-${Math.floor(10000 + Math.random() * 89999)}`,
          title: `Bank Payout · ${bankAccount.bankName.split('(')[0].trim()} •••• ${bankAccount.accountNumber.slice(-4)}`,
          type: 'Withdrawal',
          amount: -amt,
          status: 'Completed',
          date: 'Just now',
        },
        ...prev,
      ]);
    }
    setWithdrawFeedback('');
    setWithdrawModalOpen(false);
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name.trim() || !empForm.email.trim()) return;
    const newEmp: SellerEmployee = {
      id: `emp-${Date.now()}`,
      name: empForm.name.trim(),
      email: empForm.email.trim(),
      role: empForm.role,
      permissions: empForm.permissions.length > 0 ? empForm.permissions : ['Manage Orders'],
      status: 'Active',
      lastActive: 'Invited just now',
    };
    setEmployees((prev) => [newEmp, ...prev]);
    setEmpForm({
      name: '',
      email: '',
      role: 'Inventory Clerk',
      permissions: ['Upload Listings', 'Manage Orders'],
    });
    setEmpModalOpen(false);
  };

  const handleToggleEmployeeStatus = (empId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, status: emp.status === 'Active' ? 'Suspended' : 'Active' }
          : emp
      )
    );
  };

  const handleRemoveEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVendorProfile(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const navItems: Array<{ id: SellerTab; label: string; Icon: React.FC<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Listings', Icon: Upload },
    { id: 'orders', label: 'Orders & Dispatch', Icon: ShoppingCart },
    { id: 'money', label: 'Money & Payouts', Icon: Wallet },
    { id: 'employees', label: 'Employees & Access', Icon: Users },
    { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
    { id: 'settings', label: 'Storefront Settings', Icon: Settings },
  ];

  const currentTabTitle = navItems.find((n) => n.id === activeTab)?.label || 'Overview';
  const analyticsPoints = SELLER_ANALYTICS_SERIES[timeframe];
  const maxRevenue = Math.max(...analyticsPoints.map((d) => d.revenue), 1);

  return (
    <div className="bg-[#F6F6FB] min-h-[calc(100vh-72px)]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row">
        {/* Workspace Left Sidebar (250px on Desktop) */}
        <aside className="lg:w-[252px] lg:shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-[#E6E4F3] p-4 lg:p-5 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            {/* Store Identity Lockup */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EEF8]">
              <img
                src={vendorProfile.avatarImage}
                alt={vendorProfile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-[#E6E4F3]"
              />
              <div className="min-w-0">
                <p className="font-display font-bold text-sm text-[#141221] truncate">
                  {vendorProfile.name}
                </p>
                <p className="text-[11px] text-[#646175] truncate">
                  Seller Hub · {sellerName}
                </p>
              </div>
            </div>

            {/* Navigation List */}
            <nav aria-label="Seller workspace navigation" className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {navItems.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#EFEFFD] text-[#5E35F2]'
                        : 'text-[#48455A] hover:bg-[#F7F6FC] hover:text-[#141221]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block pt-4 border-t border-[#F0EEF8] space-y-3">
            <div className="rounded-xl bg-[#F8F7FC] border border-[#E6E4F3] p-3.5">
              <p className="text-[11px] font-semibold text-[#646175]">Available Payout</p>
              <p className="font-display font-bold text-lg text-[#141221] tabular-nums mt-0.5">
                {formatNaira(availableBalance)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('money');
                  setWithdrawModalOpen(true);
                }}
                className="mt-2.5 w-full h-8 rounded-lg bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-[11px] font-semibold cursor-pointer"
              >
                Withdraw to Bank
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <section className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Bar Contract: Breadcrumb on Left, max 2 primary actions on Right */}
          <header className="bg-white rounded-2xl border border-[#E6E4F3] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#646175]">
                Seller Hub / {currentTabTitle}
              </p>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#141221] mt-0.5">
                {currentTabTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setShowUploadForm(true);
                }}
                className="h-10 px-4 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Listing</span>
              </button>
              <button
                type="button"
                onClick={onViewLiveStorefront}
                className="h-10 px-4 rounded-xl border border-[#E6E4F3] bg-white hover:border-[#5E35F2] text-[#141221] hover:text-[#5E35F2] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5">
                  <p className="text-xs font-semibold text-[#646175]">Available Balance</p>
                  <p className="font-display font-bold text-2xl text-[#141221] tabular-nums mt-1.5">
                    {formatNaira(availableBalance)}
                  </p>
                  <p className="text-xs text-[#16A34A] font-medium mt-2">Ready for bank payout</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5">
                  <p className="text-xs font-semibold text-[#646175]">Pending Escrow</p>
                  <p className="font-display font-bold text-2xl text-[#141221] tabular-nums mt-1.5">
                    {formatNaira(pendingEscrow)}
                  </p>
                  <p className="text-xs text-[#D97706] font-medium mt-2 tabular-nums">
                    {orders.filter((o) => o.escrowState === 'In Escrow').length} active buyer holds
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5">
                  <p className="text-xs font-semibold text-[#646175]">Active Catalog</p>
                  <p className="font-display font-bold text-2xl text-[#141221] tabular-nums mt-1.5">
                    {sellerProducts.length + sellerServices.length}
                  </p>
                  <p className="text-xs text-[#646175] mt-2 tabular-nums">
                    {sellerProducts.length} products · {sellerServices.length} services
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5">
                  <p className="text-xs font-semibold text-[#646175]">Storefront Visits (30d)</p>
                  <p className="font-display font-bold text-2xl text-[#141221] tabular-nums mt-1.5">
                    {vendorProfile.profileVisits.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#5E35F2] font-medium mt-2">
                    +18.4% vs previous month
                  </p>
                </div>
              </div>

              {/* Quick Actions & Mini 7-Day Revenue Bar Strip */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E4F3] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-bold text-base text-[#141221]">
                        Weekly Sales Pulse
                      </h2>
                      <p className="text-xs text-[#646175]">
                        Settled and escrow gross merchandise volume (7 days)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('analytics')}
                      className="text-xs font-semibold text-[#5E35F2] hover:underline cursor-pointer"
                    >
                      Full Analytics →
                    </button>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-2 pt-4 border-t border-[#F2F0FA]">
                    {SELLER_ANALYTICS_SERIES['7d'].map((point) => {
                      const heightPct = Math.max(12, Math.round((point.revenue / 178000) * 100));
                      return (
                        <div key={point.label} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[10px] font-semibold text-[#646175] tabular-nums">
                            ₦{Math.round(point.revenue / 1000)}k
                          </span>
                          <div className="w-full max-w-[38px] h-28 bg-[#F4F3FA] rounded-lg flex items-end overflow-hidden">
                            <div
                              className="w-full bg-[#5E35F2] rounded-t-lg transition-all"
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-[#48455A]">
                            {point.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E4F3] p-5 space-y-3">
                  <h2 className="font-display font-bold text-base text-[#141221]">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('upload');
                        setShowUploadForm(true);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4F3] hover:border-[#5E35F2] text-left transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#141221]">Upload New Product</p>
                        <p className="text-[11px] text-[#646175]">
                          Publish inventory straight to Eazetrades catalog
                        </p>
                      </div>
                      <Upload className="w-4 h-4 text-[#5E35F2]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('money');
                        setWithdrawModalOpen(true);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4F3] hover:border-[#5E35F2] text-left transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#141221]">Request Bank Payout</p>
                        <p className="text-[11px] text-[#646175]">
                          Transfer settled NGN to {bankAccount.bankName.split('(')[0]}
                        </p>
                      </div>
                      <Wallet className="w-4 h-4 text-[#5E35F2]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('employees');
                        setEmpModalOpen(true);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4F3] hover:border-[#5E35F2] text-left transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#141221]">Add Employee Account</p>
                        <p className="text-[11px] text-[#646175]">
                          Assign staff roles for dispatch, stock, or finance
                        </p>
                      </div>
                      <UserPlus className="w-4 h-4 text-[#5E35F2]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders Compact Table */}
              <div className="bg-white rounded-2xl border border-[#E6E4F3] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0EEF8] flex items-center justify-between">
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Recent Orders Requiring Attention
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#5E35F2] hover:underline cursor-pointer"
                  >
                    Manage all orders →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0EEF8] text-[11px] font-semibold uppercase tracking-wider text-[#646175] bg-[#FAFAFD]">
                        <th className="py-3 px-5">Order ID</th>
                        <th className="py-3 px-4">Customer & Item</th>
                        <th className="py-3 px-4">Settlement & Flow</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0FA] text-xs">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAFAFD] h-12">
                          <td className="py-3 px-5 font-mono font-semibold text-[#141221] tabular-nums">
                            #{ord.orderNumber}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#141221]">{ord.customerName}</p>
                            <p className="text-[11px] text-[#646175] truncate max-w-[260px]">
                              {ord.itemCondition} · {ord.itemName}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[11px] font-semibold block ${
                                ord.escrowState === 'Settled'
                                  ? 'text-[#16A34A]'
                                  : ord.escrowState === 'In Escrow'
                                    ? 'text-[#5E35F2]'
                                    : ord.escrowState === 'Collect on Delivery'
                                      ? 'text-sky-700'
                                      : 'text-[#D97706]'
                              }`}
                            >
                              {ord.escrowState}
                            </span>
                            <span className="text-[10px] text-[#646175]">
                              {ord.paymentFlow} · {ord.fulfillmentMode}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#3B384A]">{ord.status}</td>
                          <td className="py-3 px-5 text-right font-bold text-[#141221] tabular-nums">
                            {formatNaira(ord.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PRODUCT / SERVICE & MANAGE CATALOG */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#646175]">
                  Publish products or bookable services directly to Eazetrades buyers and your{' '}
                  <strong className="text-[#141221]">{vendorProfile.name}</strong> storefront.
                </p>
                <button
                  type="button"
                  onClick={() => setShowUploadForm((p) => !p)}
                  className="h-9 px-4 rounded-xl border border-[#E6E4F3] bg-white text-xs font-semibold text-[#141221] hover:border-[#5E35F2] cursor-pointer"
                >
                  {showUploadForm ? 'Hide Upload Form' : '+ Open Upload Form'}
                </button>
              </div>

              {showUploadForm && (
                <form
                  onSubmit={handlePublishListing}
                  className="bg-white rounded-2xl border border-[#E6E4F3] p-6 space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0EEF8]">
                    <div>
                      <h2 className="font-display font-bold text-lg text-[#141221]">
                        Create & Upload New Listing
                      </h2>
                      <p className="text-xs text-[#646175]">
                        New listings go live immediately in Marketplace search and your storefront.
                      </p>
                    </div>
                    <div className="inline-flex rounded-xl bg-[#F4F3FA] p-1 border border-[#E6E4F3]">
                      <button
                        type="button"
                        onClick={() => setUploadType('product')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          uploadType === 'product'
                            ? 'bg-white text-[#5E35F2] shadow-xs'
                            : 'text-[#646175]'
                        }`}
                      >
                        Physical Product
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadType('service')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          uploadType === 'service'
                            ? 'bg-white text-[#5E35F2] shadow-xs'
                            : 'text-[#646175]'
                        }`}
                      >
                        Local Service
                      </button>
                    </div>
                  </div>

                  {uploadSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{uploadSuccess}</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-6 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                          {uploadType === 'product' ? 'Product Name *' : 'Service Title *'}
                        </label>
                        <input
                          type="text"
                          value={formState.title}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder={
                            uploadType === 'product'
                              ? 'e.g. Lagos Leather Minimalist Tote Bag'
                              : 'e.g. Same-Day Solar Inverter Diagnostics'
                          }
                          className="w-full h-10 px-3.5 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                            Category
                          </label>
                          {uploadType === 'product' ? (
                            <select
                              value={formState.category}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  category: e.target.value as Product['category'],
                                }))
                              }
                              className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white focus:outline-none focus:border-[#5E35F2]"
                            >
                              <option value="Fashion">Fashion</option>
                              <option value="Sport, Art and Outdoors">Sport, Art and Outdoors</option>
                              <option value="Health and Lifestyle">Health and Lifestyle</option>
                              <option value="Animals and Pets">Animals and Pets</option>
                              <option value="Vehicle">Vehicle</option>
                            </select>
                          ) : (
                            <select
                              value={formState.serviceCategory}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  serviceCategory: e.target.value as ServiceListing['category'],
                                }))
                              }
                              className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white focus:outline-none focus:border-[#5E35F2]"
                            >
                              <option value="Services">Services</option>
                              <option value="Tech">Tech</option>
                              <option value="Assistance">Assistance</option>
                              <option value="Cooking">Cooking</option>
                              <option value="Tutor">Tutor</option>
                              <option value="Engineer">Engineer</option>
                            </select>
                          )}
                        </div>

                        {uploadType === 'product' ? (
                          <div>
                            <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                              Item Type
                            </label>
                            <select
                              value={formState.fashionItem}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  fashionItem: e.target.value as Product['fashionItem'],
                                }))
                              }
                              className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white focus:outline-none focus:border-[#5E35F2]"
                            >
                              <option value="Accessories">Accessories</option>
                              <option value="Clothes">Clothes</option>
                              <option value="Shoes">Shoes</option>
                              <option value="Glasses">Glasses</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                              City / Dispatch Hub
                            </label>
                            <input
                              type="text"
                              value={formState.location}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, location: e.target.value }))
                              }
                              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                            Price (₦)
                          </label>
                          <input
                            type="number"
                            min={500}
                            value={formState.price}
                            onChange={(e) =>
                              setFormState((prev) => ({ ...prev, price: e.target.value }))
                            }
                            className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums focus:outline-none focus:border-[#5E35F2]"
                          />
                        </div>
                        {uploadType === 'product' && (
                          <>
                            <div>
                              <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                                Compare Price (₦)
                              </label>
                              <input
                                type="number"
                                value={formState.compareAtPrice}
                                onChange={(e) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    compareAtPrice: e.target.value,
                                  }))
                                }
                                className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums focus:outline-none focus:border-[#5E35F2]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                                Stock Qty
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={formState.stockCount}
                                onChange={(e) =>
                                  setFormState((prev) => ({ ...prev, stockCount: e.target.value }))
                                }
                                className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums focus:outline-none focus:border-[#5E35F2]"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {uploadType === 'product' && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                                Item Condition *
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {(['New', 'Second-Hand'] as const).map((cond) => (
                                  <button
                                    key={cond}
                                    type="button"
                                    onClick={() =>
                                      setFormState((prev) => ({
                                        ...prev,
                                        condition: cond,
                                        conditionNote:
                                          cond === 'New'
                                            ? 'Brand new factory-sealed unit inspected by our Ikeja quality desk.'
                                            : 'Pre-owned graded item tested and verified clean by our inspection desk.',
                                      }))
                                    }
                                    className={`h-10 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                                      formState.condition === cond
                                        ? 'border-[#5E35F2] bg-[#EFEFFD] text-[#5E35F2]'
                                        : 'border-[#E2DFF2] bg-white text-[#48455A]'
                                    }`}
                                  >
                                    {cond === 'New' ? 'Brand New' : 'Second-Hand'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                                Checkout & Trust Flow *
                              </label>
                              <select
                                value={formState.paymentPolicy}
                                onChange={(e) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    paymentPolicy: e.target.value as ProductPaymentPolicy,
                                  }))
                                }
                                className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white focus:outline-none focus:border-[#5E35F2]"
                              >
                                <option value="both">Pay on Delivery or Hub Pickup</option>
                                <option value="pay-on-delivery">
                                  Pay on Delivery Only (Goods + Dispatch)
                                </option>
                                <option value="pay-before-delivery">
                                  Pay Before Delivery / Pickup Only (Escrow)
                                </option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                              Condition Verification Note
                            </label>
                            <input
                              type="text"
                              value={formState.conditionNote}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, conditionNote: e.target.value }))
                              }
                              placeholder="e.g. Sealed retail box, or Clean pre-owned battery 94%"
                              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-[#3B384A]">
                            Product / Service Description
                          </label>
                          <span className="text-[11px] font-medium text-[#646175] tabular-nums">
                            {wordCount} words (60 words recommended)
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={formState.description}
                          onChange={(e) =>
                            setFormState((prev) => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                        />
                      </div>
                    </div>

                    {/* Right Column: Image Upload / Studio Picker & Variants */}
                    <div className="md:col-span-6 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                          Listing Photo Preview & Upload
                        </label>
                        <div className="flex items-start gap-4">
                          <div className="w-28 h-28 rounded-2xl border border-[#E6E4F3] overflow-hidden bg-[#F7F6FC] shrink-0">
                            <img
                              src={formState.customImageDataUrl || formState.image}
                              alt="Listing preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2.5">
                            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-[#5E35F2] bg-[#F8F6FF] text-xs font-semibold text-[#5E35F2] hover:bg-[#EFEFFD] cursor-pointer">
                              <ImageIcon className="w-4 h-4" />
                              <span>Upload Custom Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                className="hidden"
                              />
                            </label>
                            <p className="text-[11px] text-[#646175]">
                              Or choose a studio photo preset below:
                            </p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {STUDIO_GALLERY_CHOICES.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      image: preset.src,
                                      customImageDataUrl: '',
                                    }))
                                  }
                                  title={preset.label}
                                  className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                                    !formState.customImageDataUrl &&
                                    formState.image === preset.src
                                      ? 'border-[#5E35F2]'
                                      : 'border-transparent opacity-80 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={preset.src}
                                    alt={preset.label}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {uploadType === 'product' && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                              Available Sizes (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={formState.sizes}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, sizes: e.target.value }))
                              }
                              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                              Primary Color Name
                            </label>
                            <input
                              type="text"
                              value={formState.colorName}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, colorName: e.target.value }))
                              }
                              className="w-full h-10 px-3 text-xs rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-3 flex items-center justify-end gap-3">
                        <button
                          type="submit"
                          className="h-10 px-6 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadType === 'product' ? 'Publish Product Live' : 'Publish Service'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-[#E6E4F3] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0EEF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Your Live Products ({filteredListings.length})
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#8A879C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={listingSearch}
                      onChange={(e) => setListingSearch(e.target.value)}
                      placeholder="Filter SKU or product name..."
                      className="w-full h-9 pl-8 pr-3 text-xs rounded-xl border border-[#E2DFF2] bg-[#FAFAFD] focus:outline-none focus:bg-white focus:border-[#5E35F2]"
                    />
                  </div>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#F0EEF8] text-[11px] font-semibold uppercase tracking-wider text-[#646175] bg-[#FAFAFD]">
                          <th className="py-3 px-5">Product</th>
                          <th className="py-3 px-4">Condition & Flow</th>
                          <th className="py-3 px-4">SKU</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F0FA] text-xs">
                        {filteredListings.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#FAFAFD]">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.images[0].src}
                                  alt={prod.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover border border-[#ECEAF6] shrink-0"
                                />
                                <div className="min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => onPreviewProduct(prod)}
                                    className="font-semibold text-[#141221] hover:text-[#5E35F2] truncate block max-w-[220px] cursor-pointer text-left"
                                  >
                                    {prod.name}
                                  </button>
                                  <span className="text-[11px] text-[#646175]">
                                    {prod.category}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-[#141221]">
                                {prod.condition === 'New' ? 'Brand New' : 'Second-Hand'}
                              </p>
                              <p className="text-[11px] text-[#5E35F2]">
                                {getPaymentPolicyLabel(prod.paymentPolicy)}
                              </p>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-[#646175]">
                              {prod.sku}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#141221] tabular-nums">
                              {formatNaira(prod.price)}
                            </td>
                            <td className="py-3 px-4 tabular-nums text-[#3B384A]">
                              {prod.stockCount} units
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => onToggleProductStock(prod.id)}
                                className={`text-[11px] font-semibold cursor-pointer ${
                                  prod.inStock ? 'text-[#16A34A]' : 'text-[#D97706]'
                                }`}
                              >
                                {prod.inStock ? 'Active (In Stock)' : 'Paused (Out of Stock)'}
                              </button>
                            </td>
                            <td className="py-3 px-5 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onPreviewProduct(prod)}
                                  className="px-2.5 py-1 rounded-lg border border-[#E6E4F3] text-[11px] font-semibold text-[#3B384A] hover:border-[#5E35F2] hover:text-[#5E35F2] cursor-pointer"
                                >
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteProduct(prod.id)}
                                  aria-label={`Delete ${prod.name}`}
                                  className="p-1.5 rounded-lg text-[#646175] hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center space-y-2">
                    <Package className="w-8 h-8 text-[#8A879C] mx-auto" />
                    <p className="text-sm font-semibold text-[#141221]">No matching products</p>
                    <p className="text-xs text-[#646175]">
                      Clear your search filter or publish a new listing above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & DISPATCH */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#E6E4F3] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['All', 'Pending', 'Processing', 'Dispatched', 'Delivered'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          orderStatusFilter === st
                            ? 'bg-[#5E35F2] text-white'
                            : 'bg-[#F6F5FB] text-[#48455A] hover:text-[#141221]'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-[#8A879C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="Search order # or buyer..."
                    className="w-full h-9 pl-8 pr-3 text-xs rounded-xl border border-[#E2DFF2] bg-[#FAFAFD] focus:outline-none focus:bg-white focus:border-[#5E35F2]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6E4F3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0EEF8] text-[11px] font-semibold uppercase tracking-wider text-[#646175] bg-[#FAFAFD]">
                        <th className="py-3 px-5">Order</th>
                        <th className="py-3 px-4">Buyer & Destination</th>
                        <th className="py-3 px-4">Item & Condition</th>
                        <th className="py-3 px-4">Goods + Dispatch</th>
                        <th className="py-3 px-4">Payment Flow</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-5 text-right">Fulfillment Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0FA] text-xs">
                      {filteredOrders.map((ord) => {
                        const actionLabel =
                          ord.status === 'Pending'
                            ? ord.escrowState === 'Awaiting Transfer'
                              ? 'Verify Transfer & Pack'
                              : 'Confirm & Pack'
                            : ord.status === 'Processing'
                            ? ord.fulfillmentMode === 'Hub Pickup'
                              ? 'Ready at Hub'
                              : 'Dispatch Rider'
                            : ord.status === 'Dispatched'
                            ? ord.escrowState === 'Collect on Delivery'
                              ? 'Collect & Deliver'
                              : 'Mark Delivered'
                            : null;
                        return (
                          <tr key={ord.id} className="hover:bg-[#FAFAFD]">
                            <td className="py-3.5 px-5">
                              <p className="font-mono font-bold text-[#141221] tabular-nums">
                                #{ord.orderNumber}
                              </p>
                              <p className="text-[11px] text-[#646175]">{ord.createdAt}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-[#141221]">{ord.customerName}</p>
                              <p className="text-[11px] text-[#646175] max-w-[220px] truncate">
                                {ord.deliveryAddress}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-[#141221] max-w-[200px] truncate">
                                {ord.itemName}
                              </p>
                              <p className="text-[11px] text-[#646175] tabular-nums">
                                {ord.itemCondition} · Qty {ord.quantity}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 tabular-nums">
                              <p className="font-bold text-[#141221]">
                                {formatNaira(ord.totalAmount)}
                              </p>
                              <p className="text-[10px] text-[#646175]">
                                Goods {formatNaira(ord.goodsSubtotal)} + Del{' '}
                                {formatNaira(ord.deliveryFee)}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`font-semibold block ${
                                  ord.escrowState === 'Settled'
                                    ? 'text-[#16A34A]'
                                    : ord.escrowState === 'In Escrow'
                                      ? 'text-[#5E35F2]'
                                      : ord.escrowState === 'Collect on Delivery'
                                        ? 'text-sky-700'
                                        : 'text-[#D97706]'
                                }`}
                              >
                                {ord.escrowState}
                              </span>
                              <span className="text-[10px] text-[#646175]">
                                {ord.paymentFlow} · {ord.fulfillmentMode}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${
                                  ord.status === 'Delivered'
                                    ? 'text-[#16A34A]'
                                    : ord.status === 'Dispatched'
                                    ? 'text-[#5E35F2]'
                                    : ord.status === 'Processing'
                                    ? 'text-sky-600'
                                    : 'text-[#D97706]'
                                }`}
                              >
                                {ord.status === 'Dispatched' && <Truck className="w-3.5 h-3.5" />}
                                {ord.status === 'Delivered' && (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                {ord.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                <span>{ord.status}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              {actionLabel ? (
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceOrderStatus(ord.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-[11px] font-semibold cursor-pointer whitespace-nowrap"
                                >
                                  {actionLabel}
                                </button>
                              ) : (
                                <span className="text-[11px] font-medium text-[#16A34A]">
                                  Funds Settled
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MONEY & PAYOUTS */}
          {activeTab === 'money' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#646175]">
                      Available for Immediate Withdrawal
                    </p>
                    <p className="font-display font-bold text-3xl text-[#141221] tabular-nums mt-1">
                      {formatNaira(availableBalance)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(true)}
                    className="h-10 px-4 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                  >
                    Withdraw to Bank Account
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5 space-y-2">
                  <p className="text-xs font-semibold text-[#646175]">Pending Buyer Escrow</p>
                  <p className="font-display font-bold text-3xl text-[#D97706] tabular-nums">
                    {formatNaira(pendingEscrow)}
                  </p>
                  <p className="text-xs text-[#646175] leading-relaxed">
                    Releases automatically into Available Balance once buyers inspect and confirm
                    delivery.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#646175]">Settlement Bank Account</p>
                    <Building2 className="w-4 h-4 text-[#5E35F2]" />
                  </div>
                  <p className="font-display font-bold text-sm text-[#141221]">
                    {bankAccount.bankName}
                  </p>
                  <p className="font-mono text-xs text-[#3B384A] tabular-nums">
                    {bankAccount.accountNumber} · {bankAccount.accountName}
                  </p>
                  <p className="text-[11px] text-[#16A34A] font-semibold">
                    Verified NIBSS Instant Settlement Enabled
                  </p>
                </div>
              </div>

              {/* Withdraw Form Panel */}
              {withdrawModalOpen && (
                <form
                  onSubmit={handleWithdrawSubmit}
                  className="bg-white rounded-2xl border border-[#5E35F2] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#141221]">
                      Initiate Instant Bank Payout
                    </h2>
                    <button
                      type="button"
                      onClick={() => setWithdrawModalOpen(false)}
                      className="text-xs font-semibold text-[#646175] hover:text-[#141221] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Destination Bank
                      </label>
                      <select
                        value={bankAccount.bankName}
                        onChange={(e) =>
                          setBankAccount((prev) => ({ ...prev, bankName: e.target.value }))
                        }
                        className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white"
                      >
                        <option>Guaranty Trust Bank (GTBank)</option>
                        <option>Zenith Bank Plc</option>
                        <option>Access Bank Nigeria</option>
                        <option>Kuda Microfinance Bank</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankAccount.accountNumber}
                        onChange={(e) =>
                          setBankAccount((prev) => ({ ...prev, accountNumber: e.target.value }))
                        }
                        className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Withdrawal Amount (₦)
                      </label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums"
                      />
                    </div>
                  </div>

                  {withdrawFeedback && (
                    <p className="text-xs font-semibold text-red-700">{withdrawFeedback}</p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="h-10 px-6 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                    >
                      Confirm Payout Transfer
                    </button>
                  </div>
                </form>
              )}

              {/* Financial Ledger */}
              <div className="bg-white rounded-2xl border border-[#E6E4F3] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0EEF8] flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Transactions & Payout Ledger
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {(['All', 'Sale', 'Escrow Release', 'Withdrawal', 'Platform Fee'] as const).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTxTypeFilter(type)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            txTypeFilter === type
                              ? 'bg-[#5E35F2] text-white'
                              : 'bg-[#F6F5FB] text-[#48455A]'
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0EEF8] text-[11px] font-semibold uppercase tracking-wider text-[#646175] bg-[#FAFAFD]">
                        <th className="py-3 px-5">Reference</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0FA] text-xs">
                      {filteredTransactions.map((tx) => {
                        const positive = tx.amount >= 0;
                        return (
                          <tr key={tx.id} className="hover:bg-[#FAFAFD]">
                            <td className="py-3 px-5 font-mono text-[11px] text-[#646175]">
                              {tx.reference}
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#141221]">{tx.title}</td>
                            <td className="py-3 px-4 text-[#48455A]">{tx.type}</td>
                            <td className="py-3 px-4 text-[#646175] tabular-nums">{tx.date}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`font-semibold ${
                                  tx.status === 'Completed' ? 'text-[#16A34A]' : 'text-[#D97706]'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td
                              className={`py-3 px-5 text-right font-bold tabular-nums ${
                                positive ? 'text-[#16A34A]' : 'text-[#141221]'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1">
                                {positive ? (
                                  <ArrowDownLeft className="w-3.5 h-3.5" />
                                ) : (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-[#646175]" />
                                )}
                                {positive ? '+' : '-'}
                                {formatNaira(Math.abs(tx.amount))}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EMPLOYEES & SUB-ACCOUNTS */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Team Members & Role Permissions
                  </h2>
                  <p className="text-xs text-[#646175] mt-0.5">
                    Invite store managers, inventory clerks, dispatch coordinators, and accountants
                    with scoped dashboard access.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmpModalOpen((p) => !p)}
                  className="h-10 px-4 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Employee / Account</span>
                </button>
              </div>

              {empModalOpen && (
                <form
                  onSubmit={handleAddEmployeeSubmit}
                  className="bg-white rounded-2xl border border-[#5E35F2] p-6 space-y-4"
                >
                  <h3 className="font-display font-bold text-base text-[#141221]">
                    Create New Staff Account
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={empForm.name}
                        onChange={(e) => setEmpForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Adebayo Adewale"
                        className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={empForm.email}
                        onChange={(e) => setEmpForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="staff@jamesstore.ng"
                        className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] focus:outline-none focus:border-[#5E35F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                        Assigned Role
                      </label>
                      <select
                        value={empForm.role}
                        onChange={(e) =>
                          setEmpForm((p) => ({
                            ...p,
                            role: e.target.value as SellerEmployee['role'],
                          }))
                        }
                        className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#E2DFF2] bg-white"
                      >
                        <option value="Store Manager">Store Manager</option>
                        <option value="Inventory Clerk">Inventory Clerk</option>
                        <option value="Dispatch Coordinator">Dispatch Coordinator</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#3B384A] mb-2">
                      Account Permissions
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {PERMISSION_OPTIONS.map((perm) => {
                        const checked = empForm.permissions.includes(perm);
                        return (
                          <label
                            key={perm}
                            className="inline-flex items-center gap-2 text-xs text-[#3B384A] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setEmpForm((p) => ({
                                  ...p,
                                  permissions: checked
                                    ? p.permissions.filter((x) => x !== perm)
                                    : [...p.permissions, perm],
                                }))
                              }
                              className="accent-[#5E35F2] w-4 h-4 rounded"
                            />
                            <span>{perm}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEmpModalOpen(false)}
                      className="h-9 px-4 rounded-xl border border-[#E2DFF2] text-xs font-semibold text-[#48455A] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-5 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold cursor-pointer"
                    >
                      Grant Access
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl border border-[#E6E4F3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F0EEF8] text-[11px] font-semibold uppercase tracking-wider text-[#646175] bg-[#FAFAFD]">
                        <th className="py-3 px-5">Employee</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Permissions</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Active</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0FA] text-xs">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-[#FAFAFD]">
                          <td className="py-3.5 px-5">
                            <p className="font-semibold text-[#141221]">{emp.name}</p>
                            <p className="text-[11px] text-[#646175]">{emp.email}</p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#3B384A]">{emp.role}</td>
                          <td className="py-3.5 px-4 text-[11px] text-[#48455A]">
                            {emp.permissions.join(' · ')}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleEmployeeStatus(emp.id)}
                              className={`text-[11px] font-semibold cursor-pointer ${
                                emp.status === 'Active' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                              }`}
                            >
                              {emp.status}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-[#646175]">{emp.lastActive}</td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveEmployee(emp.id)}
                              className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E6E4F3] p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Storefront Revenue & Traffic Performance
                  </h2>
                  <p className="text-xs text-[#646175]">
                    Compare gross sales, fulfilled orders, and shopper profile visits.
                  </p>
                </div>
                <div className="inline-flex rounded-xl bg-[#F4F3FA] p-1 border border-[#E6E4F3]">
                  {(['7d', '30d', '90d'] as const).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        timeframe === tf ? 'bg-white text-[#5E35F2] shadow-xs' : 'text-[#646175]'
                      }`}
                    >
                      {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Bar + Trend Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6E4F3] p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-[#141221]">
                      Revenue Breakdown ({timeframe.toUpperCase()})
                    </h3>
                    <span className="text-xs font-bold text-[#5E35F2] tabular-nums">
                      Total:{' '}
                      {formatNaira(
                        analyticsPoints.reduce((acc, item) => acc + item.revenue, 0)
                      )}
                    </span>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-3 pt-4 border-t border-[#F0EEF8]">
                    {analyticsPoints.map((pt) => {
                      const pct = Math.max(14, Math.round((pt.revenue / maxRevenue) * 100));
                      return (
                        <div key={pt.label} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#141221] tabular-nums">
                            {formatNaira(pt.revenue)}
                          </span>
                          <div className="w-full max-w-[54px] h-36 bg-[#F4F3FA] rounded-xl flex items-end overflow-hidden">
                            <div
                              className="w-full bg-gradient-to-t from-[#5E35F2] to-[#8B6DF8] rounded-t-xl transition-all"
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-[#141221]">{pt.label}</p>
                            <p className="text-[10px] text-[#646175] tabular-nums">
                              {pt.orders} orders · {pt.visits} visits
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6E4F3] p-6 space-y-4">
                  <h3 className="font-display font-bold text-sm text-[#141221]">
                    Buyer Conversion Funnel
                  </h3>
                  <div className="space-y-3.5">
                    {[
                      { stage: 'Store & Product Visits', value: '3,057', pct: 100 },
                      { stage: 'Product Gallery Previews', value: '1,482', pct: 48 },
                      { stage: 'Added to Shopping Bag', value: '312', pct: 21 },
                      { stage: 'Completed Escrow Orders', value: '95', pct: 9 },
                    ].map((row) => (
                      <div key={row.stage} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#3B384A]">{row.stage}</span>
                          <span className="font-bold text-[#141221] tabular-nums">
                            {row.value}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#F2F0FA] overflow-hidden">
                          <div
                            className="h-full bg-[#5E35F2] rounded-full"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-[#F0EEF8] text-xs text-[#646175]">
                    Overall checkout conversion stands at{' '}
                    <strong className="text-[#16A34A] tabular-nums">3.11%</strong> across verified
                    Lagos traffic.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STOREFRONT SETTINGS */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="bg-white rounded-2xl border border-[#E6E4F3] p-6 max-w-3xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#F0EEF8] pb-4">
                <div>
                  <h2 className="font-display font-bold text-base text-[#141221]">
                    Storefront Public Profile
                  </h2>
                  <p className="text-xs text-[#646175]">
                    Changes here update your public Eazetrades Vendor page immediately.
                  </p>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
              </div>

              {settingsSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Storefront details saved and synced live.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    Store Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    Dispatch Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    Business Email ({sellerEmail})
                  </label>
                  <input
                    type="email"
                    value={settingsForm.gmail}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, gmail: e.target.value }))}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagram}
                    onChange={(e) =>
                      setSettingsForm((p) => ({ ...p, instagram: e.target.value }))
                    }
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                    X (Twitter) Handle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.xHandle}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, xHandle: e.target.value }))}
                    className="w-full h-10 px-3 text-sm rounded-xl border border-[#E2DFF2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B384A] mb-1.5">
                  Storefront Bio
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, bio: e.target.value }))}
                  className="w-full p-3 text-sm rounded-xl border border-[#E2DFF2]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Save Storefront Profile</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

