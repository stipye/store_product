import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import { API_URL, type Product } from "../types";

type FilterKey =
  | "todos"
  | "feminino"
  | "masculino"
  | "unissex"
  | "frete"
  | "mercado_livre"
  | "amazon"
  | "novidades"
  | "mais_vendidos"
  | "ate_200";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "feminino", label: "Femininos" },
  { key: "masculino", label: "Masculinos" },
  { key: "unissex", label: "Unissex" },
  { key: "frete", label: "✈️ Frete Grátis" },
  { key: "mercado_livre", label: "🛒 Mercado Livre" },
  { key: "amazon", label: "📦 Amazon" },
  { key: "novidades", label: "✨ Novidades" },
  { key: "mais_vendidos", label: "🔥 Mais Vendidos" },
  { key: "ate_200", label: "Até R$200" },
];

type SortKey = "destaque" | "menor_preco" | "maior_preco" | "maior_desconto";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "destaque", label: "Destaque" },
  { key: "menor_preco", label: "Menor preço" },
  { key: "maior_preco", label: "Maior preço" },
  { key: "maior_desconto", label: "Maior desconto" },
];

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="skeleton-shimmer aspect-square" />
      <div className="space-y-2 p-4">
        <div className="skeleton-shimmer h-3 w-1/3 rounded" />
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-2/3 rounded" />
        <div className="skeleton-shimmer h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");
  const [sort, setSort] = useState<SortKey>("destaque");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("Falha ao buscar produtos");
        const data = await res.json();
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError(false);
        }
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    switch (activeFilter) {
      case "feminino":
        list = list.filter((p) => p.gender === "feminino");
        break;
      case "masculino":
        list = list.filter((p) => p.gender === "masculino");
        break;
      case "unissex":
        list = list.filter((p) => p.gender === "unissex");
        break;
      case "frete":
        list = list.filter((p) => p.free_shipping);
        break;
      case "mercado_livre":
        list = list.filter((p) => p.marketplace === "mercado_livre");
        break;
      case "amazon":
        list = list.filter((p) => p.marketplace === "amazon");
        break;
      case "novidades":
        list = list.filter((p) => p.is_new);
        break;
      case "mais_vendidos":
        list = list.filter((p) => p.is_best_seller);
        break;
      case "ate_200":
        list = list.filter((p) => p.price <= 200);
        break;
      default:
        break;
    }

    switch (sort) {
      case "menor_preco":
        list.sort((a, b) => a.price - b.price);
        break;
      case "maior_preco":
        list.sort((a, b) => b.price - a.price);
        break;
      case "maior_desconto":
        list.sort((a, b) => {
          const da =
            a.discount ??
            (a.original_price ? ((a.original_price - a.price) / a.original_price) * 100 : 0);
          const db =
            b.discount ??
            (b.original_price ? ((b.original_price - b.price) / b.original_price) * 100 : 0);
          return db - da;
        });
        break;
      default:
        break;
    }

    return list;
  }, [products, activeFilter, sort]);

  return (
    <section id="produtos" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Nossos produtos
        </h2>
        <p className="font-semibold text-gray-500">
          Escolha entre nossa seleção cuidadosa de equipamentos e suplementos
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                activeFilter === f.key
                  ? "btn-primary-gradient text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border-2 border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 focus:border-[var(--color-primary)] focus:outline-none sm:text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
          <p className="font-bold text-red-700">
            Não foi possível carregar os produtos agora. Tente novamente em instantes.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-3xl">😅</p>
          <p className="mt-3 text-lg font-black text-gray-900">
            Nenhum produto na loja ainda
          </p>
          <p className="mt-1 font-semibold text-gray-500">
            Adicione produtos usando a extensão PromoPump
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center justify-center rounded-full btn-primary-gradient px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
          >
            Ir para o Admin
          </Link>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
