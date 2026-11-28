import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Store,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Product, formatNaira, getPaymentPolicyLabel } from '../data/products';
import { OrderFulfillmentMode, OrderPaymentFlow, SellerOrder } from '../data/marketplace';

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onPlaceOrder?: (orders: SellerOrder[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [inspectionNote, setInspectionNote] = useState('');
  const [pickupHub, setPickupHub] = useState('24 Allen Avenue, Ikeja Inspection Hub');
  const [fulfillmentMode, setFulfillmentMode] = useState<OrderFulfillmentMode>('Doorstep Delivery');
  const [paymentFlow, setPaymentFlow] = useState<OrderPaymentFlow>('Pay on Delivery');
  const [orderNumber, setOrderNumber] = useState('');
  const [confirmedSnapshot, setConfirmedSnapshot] = useState<{
    name: string;
    phone: string;
    address: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    fulfillmentMode: OrderFulfillmentMode;
    paymentFlow: OrderPaymentFlow;
    conditionsSummary: string;
  } | null>(null);
  const [formError, setFormError] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  const requiresPrepay = items.some(
    (item) => item.product.paymentPolicy === 'pay-before-delivery'
  );
  const allowsPayOnDelivery = !requiresPrepay;

  useEffect(() => {
    if (requiresPrepay && paymentFlow === 'Pay on Delivery') {
      setPaymentFlow('Pay Before Delivery / Pickup');
    }
  }, [requiresPrepay, paymentFlow]);

  useEffect(() => {
    if (fulfillmentMode === 'Hub Pickup' && paymentFlow === 'Pay on Delivery') {
      setPaymentFlow('Pay Before Delivery / Pickup');
    }
  }, [fulfillmentMode, paymentFlow]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee =
    subtotal === 0 || fulfillmentMode === 'Hub Pickup' ? 0 : 2500;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setFormError('Please enter your full name and reachable phone/WhatsApp number.');
      return;
    }
    if (fulfillmentMode === 'Doorstep Delivery' && !address.trim()) {
      setFormError('Please enter your street delivery address and area.');
      return;
    }

    setFormError('');
    const id = `EZ-${Math.floor(10000 + Math.random() * 89999)}`;
    const resolvedAddress =
      fulfillmentMode === 'Hub Pickup' ? `Pickup: ${pickupHub}` : address.trim();
    const resolvedFlow: OrderPaymentFlow =
      requiresPrepay || fulfillmentMode === 'Hub Pickup'
        ? 'Pay Before Delivery / Pickup'
        : paymentFlow;

    const conditions = Array.from(new Set(items.map((i) => i.product.condition))).join(' & ');

    const newOrders: SellerOrder[] = items.map((item, idx) => {
      const itemSubtotal = item.product.price * item.quantity;
      const itemDelivery = idx === 0 ? deliveryFee : 0;
      return {
        id: `ord-${Date.now()}-${idx}`,
        orderNumber: items.length > 1 ? `${id}-${idx + 1}` : id,
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: resolvedAddress,
        itemName: `${item.product.name} (${item.color}, ${item.size})`,
        itemCondition: item.product.condition,
        quantity: item.quantity,
        goodsSubtotal: itemSubtotal,
        deliveryFee: itemDelivery,
        totalAmount: itemSubtotal + itemDelivery,
        paymentFlow: resolvedFlow,
        fulfillmentMode,
        escrowState:
          resolvedFlow === 'Pay on Delivery' ? 'Collect on Delivery' : 'Awaiting Transfer',
        status: 'Pending',
        createdAt: 'Just now',
      };
    });

    onPlaceOrder?.(newOrders);

    setOrderNumber(id);
    setConfirmedSnapshot({
      name: customerName.trim(),
      phone: phone.trim(),
      address: resolvedAddress,
      subtotal,
      deliveryFee,
      total,
      fulfillmentMode,
      paymentFlow: resolvedFlow,
      conditionsSummary: conditions || 'New',
    });
    setCheckoutStep('confirmed');
    onClearCart();
  };

  const handleClose = () => {
    if (checkoutStep === 'confirmed') {
      setCheckoutStep('cart');
      setConfirmedSnapshot(null);
    }
    onClose();
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('0194827361');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Order Checkout"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#ECEAF6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#5E35F2]" />
            <h2 className="font-display font-bold text-lg text-[#141221]">
              {checkoutStep === 'confirmed'
                ? 'Order Reserved'
                : checkoutStep === 'details'
                  ? 'Buyer Details & Trust Flow'
                  : 'Shopping Bag'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full hover:bg-[#F6F5FB] text-[#646175] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checkoutStep === 'confirmed' && confirmedSnapshot ? (
            <div className="py-6 space-y-5">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FD] text-[#5E35F2] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#141221]">
                  Order #{orderNumber} Logged
                </h3>
                <p className="text-xs sm:text-sm text-[#48455A] leading-relaxed">
                  No online card payment was charged. Your reservation for{' '}
                  <strong className="text-[#141221]">{confirmedSnapshot.name}</strong> has been sent
                  to the seller and our Ikeja verification desk.
                </p>
              </div>

              {confirmedSnapshot.paymentFlow === 'Pay on Delivery' ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-emerald-950">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4" />
                    Pay on Delivery (Inspect First at Doorstep)
                  </p>
                  <p className="leading-relaxed">
                    Our rider will call{' '}
                    <strong className="tabular-nums">{confirmedSnapshot.phone}</strong> before
                    arrival. Inspect the <strong>{confirmedSnapshot.conditionsSummary}</strong>{' '}
                    item(s) physically before paying:
                  </p>
                  <div className="pt-2 border-t border-emerald-200/80 space-y-1 tabular-nums">
                    <div className="flex justify-between">
                      <span>Goods Total:</span>
                      <span className="font-semibold">
                        {formatNaira(confirmedSnapshot.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dispatch Delivery Fee:</span>
                      <span className="font-semibold">
                        {formatNaira(confirmedSnapshot.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1">
                      <span>Due on Arrival (Cash / Rider Transfer):</span>
                      <span>{formatNaira(confirmedSnapshot.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F6F3FF] border border-[#D4CCF7] rounded-2xl p-4 space-y-3 text-xs text-[#3B384A]">
                  <p className="font-bold flex items-center gap-1.5 text-[#5E35F2]">
                    <Building2 className="w-4 h-4" />
                    Pay Before {confirmedSnapshot.fulfillmentMode === 'Hub Pickup' ? 'Counter Release' : 'Dispatch'} (Eazetrades Escrow)
                  </p>
                  <p className="leading-relaxed">
                    {confirmedSnapshot.fulfillmentMode === 'Hub Pickup'
                      ? `Visit ${confirmedSnapshot.address} to inspect your item(s) at the counter and pay ${formatNaira(confirmedSnapshot.total)} before collection, OR transfer into Escrow custody below with reference #${orderNumber}:`
                      : `Because this item requires pre-dispatch confirmation, transfer ${formatNaira(confirmedSnapshot.total)} into our verified Escrow custody account below using reference #${orderNumber}. Dispatch starts immediately once confirmed:`}
                  </p>

                  <div className="bg-white rounded-xl border border-[#E2DCF8] p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#646175]">Bank:</span>
                      <span className="font-semibold text-[#141221]">Providus Bank (Escrow)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#646175]">Account Number:</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="inline-flex items-center gap-1.5 font-mono font-bold text-[#5E35F2] cursor-pointer"
                      >
                        <span>0194827361</span>
                        {copiedAccount ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#646175]">Account Name:</span>
                      <span className="font-semibold text-[#141221]">Eazetrades Escrow Ltd</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#646175]">Transfer Reference:</span>
                      <span className="font-mono font-bold text-[#141221]">#{orderNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#FAFAFC] rounded-xl p-3.5 border border-[#ECEAF6] text-xs text-[#646175] space-y-1">
                <p>
                  <strong className="text-[#141221]">Destination:</strong>{' '}
                  {confirmedSnapshot.address}
                </p>
                <p>
                  <strong className="text-[#141221]">Item Condition:</strong>{' '}
                  {confirmedSnapshot.conditionsSummary}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue Browsing Marketplace
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F6F5FB] text-[#8A879C] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-display font-semibold text-base text-[#141221]">
                Your bag is currently empty
              </p>
              <p className="text-sm text-[#646175]">
                Add any new or verified second-hand item to reserve with your delivery details.
              </p>
            </div>
          ) : checkoutStep === 'details' ? (
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4">
              {/* Zero-Online-Payment Trust Banner */}
              <div className="bg-[#F6F3FF] border border-[#DFDAFC] rounded-xl p-3.5 text-xs text-[#3B384A] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#141221]">No online card checkout needed.</strong>{' '}
                  Submit your contact details to choose Pay on Delivery or Escrow Transfer/Pickup.
                </span>
              </div>

              {/* Fulfillment Choice: Doorstep Dispatch vs Hub Pickup */}
              <div>
                <span className="block text-xs font-semibold text-[#141221] mb-2">
                  1. How would you like to receive your goods?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('Doorstep Delivery')}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      fulfillmentMode === 'Doorstep Delivery'
                        ? 'border-[#5E35F2] bg-[#F6F3FF] text-[#5E35F2]'
                        : 'border-[#E7E4F5] text-[#48455A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Delivery</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5 tabular-nums">+₦2,500 courier</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('Hub Pickup')}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      fulfillmentMode === 'Hub Pickup'
                        ? 'border-[#5E35F2] bg-[#F6F3FF] text-[#5E35F2]'
                        : 'border-[#E7E4F5] text-[#48455A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Store className="w-3.5 h-3.5" />
                      <span>Hub / Store Pickup</span>
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5 tabular-nums">₦0 · Inspect at desk</p>
                  </button>
                </div>
              </div>

              {/* Buyer Contact Inputs */}
              <div>
                <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Adebayo Ogunleye"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0803 000 0000"
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              {fulfillmentMode === 'Doorstep Delivery' ? (
                <div>
                  <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                    Delivery Address (Street, Area, State) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 Opebi Road, Ikeja, Lagos"
                    className="w-full p-3 text-sm rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                    Select Inspection & Pickup Point
                  </label>
                  <select
                    value={pickupHub}
                    onChange={(e) => setPickupHub(e.target.value)}
                    className="w-full h-11 px-3 text-xs font-semibold rounded-xl border border-[#E7E4F5] bg-white focus:outline-none focus:border-[#5E35F2]"
                  >
                    <option>24 Allen Avenue, Ikeja Inspection Hub</option>
                    <option>Victoria Island Showroom Pickup Desk</option>
                    <option>Wuse II Abuja Partner Desk</option>
                  </select>
                </div>
              )}

              {/* Settlement Flow Choice */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#141221]">
                  2. Payment & Trust Flow
                </span>

                {requiresPrepay && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                    <span>
                      Your bag includes an item marked <strong>Pay Before Delivery / Pickup</strong>{' '}
                      by the seller. Pre-dispatch Escrow Transfer or Hub Pickup applies.
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={!allowsPayOnDelivery || fulfillmentMode === 'Hub Pickup'}
                    onClick={() => setPaymentFlow('Pay on Delivery')}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors ${
                      !allowsPayOnDelivery || fulfillmentMode === 'Hub Pickup'
                        ? 'opacity-50 cursor-not-allowed border-[#ECEAF6] bg-[#FAFAFD]'
                        : paymentFlow === 'Pay on Delivery'
                          ? 'border-[#5E35F2] bg-[#F6F3FF] cursor-pointer'
                          : 'border-[#E7E4F5] hover:border-[#5E35F2]/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#141221]">
                        Pay on Delivery (Goods + Delivery on Arrival)
                      </span>
                      <span className="text-xs font-bold text-[#5E35F2] tabular-nums">
                        {formatNaira(total)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#646175] mt-1 leading-relaxed">
                      Pay zero upfront. Inspect the item condition with our dispatch rider, then pay
                      goods ({formatNaira(subtotal)}) + delivery ({formatNaira(deliveryFee)}) when
                      it arrives.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentFlow('Pay Before Delivery / Pickup')}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      paymentFlow === 'Pay Before Delivery / Pickup'
                        ? 'border-[#5E35F2] bg-[#F6F3FF]'
                        : 'border-[#E7E4F5] hover:border-[#5E35F2]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#141221]">
                        Pay Before Delivery or at Pickup (Escrow)
                      </span>
                      <span className="text-xs font-bold text-[#5E35F2] tabular-nums">
                        {formatNaira(total)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#646175] mt-1 leading-relaxed">
                      Receive our verified Escrow transfer account or Pickup code after placing your
                      details. Seller is paid only after you confirm item matches its listing.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141221] mb-1.5">
                  Delivery / Condition Note (Optional)
                </label>
                <input
                  type="text"
                  value={inspectionNote}
                  onChange={(e) => setInspectionNote(e.target.value)}
                  placeholder="e.g. Call 15 mins before arrival / prefer afternoon"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#E7E4F5] focus:outline-none focus:border-[#5E35F2]"
                />
              </div>

              {formError && <p className="text-xs font-medium text-red-700">{formError}</p>}
            </form>
          ) : (
            <div className="space-y-5">
              {/* Trust Notice */}
              <div className="bg-[#F6F5FB] rounded-xl p-3.5 text-xs text-[#3B384A] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#5E35F2] shrink-0 mt-0.5" />
                <span>
                  Every product displays its condition (<strong>New</strong> or{' '}
                  <strong>Second-Hand</strong>) and accepted delivery flow before confirmation.
                </span>
              </div>

              <ul className="divide-y divide-[#ECEAF6]">
                {items.map((item, idx) => (
                  <li
                    key={`${item.product.id}-${item.color}-${item.size}`}
                    className="py-4 flex gap-3.5"
                  >
                    <img
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover bg-[#F5F5F7] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#141221] leading-snug">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#8A879C] hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#646175] mt-0.5">
                        {item.color} · {item.size}
                      </p>
                      <p className="text-[11px] font-medium text-[#5E35F2] mt-1">
                        {item.product.condition} · {getPaymentPolicyLabel(item.product.paymentPolicy)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E7E4F5] rounded-lg">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, -1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#3B384A] hover:bg-[#F6F5FB] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#3B384A] hover:bg-[#F6F5FB] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#141221] tabular-nums">
                          {formatNaira(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && checkoutStep !== 'confirmed' && (
          <div className="px-6 py-5 border-t border-[#ECEAF6] bg-[#FAFAFC] space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#646175]">
                <span>Goods Subtotal</span>
                <span className="tabular-nums font-medium text-[#141221]">
                  {formatNaira(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#646175]">
                <span>
                  {fulfillmentMode === 'Hub Pickup' ? 'Hub Pickup Fee' : 'Express Dispatch Fee'}
                </span>
                <span className="tabular-nums font-medium text-[#141221]">
                  {deliveryFee === 0 ? '₦0 (Pickup)' : formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#141221] pt-1.5 border-t border-[#ECEAF6]">
                <span>
                  {checkoutStep === 'details' && paymentFlow === 'Pay on Delivery'
                    ? 'Total Due on Delivery'
                    : 'Total Amount'}
                </span>
                <span className="tabular-nums text-[#5E35F2]">{formatNaira(total)}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                type="button"
                onClick={() => setCheckoutStep('details')}
                className="w-full h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Enter Details & Choose Payment Flow
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 h-11 rounded-full border border-[#E7E4F5] bg-white text-sm font-semibold text-[#3B384A] hover:bg-[#F6F5FB] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 h-11 rounded-full bg-[#5E35F2] hover:bg-[#4D26D9] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {paymentFlow === 'Pay on Delivery'
                    ? 'Confirm Pay-on-Delivery Order'
                    : 'Reserve & Get Escrow Details'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

