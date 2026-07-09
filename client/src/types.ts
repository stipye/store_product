export interface Review {
  author?: string;
  rating?: number;
  text?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  discount?: number;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  affiliate_link?: string;
  badge?: string;
  sold_count?: string;
  rating?: number;
  gender?: "feminino" | "masculino" | "unissex" | string;
  marketplace?: "mercado_livre" | "amazon" | string;
  ml_item_id?: string;
  reviews?: Review[];
  active?: boolean;
  in_stock?: boolean;
  free_shipping?: boolean;
  is_best_seller?: boolean;
  is_new?: boolean;
  origin?: "brasil" | "internacional" | string;
  stock_status?: string;
  frete?: string;
  coupon_code?: string;
  coupon_discount?: string;
  created_at?: string;
}

export const API_URL = import.meta.env.VITE_API_URL ?? "";
