import { useState } from "react";
import { Link } from "wouter";
import { Star, Zap, Truck, AlertTriangle, Flame } from "lucide-react";
import type { Product } from "../types";

function formatPrice(value?: number) {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({ product }: { product: Product }) {
  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  const hasDiscount =
    !!product.original_price && product.original_price > product.price;
  const discountPct =
    product.discount ??
    (hasDiscount
      ? Math.round(
          ((product.original_price! - product.price) / product.original_price!) * 100,
        )
      : 0);

  const genderMeta: Record<string, { label: string; classes: string }> = {
    feminino: { label: "♀ Feminino", classes: "bg-pink-100 text-pink-700" },
    masculino: { label: "♂ Masculino", classes: "bg-blue-100 text-blue-700" },
    unissex: { label: "⚥ Unissex", classes: "bg-gray-100 text-gray-700" },
  };
  const gender = product.gender ? genderMeta[product.gender] : undefined;

  const marketplaceMeta: Record<string, { label: string; classes: string }> = {
    mercado_livre: { label: "Mercado Livre", classes: "bg-yellow-400 text-yellow-950" },
    amazon: { label: "Amazon", classes: "bg-gray-900 text-white" },
  };
  const marketplace = product.marketplace ? marketplaceMeta[product.marketplace] : undefined;

  const outOfStock = product.in_stock === false;

  const handleBuy = () => {
    if (outOfStock) return;
    if (product.affiliate_link) {
      window.open(product.affiliate_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl hover:shadow-orange-100">
      <div
        className="relative aspect-square overflow-hidden bg-gray-50"
        onMouseEnter={() => images.length > 1 && setActiveImage(1)}
        onMouseLeave={() => setActiveImage(0)}
      >
        <Link href={`/produto/${product.id}`}>
          <img
            src={images[activeImage]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top-left badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasDiscount && discountPct > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-black text-white shadow">
              -{discountPct}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white shadow">
              <Flame className="h-3 w-3" /> Mais Vendido
            </span>
          )}
          {product.is_new && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-black text-white shadow">
              ✨ Novidade
            </span>
          )}
        </div>

        {/* Top-right badge */}
        <div className="absolute right-2 top-2">
          {product.origin === "brasil" && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-black text-gray-700 shadow">
              🇧🇷 BR
            </span>
          )}
          {product.origin === "internacional" && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-black text-gray-700 shadow">
              🌎 Intl
            </span>
          )}
        </div>

        {/* Photo count dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === activeImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-black text-white">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {/* info badges row */}
        <div className="flex flex-wrap gap-1.5">
          {product.stock_status === "full" && (
            <span className="flex items-center gap-1 rounded-md bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-800">
              <Zap className="h-3 w-3" /> FULL
            </span>
          )}
          {product.free_shipping && (
            <span className="flex items-center gap-1 rounded-md bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-800">
              <Truck className="h-3 w-3" /> Frete grátis
            </span>
          )}
          {product.stock_status === "last" && (
            <span className="flex items-center gap-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
              🔴 Última unidade
            </span>
          )}
          {product.stock_status === "low" && (
            <span className="flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
              <AlertTriangle className="h-3 w-3" /> Poucas unidades
            </span>
          )}
          {gender && (
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${gender.classes}`}
            >
              {gender.label}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>
          {marketplace && (
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${marketplace.classes}`}
            >
              {marketplace.label}
            </span>
          )}
        </div>
        <Link href={`/produto/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-[var(--color-primary)] sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.rating !== undefined && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating ?? 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            {product.sold_count && (
              <span className="ml-1 text-[11px] font-semibold text-gray-400">
                {product.sold_count} vendidos
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {hasDiscount && (
            <span className="text-xs font-semibold text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
          <span className="text-lg font-black text-gray-900 sm:text-xl">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link
            href={`/produto/${product.id}`}
            className="flex items-center justify-center rounded-full border-2 border-gray-200 px-2 py-2 text-xs font-bold text-gray-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Detalhes
          </Link>
          <button
            onClick={handleBuy}
            disabled={outOfStock}
            className={`flex items-center justify-center rounded-full px-2 py-2 text-xs font-bold text-white transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-300"
                : "btn-primary-gradient shadow-md shadow-orange-200 hover:shadow-lg active:scale-95"
            }`}
          >
            {outOfStock ? "Esgotado" : "Comprar"}
          </button>
        </div>
      </div>
    </div>
  );
}
