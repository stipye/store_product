import { Star, BadgeCheck } from "lucide-react";

const REVIEWS = [
  {
    author: "Mariana S.",
    rating: 5,
    text: "Perfume chegou rapidinho e o cheiro é idêntico ao original. Já é a terceira vez que compro e nunca me decepcionou.",
  },
  {
    author: "Carlos E.",
    rating: 5,
    text: "Fixação excelente, dura o dia inteiro. Atendimento nota 10 e embalagem muito bem cuidada.",
  },
  {
    author: "Fernanda L.",
    rating: 4,
    text: "Gostei muito da fragrância, só achei o frasco um pouco menor do que esperava. Ainda assim vale muito o preço.",
  },
  {
    author: "Rodrigo A.",
    rating: 5,
    text: "Comprei de presente para minha esposa e ela amou. Recomendo para quem quer qualidade sem pagar caro.",
  },
  {
    author: "Juliana P.",
    rating: 5,
    text: "Melhor custo-benefício que já encontrei em perfumaria árabe. Virei cliente fiel da loja.",
  },
];

export default function ReviewsSection() {
  return (
    <section id="avaliacoes" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            O que dizem nossos clientes
          </h2>
          <p className="mt-2 font-semibold text-gray-500">
            Avaliações reais de quem já comprou
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="flex-1 text-sm font-semibold leading-relaxed text-gray-600">
                "{review.text}"
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-sm font-black text-gray-900">
                  {review.author}
                </span>
                <BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-xs font-semibold text-gray-400">
                  Compra verificada
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
