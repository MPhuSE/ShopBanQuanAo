import type {
  ADMIN_MUTABLE_ORDER_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES
} from "@/lib/constants";

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type AdminMutableOrderStatus =
  (typeof ADMIN_MUTABLE_ORDER_STATUSES)[number];

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  banner_image_url: string | null;
  price: number;
  currency: string;
  status: string;
  stock_quantity: number | null;
  sold_count?: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_code: string;
  customer_email: string;
  customer_name: string | null;
  customer_note: string | null;
  product_id: string;
  product_name_snapshot: string;
  unit_price: number;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  vnp_txn_ref: string;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  provider: string;
  txn_ref: string;
  amount: number;
  status: PaymentStatus;
  response_code: string | null;
  transaction_no: string | null;
  bank_code: string | null;
  paid_at: string | null;
  raw_return_payload: Record<string, string> | null;
  raw_ipn_payload: Record<string, string> | null;
  created_at: string;
  updated_at: string;
};

export type OrderStatusLog = {
  id: string;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  created_by: string;
  created_at: string;
};

export type OrderWithRelations = Order & {
  product?: Product | null;
  payments?: Payment[];
  order_status_logs?: OrderStatusLog[];
};

export type AdminDashboardStats = {
  totalOrders: number;
  pendingPayments: number;
  paidOrders: number;
  completedOrders: number;
  paidRevenue: number;
  completedRevenue: number;
};
