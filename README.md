# PromoPump — Sua loja de afiliados profissional

Template completo de loja de afiliados de produtos para academia, com ofertas do Mercado Livre e da Amazon. Começa sem produtos —
eles são adicionados via API (painel `/admin` ou a extensão PromoPump).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4 (`@import "tailwindcss"`, sem `tailwind.config.js`)
- wouter (roteamento)
- lucide-react (ícones)
- Funções serverless da Vercel em JavaScript puro (`/api`), usando `fetch()`
  para falar com a REST API do Supabase

## Rodando localmente

```bash
npm install
npm run dev
```

Isso sobe o frontend em `http://localhost:3000`. As funções em `/api`
precisam de um provedor de functions — rode `vercel dev` para servir tudo
(frontend + API) em um único processo, ou ajuste `VITE_API_PROXY_TARGET`
em `client/vite.config.ts` para apontar para onde as functions estiverem
rodando.

## Configuração (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Rode o SQL de `supabase-schema.sql` no editor SQL do projeto para criar
   a tabela `products`.
3. Copie `.env.example` para `.env` e preencha:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `API_SECRET` — chave que você vai usar para logar no `/admin` e para
     autenticar a extensão PromoPump (enviada no header `X-API-Secret`).

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `API_SECRET`) no painel do projeto.
4. Deploy — o `vercel.json` já está configurado com o `buildCommand`,
   `outputDirectory` e o rewrite de SPA (sem afetar `/api`).

## Painel Admin

Acesse `/admin` e informe a chave definida em `API_SECRET`. A chave fica
salva no `localStorage` do navegador. No painel você pode:

- Ver estatísticas (total, visíveis, ocultos)
- Buscar produtos por nome
- Adicionar/editar produtos com gerenciador de imagens (definir principal,
  reordenar, remover, adicionar por URL)
- Ocultar/exibir produtos na loja
- Excluir produtos (com confirmação)

## API

| Rota | Método | Descrição | Autenticação |
|---|---|---|---|
| `/api/products` | GET | Lista produtos ativos | Pública |
| `/api/products?all=1` | GET | Lista todos os produtos (usado pelo Admin) | `X-API-Secret` |
| `/api/products` | POST | Cria ou atualiza (upsert por `id`) | `X-API-Secret` |
| `/api/products/:id` | GET | Retorna um produto | Pública |
| `/api/products/:id` | PATCH | Atualiza campos parciais | `X-API-Secret` |
| `/api/products/:id` | DELETE | Remove um produto | `X-API-Secret` |

## Estrutura de pastas

```
client/
  src/
    App.tsx
    main.tsx
    index.css
    types.ts
    components/
      Header.tsx
      Footer.tsx
      HeroSection.tsx
      ProductsSection.tsx
      ProductCard.tsx
      ReviewsSection.tsx
      FloatingChat.tsx
    pages/
      Home.tsx
      ProductPage.tsx
      Admin.tsx
  index.html
  vite.config.ts
api/
  products.js
  products/[id].js
package.json
vercel.json
supabase-schema.sql
```
