"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";


type OrderStatus = "Pending" | "Processing" | "Fulfilled" | "Cancelled";

interface ShopifyOrderNode {
  id: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  phone?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  customer?: {
    displayName: string;
    email: string;
    phone?: string;
  };
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: {
      node: {
        id: string;
        title: string;
        quantity: number;
        originalUnitPriceSet?: {
          shopMoney: {
            amount: string;
          };
        };
      };
    }[];
  };
  shippingLines?: {
    edges: {
      node: {
        originalPriceSet: {
          shopMoney: {
            amount: string;
          };
        };
      };
    }[];
  };
  transactions?: {
    id: string;
    gateway: string;
    kind: string;
    amount: string;
  }[];
  metafields?: {
    edges: {
      node: {
        key: string;
        value: string;
      };
    }[];
  };
}

interface Order {
  id: string;
  customer: string;
  email: string;
  items: string;
  total: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  rawDate: Date;
  numericId: string;
  lineItems: { id: string; title: string; quantity: number; price: string }[];
  transactions: { id: string; gateway: string; kind: string; amount: string }[];
  deliveredBy?: string;
  deliveryRemarks?: string;
  refundReason?: string;
  refundRemarks?: string;
  phone: string;
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  shippingAmount?: number;
}

interface AbandonedCheckout {
  id: string;
  token: string;
  email: string;
  created_at: string;
  total_price: string;
  currency: string;
  abandoned_checkout_url: string;
  line_items: {
    title: string;
    quantity: number;
    price: string;
  }[];
}
function mapShopifyStatus(
  fulfillment: string,
  financial: string,
  transactions: { kind: string; status?: string }[] = []
): OrderStatus {
  const fin = financial?.toLowerCase();
  if (fin === "refunded" || fin === "partially_refunded") return "Cancelled";

  const hasRefund = transactions.some(
    t => t.kind === "REFUND" && (t.status === "SUCCESS" || t.status === "PENDING")
  );
  if (hasRefund) return "Cancelled";

  switch (fulfillment?.toLowerCase()) {
    case "fulfilled": return "Fulfilled";
    case "unfulfilled":
    case "partial": return "Processing";
    case "cancelled": return "Cancelled";
    default: return "Pending";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function toDateInputValue(d: Date) {
  return d.toISOString().split("T")[0];
}

function normalizeOrder(o: ShopifyOrderNode): Order {
  const itemsList = o.lineItems?.edges ?? [];
  const itemsText =
    itemsList.length === 1
      ? `${itemsList[0].node.quantity} x ${itemsList[0].node.title}`
      : `${itemsList.length} items`;
  const numericId = o.id.split("/").pop() ?? o.id;
  const totalAmount = parseFloat(o.totalPriceSet?.shopMoney?.amount ?? "0");

  const metaEdges = o.metafields?.edges ?? [];
  const getMeta = (key: string) =>
    metaEdges.find((e) => e.node.key === key)?.node.value;
  const shippingAmount = (o.shippingLines?.edges ?? []).reduce((sum, e) => {
    return sum + parseFloat(e.node.originalPriceSet?.shopMoney?.amount ?? "0");
  }, 0);
  return {
    id: o.name || o.id,
    customer: o.customer?.displayName || "Guest",
    email: o.customer?.email || "-",
    items: itemsText,
    total: `${o.totalPriceSet?.shopMoney?.amount ?? "0"} ${o.totalPriceSet?.shopMoney?.currencyCode ?? ""}`,
    totalAmount,
    status: mapShopifyStatus(o.displayFulfillmentStatus, o.displayFinancialStatus, o.transactions ?? []),
    date: formatDate(o.createdAt),
    rawDate: new Date(o.createdAt),
    numericId,
    shippingAmount: shippingAmount,
    lineItems: itemsList
      .filter(e => e.node.title.toLowerCase() !== "tip")
      .map(e => ({
        id: e.node.id,
        title: e.node.title,
        quantity: e.node.quantity,
        price: e.node.originalUnitPriceSet?.shopMoney?.amount ?? "0",
      })),
    transactions: o.transactions ?? [],
    deliveredBy: getMeta("delivered_by"),
    deliveryRemarks: getMeta("delivery_remarks"),
    refundReason: getMeta("refund_reason"),
    refundRemarks: getMeta("refund_remarks"),
    phone: o.shippingAddress?.phone || o.customer?.phone || o.phone || "—",
    shippingAddress: o.shippingAddress ? {
      address1: o.shippingAddress.address1,
      address2: o.shippingAddress.address2,
      city: o.shippingAddress.city,
      province: o.shippingAddress.province,
      zip: o.shippingAddress.zip,
      country: o.shippingAddress.country,
    } : undefined,
  };
}

function Toast({ message, visible, isError }: { message: string; visible: boolean; isError: boolean }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.toastVisible : styles.toastHidden} ${isError ? styles.toastError : styles.toastSuccess}`}>
      {isError ? "⚠" : "✓"} {message}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    Pending: styles.badgePending,
    Processing: styles.badgeProcessing,
    Fulfilled: styles.badgeFulfilled,
    Cancelled: styles.badgeCancelled,
  };
  return <span className={`${styles.badge} ${map[status]}`}>{status}</span>;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.metricCard}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        {children}
      </div>
    </div>
  );
}

function RefundPanel({
  order,
  onSuccess,
  onCancel,
}: {
  order: Order;
  onSuccess: (reason: string, remarks: string) => void;
  onCancel: () => void;
}) {
  const REFUND_FEE = 0.10;
  const fullAmount = order.totalAmount;
  const shippingAmount = order.shippingAmount ?? 0;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reason, setReason] = useState(order.refundReason ?? "");
  const [remarks, setRemarks] = useState(order.refundRemarks ?? "");
  const lineItemsTotal = order.lineItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);
  const feeAmount = parseFloat((lineItemsTotal * REFUND_FEE).toFixed(2));
  const refundAmount = parseFloat((lineItemsTotal - feeAmount).toFixed(2));
  const alreadyRefunded = order.status === "Cancelled" && !!order.refundReason;
  const originalTxn = order.transactions.find(t => t.kind === "SALE" || t.kind === "CAPTURE");

  async function handleRefund() {
    if (!reason.trim()) { setError("Please provide a reason for the refund."); return; }
    if (!originalTxn) { setError("No payment transaction found for this order."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${order.numericId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullAmount,
          originalTransactionId: originalTxn.id,
          gateway: originalTxn.gateway,
          reason: reason.trim(),
          remarks: remarks.trim(),
          lineItems: order.lineItems.map(item => ({ lineItemId: item.id, quantity: item.quantity, price: item.price })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Refund failed");
      }
      await Promise.all([
        fetch(`/api/orders/${order.numericId}/metafields`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ namespace: "vapor_aura", key: "refund_reason", value: reason.trim(), type: "single_line_text_field" }),
        }),
        fetch(`/api/orders/${order.numericId}/metafields`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ namespace: "vapor_aura", key: "refund_remarks", value: remarks.trim() || "—", type: "single_line_text_field" }),
        }),
      ]);

      onSuccess(reason.trim(), remarks.trim());
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.modalHeader}>
        <p className={styles.modalTitle}>
          {alreadyRefunded ? "Refund Details" : "Process Refund"}
        </p>
        <p className={styles.modalSubtitle}>{order.id} · {order.customer}</p>
      </div>

      {alreadyRefunded && (
        <div className={styles.refundedBanner}>
          <span className={styles.refundedBannerIcon}>↩</span>
          <span>This order has been refunded</span>
        </div>
      )}

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Reason for Refund {!alreadyRefunded && <span className={styles.requiredStar}>*</span>}
        </label>
        <input
          type="text"
          className={`${styles.formInput} ${error && !reason.trim() ? styles.formInputError : ""} ${alreadyRefunded ? styles.formInputReadonly : ""}`}
          placeholder="e.g. Damaged product, Wrong item sent…"
          value={reason}
          onChange={e => { if (!alreadyRefunded) { setReason(e.target.value); setError(""); } }}
          readOnly={alreadyRefunded}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Additional Remarks <span className={styles.optionalTag}>(optional)</span>
        </label>
        <textarea
          className={`${styles.formTextarea} ${alreadyRefunded ? styles.formInputReadonly : ""}`}
          placeholder="Any extra notes…"
          value={remarks}
          onChange={e => { if (!alreadyRefunded) setRemarks(e.target.value); }}
          rows={2}
          readOnly={alreadyRefunded}
        />
      </div>

      <div className={styles.refundBreakdown}>
        <div className={styles.refundRow}>
          <span>Order total</span>
          <span>${fullAmount.toFixed(2)}</span>
        </div>
        {shippingAmount > 0 && (
          <div className={`${styles.refundRow} ${styles.refundFeeRow}`}>
            <span>Shipping (non-refundable)</span>
            <span>− ${shippingAmount.toFixed(2)}</span>
          </div>
        )}
        <div className={`${styles.refundRow} ${styles.refundFeeRow}`}>
          <span>Tip (non-refundable)</span>
          <span>− ${(fullAmount - shippingAmount - lineItemsTotal).toFixed(2)}</span>
        </div>
        <div className={`${styles.refundRow} ${styles.refundFeeRow}`}>
          <span>Handling fee (10%)</span>
          <span>− ${feeAmount.toFixed(2)}</span>
        </div>
        <div className={`${styles.refundRow} ${styles.refundTotalRow}`}>
          <span>Customer received</span>
          <span>${refundAmount.toFixed(2)}</span>
        </div>
      </div>

      {!alreadyRefunded && !originalTxn && (
        <p className={styles.formWarning}>⚠ No payment transaction found. Refund cannot be processed automatically.</p>
      )}
      {error && <p className={styles.formError}>{error}</p>}

      {alreadyRefunded ? (
        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onCancel}>Close</button>
        </div>
      ) : (
        <div className={styles.modalActions}>
          <button
            className={`${styles.btnPrimary} ${styles.btnDanger}`}
            onClick={handleRefund}
            disabled={loading || !originalTxn}
          >
            {loading ? "Processing…" : `Confirm Refund ($${refundAmount.toFixed(2)})`}
          </button>
          <button className={styles.btnSecondary} onClick={onCancel} disabled={loading}>Cancel</button>
        </div>
      )}
    </>
  );
}

function DeliveryPanel({
  order,
  onSave,
  onCancel,
}: {
  order: Order;
  onSave: (deliveredBy: string, remarks: string) => Promise<void>;
  onCancel: () => void;
}) {
  const alreadyFulfilled = order.status === "Fulfilled" && !!order.deliveredBy;
  const [deliveredBy, setDeliveredBy] = useState(order.deliveredBy ?? "");
  const [remarks, setRemarks] = useState(order.deliveryRemarks ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!deliveredBy.trim()) { setError("Delivered By is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(deliveredBy.trim(), remarks.trim());
      setSaved(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to save delivery details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.modalHeader}>
        <p className={styles.modalTitle}>
          {alreadyFulfilled ? "Delivery Details" : "Mark as Fulfilled"}
        </p>
        <p className={styles.modalSubtitle}>{order.id} · {order.customer}</p>
      </div>

      {alreadyFulfilled && (
        <div className={styles.fulfilledBanner}>
          <span className={styles.fulfilledBannerIcon}>✓</span>
          <span>This order has been fulfilled</span>
        </div>
      )}

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Delivered By {!alreadyFulfilled && <span className={styles.requiredStar}>*</span>}
        </label>
        <input
          type="text"
          className={`${styles.formInput} ${error && !deliveredBy.trim() ? styles.formInputError : ""} ${alreadyFulfilled ? styles.formInputReadonly : ""}`}
          placeholder="Enter name of delivery person"
          value={deliveredBy}
          onChange={e => { if (!alreadyFulfilled) { setDeliveredBy(e.target.value); setError(""); } }}
          readOnly={alreadyFulfilled}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Remarks <span className={styles.optionalTag}>(optional)</span>
        </label>
        <textarea
          className={`${styles.formTextarea} ${alreadyFulfilled ? styles.formInputReadonly : ""}`}
          placeholder="Any delivery notes or remarks…"
          value={remarks}
          onChange={e => { if (!alreadyFulfilled) setRemarks(e.target.value); }}
          rows={3}
          readOnly={alreadyFulfilled}
        />
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      {saved ? (
        <p className={styles.formSuccess}>✓ Order fulfilled and delivery details saved</p>
      ) : alreadyFulfilled ? (
        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onCancel}>Close</button>
        </div>
      ) : (
        <div className={styles.modalActions}>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Confirm & Fulfill"}
          </button>
          <button className={styles.btnSecondary} onClick={onCancel} disabled={saving}>Cancel</button>
        </div>
      )}
    </>
  );
}

function OrdersPanel() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [dateFrom, setDateFrom] = useState(toDateInputValue(sevenDaysAgo));
  const [dateTo, setDateTo] = useState(toDateInputValue(today));
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "", isError: false });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryModalOrderId, setDeliveryModalOrderId] = useState<string | null>(null);
  const [refundModalOrderId, setRefundModalOrderId] = useState<string | null>(null);

  const deliveryModalOrder = orders.find(o => o.id === deliveryModalOrderId) ?? null;
  const refundModalOrder = orders.find(o => o.id === refundModalOrderId) ?? null;

  function showToast(message: string, isError = false) {
    setToast({ visible: true, message, isError });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const json = await res.json();
        const rawOrders: ShopifyOrderNode[] = Array.isArray(json) ? json : [];
        setOrders(rawOrders.map(normalizeOrder));
      } catch (err) {
        console.error(err);
        showToast("Failed to load orders", true);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  async function handleFulfillWithDelivery(
    order: Order,
    deliveredBy: string,
    remarks: string,
  ): Promise<void> {
    const [fulfillRes] = await Promise.all([
      fetch(`/api/orders/${order.numericId}/fulfill`, { method: "POST" }),
      fetch(`/api/orders/${order.numericId}/metafields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namespace: "vapor_aura", key: "delivered_by", value: deliveredBy, type: "single_line_text_field" }),
      }),
      fetch(`/api/orders/${order.numericId}/metafields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namespace: "vapor_aura", key: "delivery_remarks", value: remarks || "—", type: "single_line_text_field" }),
      }),
    ]);

    if (!fulfillRes.ok) {
      const data = await fulfillRes.json().catch(() => ({}));
      throw new Error(data?.error ?? "Failed to fulfill order");
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === order.id
          ? { ...o, status: "Fulfilled" as OrderStatus, deliveredBy, deliveryRemarks: remarks }
          : o
      )
    );
  }

  const filteredOrders = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || o.status === statusFilter;
      const matchesFrom = !from || o.rawDate >= from;
      const matchesTo = !to || o.rawDate <= to;
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const fulfilled = orders.filter((o) => o.status === "Fulfilled").length;
    return { total, pending, fulfilled };
  }, [orders]);

  return (
    <div>
      <div className={styles.metricsGrid}>
        <MetricCard label="Total orders" value={metrics.total} />
        <MetricCard label="Pending" value={metrics.pending} />
        <MetricCard label="Fulfilled" value={metrics.fulfilled} />
        <MetricCard label="Revenue (30d)" value="—" />
      </div>

      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search by order # or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className={styles.statusSelect}
        >
          <option value="">All statuses</option>
          {(["Pending", "Processing", "Fulfilled", "Cancelled"] as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={styles.dateInput} title="From date" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={styles.dateInput} title="To date" />
        {(dateFrom || dateTo) && (
          <button className={styles.clearBtn} onClick={() => { setDateFrom(toDateInputValue(sevenDaysAgo)); setDateTo(toDateInputValue(today)); }}>
            Reset dates
          </button>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Delivered By / Reason</th>
              <th>Remarks</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className={styles.tdCenter}>Loading orders…</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={9} className={styles.tdCenter}>No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td className={styles.tdBold}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td className={styles.tdMuted}>{order.items}</td>
                    <td className={styles.tdBold}>{order.total}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td className={styles.tdMuted}>{order.date}</td>
                    <td className={styles.tdMuted}>
                      {order.status === "Fulfilled" && order.deliveredBy
                        ? order.deliveredBy
                        : order.status === "Cancelled" && order.refundReason
                          ? <span className={styles.refundReasonCell}>{order.refundReason}</span>
                          : "—"}
                    </td>
                    <td className={styles.tdMuted}>
                      {order.status === "Fulfilled" && order.deliveryRemarks
                        ? order.deliveryRemarks
                        : order.status === "Cancelled" && order.refundRemarks
                          ? order.refundRemarks
                          : "—"}
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                      >
                        {openOrderId === order.id ? "Close" : "View"}
                      </button>
                    </td>
                  </tr>

                  {openOrderId === order.id && (
                    <tr>
                      <td colSpan={9} className={styles.orderDetail}>
                        <div className={styles.orderDetailInner}>

                          <div className={styles.orderDetailHeader}>
                            <div>
                              <span className={styles.orderDetailTitle}>{order.id}</span>
                              <StatusBadge status={order.status} />
                            </div>
                            <div className={styles.orderDetailActions}>
                              <button
                                className={styles.actionBtn}
                                onClick={() => setDeliveryModalOrderId(order.id)}
                                disabled={order.status === "Cancelled"}
                              >
                                {order.status === "Fulfilled" ? "View Delivery" : "Mark Fulfilled"}
                              </button>

                              <button
                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                onClick={() => setRefundModalOrderId(order.id)}
                                disabled={order.status === "Fulfilled"}
                              >
                                {order.status === "Cancelled" && order.refundReason ? "View Refund" : "Refund"}
                              </button>

                              <button
                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                disabled={order.status === "Cancelled" || order.status === "Fulfilled"}
                                onClick={() => showToast("Order cancelled", true)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          {order.status === "Fulfilled" && order.deliveredBy && (
                            <div className={styles.orderSummaryStrip}>
                              <div className={styles.orderSummaryStripItem}>
                                <span className={styles.orderSummaryStripLabel}>Delivered by</span>
                                <span className={styles.orderSummaryStripValue}>{order.deliveredBy}</span>
                              </div>
                              {order.deliveryRemarks && order.deliveryRemarks !== "—" && (
                                <div className={styles.orderSummaryStripItem}>
                                  <span className={styles.orderSummaryStripLabel}>Remarks</span>
                                  <span className={styles.orderSummaryStripValue}>{order.deliveryRemarks}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {order.status === "Cancelled" && order.refundReason && (
                            <div className={`${styles.orderSummaryStrip} ${styles.orderSummaryStripDanger}`}>
                              <div className={styles.orderSummaryStripItem}>
                                <span className={styles.orderSummaryStripLabel}>Refund reason</span>
                                <span className={styles.orderSummaryStripValue}>{order.refundReason}</span>
                              </div>
                              {order.refundRemarks && order.refundRemarks !== "—" && (
                                <div className={styles.orderSummaryStripItem}>
                                  <span className={styles.orderSummaryStripLabel}>Remarks</span>
                                  <span className={styles.orderSummaryStripValue}>{order.refundRemarks}</span>
                                </div>
                              )}
                              <div className={styles.orderSummaryStripItem}>
                                <span className={styles.orderSummaryStripLabel}>Refunded</span>
                                <span className={styles.orderSummaryStripValue}>
                                  ${(order.lineItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0) * 0.9).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className={styles.detailGrid}>

                            <div className={styles.detailSection}>
                              <p className={styles.detailSectionTitle}>Customer</p>
                              <div className={styles.detailRow}>
                                <span className={styles.detailRowIcon}>👤</span>
                                <span className={styles.detailRowValue}>{order.customer}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <span className={styles.detailRowIcon}>✉</span>
                                <a href={`mailto:${order.email}`} className={styles.detailLink}>{order.email}</a>
                              </div>
                              <div className={styles.detailRow}>
                                <span className={styles.detailRowIcon}>📞</span>
                                {order.phone !== "—"
                                  ? <a href={`tel:${order.phone}`} className={`${styles.detailLink} ${styles.phoneLink}`}>{order.phone}</a>
                                  : <span className={styles.detailMuted}>No phone on file</span>}
                              </div>
                            </div>

                            <div className={styles.detailSection}>
                              <p className={styles.detailSectionTitle}>Ship To</p>
                              {order.shippingAddress ? (
                                <>
                                  <div className={styles.detailRow}>
                                    <span className={styles.detailRowIcon}>📍</span>
                                    <span className={styles.detailRowValue}>
                                      {order.shippingAddress.address1}
                                      {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ""}
                                    </span>
                                  </div>
                                  <div className={styles.detailRow}>
                                    <span className={styles.detailRowIcon} />
                                    <span className={styles.detailRowValue}>
                                      {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                                    </span>
                                  </div>
                                  <div className={styles.detailRow}>
                                    <span className={styles.detailRowIcon} />
                                    <span className={styles.detailMuted}>{order.shippingAddress.country}</span>
                                  </div>
                                </>
                              ) : (
                                <span className={styles.detailMuted}>No shipping address</span>
                              )}
                            </div>

                            <div className={styles.detailSection}>
                              <p className={styles.detailSectionTitle}>Order</p>
                              <div className={styles.detailRow}>
                                <span className={styles.detailRowIcon}>🗓</span>
                                <span className={styles.detailRowValue}>{order.date}</span>
                              </div>
                              <div className={styles.detailRow}>
                                <span className={styles.detailRowIcon}>💳</span>
                                <span className={styles.detailRowValue}>{order.total}</span>
                              </div>
                            </div>

                            <div className={styles.detailSection}>
                              <p className={styles.detailSectionTitle}>Items</p>
                              {order.lineItems.map((item, i) => (
                                <div key={i} className={styles.detailRow}>
                                  <span className={styles.detailRowIcon}>📦</span>
                                  <span className={styles.detailRowValue}>{item.quantity} × {item.title}</span>
                                </div>
                              ))}
                            </div>

                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deliveryModalOrder && (
        <Modal onClose={() => setDeliveryModalOrderId(null)}>
          <DeliveryPanel
            order={deliveryModalOrder}
            onSave={async (deliveredBy, remarks) => {
              await handleFulfillWithDelivery(deliveryModalOrder, deliveredBy, remarks);
              setDeliveryModalOrderId(null);
              showToast(`Order ${deliveryModalOrder.id} fulfilled`);
            }}
            onCancel={() => setDeliveryModalOrderId(null)}
          />
        </Modal>
      )}

      {refundModalOrder && (
        <Modal onClose={() => setRefundModalOrderId(null)}>
          <RefundPanel
            order={refundModalOrder}
            onSuccess={(reason, remarks) => {
              setOrders(prev => prev.map(o =>
                o.id === refundModalOrder.id
                  ? { ...o, status: "Cancelled" as OrderStatus, refundReason: reason, refundRemarks: remarks }
                  : o
              ));
              setRefundModalOrderId(null);
              showToast(`Refund of $${(refundModalOrder.totalAmount * 0.9).toFixed(2)} processed`);
            }}
            onCancel={() => setRefundModalOrderId(null)}
          />
        </Modal>
      )}

      <Toast {...toast} />
    </div>
  );
}

function AbandonedPanel() {
  const [checkouts, setCheckouts] = useState<AbandonedCheckout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [followedUp, setFollowedUp] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: "", isError: false });

  function showToast(message: string, isError = false) {
    setToast({ visible: true, message, isError });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders/abandoned");
        const json = await res.json();
        setCheckouts(Array.isArray(json) ? json : []);
      } catch {
        showToast("Failed to load abandoned checkouts", true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = checkouts.filter(
    (c) => !search || c.email?.toLowerCase().includes(search.toLowerCase()) || c.id?.toString().includes(search)
  );

  return (
    <div>
      <div className={styles.metricsGrid}>
        <MetricCard label="Abandoned checkouts" value={checkouts.length} />
        <MetricCard label="Followed up" value={followedUp.size} />
        <MetricCard label="Pending follow-up" value={checkouts.length - followedUp.size} />
        <MetricCard
          label="Potential revenue"
          value={checkouts.length ? `$${checkouts.reduce((sum, c) => sum + parseFloat(c.total_price ?? "0"), 0).toFixed(2)}` : "—"}
        />
      </div>

      <div className={styles.filterRow}>
        <input
          type="text"
          placeholder="Search by email or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={styles.tdCenter}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className={styles.tdCenter}>No abandoned checkouts found.</td></tr>
            ) : (
              filtered.map((c) => {
                const done = followedUp.has(c.id);
                return (
                  <tr key={c.id} className={done ? styles.rowFollowedUp : ""}>
                    <td className={styles.tdBold}>#{c.id}</td>
                    <td>{c.email || "—"}</td>
                    <td className={styles.tdMuted}>
                      {c.line_items?.length === 1
                        ? `${c.line_items[0].quantity} x ${c.line_items[0].title}`
                        : `${c.line_items?.length ?? 0} items`}
                    </td>
                    <td className={styles.tdBold}>${parseFloat(c.total_price).toFixed(2)} {c.currency}</td>
                    <td className={styles.tdMuted}>
                      {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td>
                      {done
                        ? <span className={`${styles.badge} ${styles.badgeFulfilled}`}>Followed Up</span>
                        : <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>}
                    </td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        disabled={done}
                        onClick={() => {
                          setFollowedUp(prev => new Set(prev).add(c.id));
                          showToast(`Marked as followed up — ${c.email || c.id}`);
                        }}
                      >
                        {done ? "Done" : "Mark Followed Up"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Toast {...toast} />
    </div>
  );
}

function ProductsPanel() {
  const router = useRouter();
  useEffect(() => { router.push("/admin/products"); }, [router]);
  return <div className={styles.redirecting}><p>Redirecting to Products…</p></div>;
}

type Tab = "orders" | "abandoned" | "products";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("orders");
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vapor Aura — Admin</h1>
        <span className={styles.storeBadge}>vapor-aura.myshopify.com</span>
      </div>
      <div className={styles.tabs}>
        {([{ id: "orders", label: "Orders" }, { id: "abandoned", label: "Abandoned" }, { id: "products", label: "Products" }] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "orders" && <OrdersPanel />}
      {tab === "abandoned" && <AbandonedPanel />}
      {tab === "products" && <ProductsPanel />}
    </main>
  );
}