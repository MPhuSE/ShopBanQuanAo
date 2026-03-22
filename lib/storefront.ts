import type { Product } from "@/types/db";

export function getProductCategory(product: Product) {
  const haystack = `${product.name} ${product.short_description ?? ""} ${
    product.description ?? ""
  }`.toLowerCase();

  if (haystack.includes("netflix") || haystack.includes("spotify") || haystack.includes("youtube")) {
    return "Giải trí";
  }

  if (
    haystack.includes("chatgpt") ||
    haystack.includes("ai") ||
    haystack.includes("gemini") ||
    haystack.includes("grok")
  ) {
    return "AI";
  }

  if (haystack.includes("canva") || haystack.includes("capcut") || haystack.includes("design")) {
    return "Sáng tạo";
  }

  if (
    haystack.includes("office") ||
    haystack.includes("microsoft") ||
    haystack.includes("notion") ||
    haystack.includes("workspace")
  ) {
    return "Văn phòng";
  }

  return "Tài khoản số";
}

export function getCategoryList(products: Product[]) {
  return ["Tất cả", ...new Set(products.map(getProductCategory))];
}
