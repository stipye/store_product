-- Execute este SQL no editor SQL do Supabase para criar a tabela "products".

-- Se você já rodou este script antes (era a versão AfiliML/perfumes) e só
-- precisa adicionar a coluna nova do rebranding PromoPump, rode apenas:
-- alter table public.products add column if not exists marketplace text;
-- alter table public.products add column if not exists coupon_code text;
-- alter table public.products add column if not exists coupon_discount text;

create table if not exists public.products (
  id text primary key,
  name text not null,
  brand text,
  price numeric not null,
  original_price numeric,
  discount numeric,
  image text,
  images jsonb default '[]'::jsonb,
  description text,
  features jsonb default '[]'::jsonb,
  affiliate_link text,
  badge text,
  sold_count text,
  rating numeric,
  gender text,
  marketplace text,
  ml_item_id text,
  reviews jsonb default '[]'::jsonb,
  active boolean default true,
  in_stock boolean default true,
  free_shipping boolean default false,
  is_best_seller boolean default false,
  is_new boolean default false,
  origin text,
  stock_status text,
  frete text,
  coupon_code text,
  coupon_discount text,
  created_at timestamptz default now()
);

-- Habilita RLS. As chamadas passam pela API serverless usando a anon key,
-- então mantemos leitura pública e liberamos escrita para a anon key
-- (a proteção real de escrita é feita pelo header X-API-Secret na função).
alter table public.products enable row level security;

create policy "Public read access" on public.products
  for select using (true);

create policy "Public write access via API" on public.products
  for insert with check (true);

create policy "Public update access via API" on public.products
  for update using (true);

create policy "Public delete access via API" on public.products
  for delete using (true);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_active_idx on public.products (active);
create index if not exists products_marketplace_idx on public.products (marketplace);
