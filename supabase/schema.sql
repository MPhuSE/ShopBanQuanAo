create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  image_url text,
  banner_image_url text,
  price integer not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  currency text not null default 'VND',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_email text not null,
  customer_name text,
  customer_note text,
  product_id uuid not null references public.products(id),
  product_name_snapshot text not null,
  unit_price integer not null check (unit_price >= 0),
  total_amount integer not null check (total_amount >= 0),
  currency text not null default 'VND',
  order_status text not null default 'pending_payment',
  payment_status text not null default 'pending',
  payment_method text not null default 'manual_qr',
  vnp_txn_ref text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'manual_qr',
  txn_ref text not null unique,
  amount integer not null check (amount >= 0),
  status text not null default 'pending',
  response_code text,
  transaction_no text,
  bank_code text,
  paid_at timestamptz,
  raw_return_payload jsonb,
  raw_ipn_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_order_status_logs_order_id on public.order_status_logs(order_id);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.order_status_logs enable row level security;
