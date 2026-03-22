import { z } from "zod";

import { ADMIN_MUTABLE_ORDER_STATUSES } from "@/lib/constants";

export const checkoutSchema = z.object({
  productSlug: z.string().min(1),
  email: z.string().email("Email không hợp lệ."),
  customerName: z.string().trim().max(120).optional().or(z.literal("")),
  customerNote: z.string().trim().max(500).optional().or(z.literal(""))
});

export const trackOrderSchema = z.object({
  orderCode: z.string().trim().min(6),
  email: z.string().email("Email không hợp lệ.")
});

export const adminUpdateOrderSchema = z.object({
  status: z.enum(ADMIN_MUTABLE_ORDER_STATUSES),
  note: z.string().trim().max(500).optional().or(z.literal(""))
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(3, "Tên sản phẩm tối thiểu 3 ký tự.").max(160),
  slug: z
    .string()
    .trim()
    .max(180)
    .regex(/^[a-z0-9-]*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang.")
    .optional()
    .or(z.literal("")),
  shortDescription: z.string().trim().max(255).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .url("Ảnh sản phẩm phải là URL hợp lệ.")
    .optional()
    .or(z.literal("")),
  bannerImageUrl: z
    .string()
    .trim()
    .url("Banner phải là URL hợp lệ.")
    .optional()
    .or(z.literal("")),
  price: z.coerce.number().int().min(0, "Giá không được âm."),
  stockQuantity: z.coerce.number().int().min(0, "Tồn kho không được âm.").default(0),
  currency: z.string().trim().min(3).max(10).default("VND"),
  status: z.enum(["active", "draft", "inactive"]).default("active")
});
