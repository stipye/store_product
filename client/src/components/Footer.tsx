import { Dumbbell, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl btn-primary-gradient text-white">
                <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-black text-gray-900">
                Promo<span className="text-[var(--color-primary)]">Pump</span>
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">
              Sua loja de afiliados profissional de produtos para academia.
              Selecionamos as melhores ofertas do Mercado Livre e da Amazon
              para você.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-900">
              Links rápidos
            </h4>
            <ul className="space-y-2 text-sm font-semibold text-gray-500">
              <li>
                <a href="#produtos" className="hover:text-[var(--color-primary)]">
                  Produtos
                </a>
              </li>
              <li>
                <a href="#avaliacoes" className="hover:text-[var(--color-primary)]">
                  Avaliações
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-[var(--color-primary)]">
                  Admin
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-900">
              Ajuda
            </h4>
            <ul className="space-y-2 text-sm font-semibold text-gray-500">
              <li>Como comprar</li>
              <li>Frete e entrega</li>
              <li>Trocas via Mercado Livre ou Amazon</li>
              <li>Fale conosco</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-900">
              Redes sociais
            </h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[var(--color-primary)] hover:text-white"
                  aria-label="Rede social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs font-semibold text-gray-400">
          <p>
            © {year} PromoPump. Como afiliado Mercado Livre e Amazon, ganhamos
            comissões por compras qualificadas.
          </p>
        </div>
      </div>
    </footer>
  );
}
