// api/products.js
// Vercel Serverless Function — JavaScript puro, sem dependências externas.
// GET  /api/products         -> lista produtos ativos (active=true), ordenados por created_at
// GET  /api/products?all=1   -> lista TODOS os produtos (precisa do header X-API-Secret) — usado pelo Admin
// POST /api/products         -> cria ou atualiza (upsert por id). Precisa do header X-API-Secret

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const API_SECRET = process.env.API_SECRET;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Secret");
}

function supabaseHeaders(extra) {
  return Object.assign(
    {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    extra || {},
  );
}

function isAuthorized(req) {
  const provided = req.headers["x-api-secret"];
  return !!API_SECRET && provided === API_SECRET;
}

// Campos aceitos no upsert
const ALLOWED_FIELDS = [
  "id",
  "name",
  "brand",
  "price",
  "original_price",
  "discount",
  "image",
  "images",
  "description",
  "features",
  "affiliate_link",
  "badge",
  "sold_count",
  "rating",
  "gender",
  "ml_item_id",
  "reviews",
  "active",
  "in_stock",
  "free_shipping",
  "is_best_seller",
  "is_new",
  "origin",
  "stock_status",
  "frete",
];

function pickAllowedFields(body) {
  const out = {};
  for (const key of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      out[key] = body[key];
    }
  }
  return out;
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).json({ error: "Supabase não configurado no servidor" });
    return;
  }

  if (req.method === "GET") {
    try {
      const wantsAll = req.query && (req.query.all === "1" || req.query.all === "true");

      if (wantsAll && !isAuthorized(req)) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const filter = wantsAll ? "" : "&active=eq.true";
      const url = `${SUPABASE_URL}/rest/v1/products?select=*${filter}&order=created_at.desc`;

      const supaRes = await fetch(url, { headers: supabaseHeaders() });
      if (!supaRes.ok) {
        const text = await supaRes.text();
        res.status(supaRes.status).json({ error: "Erro ao buscar produtos", details: text });
        return;
      }

      const data = await supaRes.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: "Erro interno", details: String(err) });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      if (!isAuthorized(req)) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const body = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");

      if (!body.name || body.price === undefined || body.price === null) {
        res.status(400).json({ error: "Campos obrigatórios: name, price" });
        return;
      }

      const product = pickAllowedFields(body);

      if (!product.id) {
        product.id =
          (globalThis.crypto && globalThis.crypto.randomUUID && globalThis.crypto.randomUUID()) ||
          `prod_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      }

      if (product.active === undefined) product.active = true;

      const url = `${SUPABASE_URL}/rest/v1/products?on_conflict=id`;
      const supaRes = await fetch(url, {
        method: "POST",
        headers: supabaseHeaders({
          Prefer: "resolution=merge-duplicates,return=representation",
        }),
        body: JSON.stringify(product),
      });

      if (!supaRes.ok) {
        const text = await supaRes.text();
        res.status(supaRes.status).json({ error: "Erro ao salvar produto", details: text });
        return;
      }

      const data = await supaRes.json();
      res.status(200).json(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      res.status(500).json({ error: "Erro interno", details: String(err) });
    }
    return;
  }

  res.setHeader("Allow", "GET, POST, OPTIONS");
  res.status(405).json({ error: "Método não permitido" });
};
