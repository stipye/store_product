import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  PackageCheck,
  ExternalLink,
  AlertTriangle,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { API_URL, type Product } from "../types";

function formatPrice(value?: number) {
  if (value === undefined || value === null) return "";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductPage() {
  const [, params] = useRoute("/produto/:id");
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [couponCopied, setCouponCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      setActiveImage(0);
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        if (!cancelled) setProduct(data);

        const allRes = await fetch(`${API_URL}/api/products`);
        if (allRes.ok) {
          const all: Product[] = await allRes.json();
          if (!cancelled) {
            setRelated(all.filter((p) => p.id !== id).slice(0, 4));
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="skeleton-shimmer aspect-square rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton-shimmer h-6 w-1/3 rounded" />
            <div className="skeleton-shimmer h-10 w-2/3 rounded" />
            <div className="skeleton-shimmer h-8 w-1/2 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-3xl">🔍</p>
        <h1 className="mt-4 text-2xl font-black text-gray-900">
          Produto não encontrado
        </h1>
        <p className="mt-2 font-semibold text-gray-500">
          Esse produto pode ter sido removido ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full btn-primary-gradient px-6 py-3 text-sm font-bold text-white"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const hasDiscount =
    !!product.original_price && product.original_price > product.price;
  const discountPct =
    product.discount ??
    (hasDiscount
      ? Math.round(
          ((product.original_price! - product.price) / product.original_price!) * 100,
        )
      : 0);
  const outOfStock = product.in_stock === false;

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
  const buyLabel = marketplace ? `Comprar na ${marketplace.label}` : "Comprar agora";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs font-bold text-gray-400">
        <Link href="/" className="hover:text-[var(--color-primary)]">
          Início
        </Link>{" "}
        / <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            {outOfStock && (
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-black text-white">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                    i === activeImage ? "border-[var(--color-primary)]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>
          <h1 className="text-2xl font-black leading-tight text-gray-900 sm:text-3xl">
            {product.name}
          </h1>

          {product.rating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              {product.sold_count && (
                <span className="text-xs font-bold text-gray-400">
                  {product.sold_count} vendidos
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {marketplace && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${marketplace.classes}`}
              >
                {marketplace.label}
              </span>
            )}
            {gender && (
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${gender.classes}`}>
                {gender.label}
              </span>
            )}
            {product.free_shipping && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                <Truck className="h-3.5 w-3.5" /> Frete grátis
              </span>
            )}
            {product.origin === "brasil" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                🇧🇷 Brasil
              </span>
            )}
            {product.origin === "internacional" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                🌎 Internacional
              </span>
            )}
            {product.stock_status === "last" && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                🔴 Última unidade
              </span>
            )}
            {product.stock_status === "low" && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" /> Poucas unidades
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-baseline gap-3">
              {hasDiscount && (
                <span className="text-sm font-semibold text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {hasDiscount && discountPct > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">
                  -{discountPct}%
                </span>
              )}
            </div>
            <p className="mt-1 text-3xl font-black text-gray-900 sm:text-4xl">
              {formatPrice(product.price)}
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              {marketplace ? `via ${marketplace.label}` : "via loja parceira"}
            </p>
          </div>

          {product.coupon_code && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(product.coupon_code!).then(() => {
                  setCouponCopied(true);
                  setTimeout(() => setCouponCopied(false), 1500);
                });
              }}
              className="flex items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-left transition hover:border-[var(--color-primary)]"
            >
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4 shrink-0 text-orange-500" />
                <span>
                  <span className="block text-xs font-semibold text-gray-500">
                    {product.coupon_discount
                      ? `Cupom: ${product.coupon_discount}`
                      : "Cupom disponível"}
                  </span>
                  <span className="block font-mono text-sm font-black tracking-wider text-gray-900">
                    {product.coupon_code}
                  </span>
                </span>
              </span>
              {couponCopied ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Check className="h-4 w-4" /> Copiado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                  <Copy className="h-4 w-4" /> Copiar
                </span>
              )}
            </button>
          )}

          <button
            onClick={() =>
              !outOfStock &&
              product.affiliate_link &&
              window.open(product.affiliate_link, "_blank", "noopener,noreferrer")
            }
            disabled={outOfStock}
            className={`flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-black text-white transition ${
              outOfStock
                ? "cursor-not-allowed bg-gray-300"
                : "btn-primary-gradient shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95"
            }`}
          >
            {outOfStock ? "Esgotado" : buyLabel}
            {!outOfStock && <ExternalLink className="h-5 w-5" />}
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
              Compra garantida
            </span>
            <span className="flex items-center gap-1.5">
              <PackageCheck className="h-4 w-4 text-[var(--color-primary)]" />
              Vendedor verificado
            </span>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="mb-2 text-sm font-black text-gray-900">Características</h3>
              <ul className="space-y-1.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-semibold text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <div className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="mb-3 text-xl font-black text-gray-900">Descrição</h2>
          <p className="max-w-3xl whitespace-pre-line text-sm font-medium leading-relaxed text-gray-600">
            {product.description}
          </p>
        </div>
      )}

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="mb-5 text-xl font-black text-gray-900">Avaliações</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s < (review.rating ?? 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {review.text && (
                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    "{review.text}"
                  </p>
                )}
                {review.author && (
                  <p className="mt-2 text-xs font-black text-gray-900">
                    {review.author}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="mb-5 text-xl font-black text-gray-900">
            Produtos relacionados
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
