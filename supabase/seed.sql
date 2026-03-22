insert into public.products (
  name,
  slug,
  description,
  short_description,
  image_url,
  banner_image_url,
  price,
  stock_quantity,
  currency,
  status
)
values
  (
    'Canva Pro 12 thang',
    'canva-pro-12-thang',
    'Goi truy cap Canva Pro duoc shop so huu hop le, xu ly thu cong sau thanh toan.',
    'Nhan thong tin kich hoat trong gio hanh chinh.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    299000,
    20,
    'VND',
    'active'
  ),
  (
    'Goi AI Premium',
    'goi-truy-cap-ai-premium',
    'San pham so danh cho khach can su dung ngay, theo quy trinh cap phat thu cong.',
    'Theo doi trang thai bang ma don va email.',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    499000,
    15,
    'VND',
    'active'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  short_description = excluded.short_description,
  image_url = excluded.image_url,
  banner_image_url = excluded.banner_image_url,
  price = excluded.price,
  stock_quantity = excluded.stock_quantity,
  currency = excluded.currency,
  status = excluded.status,
  updated_at = now();
