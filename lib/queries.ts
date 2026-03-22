import { createStatusLogPayload } from "@/lib/order";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { slugify } from "@/lib/utils";
import type {
  AdminDashboardStats,
  OrderStatus,
  OrderWithRelations,
  PaymentStatus,
  Product
} from "@/types/db";

type ProductOrderSnapshot = Pick<
  OrderWithRelations,
  "product_id" | "payment_status" | "order_status"
>;

function attachProductSales(products: Product[], orders: ProductOrderSnapshot[]) {
  const soldCountByProductId = orders.reduce<Map<string, number>>((acc, order) => {
    if (order.payment_status !== "paid" && order.order_status !== "completed") {
      return acc;
    }

    acc.set(order.product_id, (acc.get(order.product_id) ?? 0) + 1);
    return acc;
  }, new Map());

  return products.map((product) => ({
    ...product,
    sold_count: soldCountByProductId.get(product.id) ?? 0
  }));
}

async function getProductOrderSnapshots() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("product_id, payment_status, order_status");

  if (error) {
    throw error;
  }

  return (data ?? []) as ProductOrderSnapshot[];
}

export async function getProducts() {
  if (!hasSupabaseEnv()) {
    return [] as Product[];
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const products = (data ?? []) as Product[];
  const orders = await getProductOrderSnapshots();

  return attachProductSales(products, orders);
}

export async function getProductBySlug(slug: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const orders = await getProductOrderSnapshots();
  return attachProductSales([data as Product], orders)[0] ?? null;
}

export async function getAdminProducts() {
  if (!hasSupabaseEnv()) {
    return [] as Product[];
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const products = (data ?? []) as Product[];
  const orders = await getProductOrderSnapshots();

  return attachProductSales(products, orders);
}

export async function getAdminProductById(id: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const orders = await getProductOrderSnapshots();
  return attachProductSales([data as Product], orders)[0] ?? null;
}

export async function createAdminProduct(input: {
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  price: number;
  stockQuantity: number;
  currency: string;
  status: string;
}) {
  const supabase = createSupabaseServiceClient();
  const slug = slugify(input.slug?.trim() || input.name);

  if (!slug) {
    throw new Error("Không tạo được slug hợp lệ cho sản phẩm.");
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      slug,
      short_description: input.shortDescription?.trim() || null,
      description: input.description?.trim() || null,
      image_url: input.imageUrl?.trim() || null,
      banner_image_url: input.bannerImageUrl?.trim() || null,
      price: input.price,
      stock_quantity: input.stockQuantity,
      currency: input.currency.trim().toUpperCase(),
      status: input.status
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}

export async function updateAdminProduct(input: {
  id: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  bannerImageUrl?: string;
  price: number;
  stockQuantity: number;
  currency: string;
  status: string;
}) {
  const supabase = createSupabaseServiceClient();
  const slug = slugify(input.slug?.trim() || input.name);

  if (!slug) {
    throw new Error("Không tạo được slug hợp lệ cho sản phẩm.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      slug,
      short_description: input.shortDescription?.trim() || null,
      description: input.description?.trim() || null,
      image_url: input.imageUrl?.trim() || null,
      banner_image_url: input.bannerImageUrl?.trim() || null,
      price: input.price,
      stock_quantity: input.stockQuantity,
      currency: input.currency.trim().toUpperCase(),
      status: input.status,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}

export async function getAdminOrders() {
  if (!hasSupabaseEnv()) {
    return [] as OrderWithRelations[];
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, payments(*), order_status_logs(*), product:products(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderWithRelations[];
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  if (!hasSupabaseEnv()) {
    return {
      totalOrders: 0,
      pendingPayments: 0,
      paidOrders: 0,
      completedOrders: 0,
      paidRevenue: 0,
      completedRevenue: 0
    };
  }

  const orders = await getAdminOrders();

  return orders.reduce<AdminDashboardStats>(
    (acc, order) => {
      acc.totalOrders += 1;

      if (order.payment_status === "pending" || order.payment_status === "unpaid") {
        acc.pendingPayments += 1;
      }

      if (order.payment_status === "paid") {
        acc.paidOrders += 1;
        acc.paidRevenue += order.total_amount;
      }

      if (order.order_status === "completed") {
        acc.completedOrders += 1;
        acc.completedRevenue += order.total_amount;
      }

      return acc;
    },
    {
      totalOrders: 0,
      pendingPayments: 0,
      paidOrders: 0,
      completedOrders: 0,
      paidRevenue: 0,
      completedRevenue: 0
    }
  );
}

export async function getOrderById(id: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, payments(*), order_status_logs(*), product:products(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as OrderWithRelations | null;
}

export async function getTrackableOrder(orderCode: string, email: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const normalizedCode = orderCode.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("orders")
    .select("*, payments(*), order_status_logs(*), product:products(*)")
    .eq("order_code", normalizedCode)
    .eq("customer_email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as OrderWithRelations | null;
}

export async function createOrderPaymentBundle(input: {
  customerEmail: string;
  customerName?: string;
  customerNote?: string;
  product: Product;
  orderCode: string;
  txnRef: string;
}) {
  const supabase = createSupabaseServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_code: input.orderCode,
      customer_email: input.customerEmail.trim().toLowerCase(),
      customer_name: input.customerName?.trim() || null,
      customer_note: input.customerNote?.trim() || null,
      product_id: input.product.id,
      product_name_snapshot: input.product.name,
      unit_price: input.product.price,
      total_amount: input.product.price,
      currency: input.product.currency,
      order_status: "pending_payment",
      payment_status: "pending",
      payment_method: "manual_qr",
      vnp_txn_ref: input.txnRef
    })
    .select("*")
    .single();

  if (orderError) {
    throw orderError;
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      order_id: order.id,
      provider: "manual_qr",
      txn_ref: input.txnRef,
      amount: input.product.price,
      status: "pending"
    })
    .select("*")
    .single();

  if (paymentError) {
    throw paymentError;
  }

  const { error: logError } = await supabase
    .from("order_status_logs")
    .insert(
      createStatusLogPayload(order.id, "pending_payment", {
        fromStatus: null,
        note: "Đơn hàng đã được tạo và đang chờ khách quét QR thanh toán.",
        createdBy: "system"
      })
    );

  if (logError) {
    throw logError;
  }

  return {
    order,
    payment
  };
}

export async function confirmManualPaymentByAdmin(input: {
  orderId: string;
  createdBy: string;
  note?: string;
}) {
  const supabase = createSupabaseServiceClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, payments(*)")
    .eq("id", input.orderId)
    .single();

  if (orderError) {
    throw orderError;
  }

  const payment = (order.payments?.[0] ?? null) as
    | {
        id: string;
        status: PaymentStatus;
      }
    | null;

  if (!payment) {
    throw new Error("Không tìm thấy thanh toán của đơn hàng.");
  }

  if (payment.status === "paid") {
    return { status: "already_paid" as const };
  }

  const now = new Date().toISOString();

  const { error: paymentUpdateError } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: now,
      response_code: "MANUAL_CONFIRMED"
    })
    .eq("id", payment.id);

  if (paymentUpdateError) {
    throw paymentUpdateError;
  }

  const nextOrderStatus: OrderStatus =
    order.order_status === "completed" ? "completed" : "processing";

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      order_status: nextOrderStatus,
      updated_at: now
    })
    .eq("id", input.orderId);

  if (orderUpdateError) {
    throw orderUpdateError;
  }

  const { error: logError } = await supabase
    .from("order_status_logs")
    .insert(
      createStatusLogPayload(input.orderId, nextOrderStatus, {
        fromStatus: order.order_status as OrderStatus,
        note:
          input.note ||
          "Admin xác nhận đã nhận tiền từ thanh toán QR, chuyển đơn sang đang xử lý.",
        createdBy: input.createdBy
      })
    );

  if (logError) {
    throw logError;
  }

  return { status: "updated" as const };
}

export async function updateOrderStatusByAdmin(input: {
  orderId: string;
  nextStatus: OrderStatus;
  note?: string;
  createdBy: string;
}) {
  const supabase = createSupabaseServiceClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", input.orderId)
    .single();

  if (orderError) {
    throw orderError;
  }

  if (order.order_status === input.nextStatus) {
    return order;
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      order_status: input.nextStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.orderId)
    .select("*")
    .single();

  if (updateError) {
    throw updateError;
  }

  const { error: logError } = await supabase
    .from("order_status_logs")
    .insert(
      createStatusLogPayload(input.orderId, input.nextStatus, {
        fromStatus: order.order_status as OrderStatus,
        note: input.note ?? "Admin cập nhật trạng thái đơn hàng.",
        createdBy: input.createdBy
      })
    );

  if (logError) {
    throw logError;
  }

  return updatedOrder;
}
