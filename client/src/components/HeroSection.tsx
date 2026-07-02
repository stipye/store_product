import { Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function HeroSection() {
  const scrollToProducts = () => {
    document.querySelector("#produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-transparent">
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-purple-200 opacity-40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-200 opacity-30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Curadoria oficial de afiliados
          </span>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Perfumes Árabes Originais
            <br />
            via <span className="text-[var(--color-primary)]">Mercado Livre</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base font-semibold text-gray-500 sm:text-lg">
            Selecionamos as melhores fragrâncias com os melhores preços, frete
            rápido e a garantia de quem já compra no Mercado Livre.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center justify-center rounded-full btn-primary-gradient px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:shadow-xl hover:shadow-purple-300 active:scale-95"
            >
              Ver produtos
            </button>
            <a
              href="#avaliacoes"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 px-8 py-3.5 text-sm font-bold text-gray-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Ver avaliações
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold text-gray-500 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
              Compra 100% garantida
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-[var(--color-primary)]" />
              Frete grátis em itens selecionados
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
