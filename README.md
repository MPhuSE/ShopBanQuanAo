# Banhang MVP

Website MVP ban tai khoan va goi truy cap so hop le, xay dung bang Next.js App Router, Supabase va QR thanh toan thu cong.

## Tinh nang

- Trang chu, danh sach san pham, chi tiet san pham
- Checkout 1 san pham / 1 don hang
- Tao order noi bo va hien QR thanh toan
- Khach tra cuu don bang ma don va email
- Admin xac nhan da nhan tien thu cong
- Tra cuu don hang theo `orderCode + email`
- Admin login bang Supabase Auth
- Admin xem don, xem san pham, cap nhat trang thai
- Admin xem thong ke doanh thu
- Luu lich su thay doi vao `order_status_logs`

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- QR thanh toan thu cong

## Chay local

1. Tao file `.env.local` tu `.env.example`.
2. Cai package:

```bash
npm install
```

3. Tao schema trong Supabase bang file [schema.sql](/c:/Users/Administrator/Desktop/LEARNING/commerce/banhang-mvp/supabase/schema.sql) va seed du lieu bang [seed.sql](/c:/Users/Administrator/Desktop/LEARNING/commerce/banhang-mvp/supabase/seed.sql).
4. Neu project Supabase cua ban da tao bang roi, chay them migration [20260322_add_product_media.sql](/c:/Users/Administrator/Desktop/LEARNING/commerce/banhang-mvp/supabase/migrations/20260322_add_product_media.sql) de them cot anh/banner cho san pham.
5. Tao 1 user admin trong Supabase Auth.
6. Chay dev server:

```bash
npm run dev
```

## Bien moi truong

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYMENT_BANK_NAME=
PAYMENT_ACCOUNT_NAME=
PAYMENT_ACCOUNT_NUMBER=
PAYMENT_NOTE_PREFIX=DH
```

## Luu y nghiep vu

- Khach thanh toan bang QR cua shop
- Anh QR duoc lay co dinh tu `public/qr.jpg`, khong can env rieng cho link anh
- Admin xac nhan thu cong de doi `payment_status = paid`
- Don da nhan tien se vao `processing`, admin xu ly roi chuyen `completed`
- Admin khong duoc chuyen `completed` neu payment chua `paid`
- Product co the gan `image_url` va `banner_image_url` de hien thi o card, trang chi tiet va hero banner
