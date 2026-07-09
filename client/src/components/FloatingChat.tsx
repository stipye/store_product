import { useState } from "react";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

const FAQS = [
  {
    question: "Como funciona a compra?",
    answer:
      "Você escolhe o produto aqui, clica em 'Comprar' e é redirecionado direto para o Mercado Livre ou a Amazon (dependendo do produto), onde finaliza a compra com toda a segurança da plataforma.",
  },
  {
    question: "O frete é grátis?",
    answer:
      "Produtos com o selo ✈️ Frete Grátis têm frete grátis para todo o Brasil em compras qualificadas pelo Mercado Livre ou pela Amazon.",
  },
  {
    question: "Os produtos são originais?",
    answer:
      "Sim! Trabalhamos apenas com vendedores confiáveis e produtos originais, com nota fiscal e garantia do Mercado Livre e da Amazon.",
  },
  {
    question: "Quanto tempo demora a entrega?",
    answer:
      "O prazo depende do vendedor e da sua localização, mas a maioria dos produtos com FULL ou Prime chega em 2 a 5 dias úteis.",
  },
  {
    question: "Posso trocar ou devolver?",
    answer:
      "Sim, todas as compras seguem a política de trocas e devoluções da própria plataforma onde foram feitas, com prazo de até 30 dias.",
  },
];

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Olá! 👋 Sou o assistente da PromoPump. Escolha uma pergunta abaixo ou digite a sua dúvida.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleFaqClick = (question: string, answer: string) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "bot", text: answer },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      {
        from: "bot",
        text: "Obrigado pela mensagem! Nosso time vai te responder em breve. Enquanto isso, veja as perguntas frequentes acima. 😊",
      },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center justify-between btn-primary-gradient px-4 py-3.5 text-white">
            <div>
              <p className="text-sm font-black">Fale com a PromoPump</p>
              <p className="text-xs font-semibold text-orange-100">
                Normalmente responde em minutos
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fechar chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${
                  m.from === "bot"
                    ? "bg-gray-100 text-gray-700"
                    : "ml-auto bg-[var(--color-primary)] text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            <div className="space-y-1.5 pt-2">
              {FAQS.map((faq) => (
                <button
                  key={faq.question}
                  onClick={() => handleFaqClick(faq.question, faq.answer)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 px-3 py-2 text-left text-xs font-bold text-gray-600 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {faq.question}
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-primary-gradient text-white"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full btn-primary-gradient text-white shadow-xl shadow-orange-300 transition hover:scale-105 active:scale-95"
        aria-label="Abrir chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
