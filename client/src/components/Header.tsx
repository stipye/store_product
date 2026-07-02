import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, ShoppingBag, ExternalLink } from "lucide-react";

const NAV_LINKS = [
  { label: "Produtos", href: "#produtos" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl btn-primary-gradient text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-black tracking-tight text-gray-900">
            Afili<span className="text-[var(--color-primary)]">ML</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-semibold text-gray-600 transition hover:text-[var(--color-primary)]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="https://www.mercadolivre.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full btn-primary-gradient px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:shadow-lg hover:shadow-purple-300 active:scale-95"
          >
            Ver no ML
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <button
          className="rounded-lg p-2 text-gray-700 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-sm font-semibold text-gray-700"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://www.mercadolivre.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full btn-primary-gradient px-5 py-2.5 text-sm font-bold text-white"
            >
              Ver no ML
              <ExternalLink className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
