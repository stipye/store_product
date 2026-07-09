// api/products/[id].js
// Vercel Serverless Function — JavaScript puro, sem dependências externas.
// GET    /api/products/:id -> retorna produto por id
// PATCH  /api/products/:id -> atualiza campos parcialmente (precisa do header X-API-Secret)
// DELETE /api/products/:id -> deleta produto (precisa do header X-API-Secret)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const API_SECRET = process.env.API_SECRET;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
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

const ALLOWED_FIELDS = [
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
  "marketplace",
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

  const { id } = req.query || {};
  if (!id) {
    res.status(400).json({ error: "ID do produto é obrigatório" });
    return;
  }

  if (req.method === "GET") {
    try {
      const url = `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`;
      const supaRes = await fetch(url, { headers: supabaseHeaders() });

      if (!supaRes.ok) {
        const text = await supaRes.text();
        res.status(supaRes.status).json({ error: "Erro ao buscar produto", details: text });
        return;
      }

      const data = await supaRes.json();
      if (!Array.isArray(data) || data.length === 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.status(200).json(data[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro interno", details: String(err) });
    }
    return;
  }

  if (req.method === "PATCH") {
    try {
      if (!isAuthorized(req)) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const body = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
      const updates = pickAllowedFields(body);

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "Nenhum campo válido para atualizar" });
        return;
      }

      const url = `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`;
      const supaRes = await fetch(url, {
        method: "PATCH",
        headers: supabaseHeaders({ Prefer: "return=representation" }),
        body: JSON.stringify(updates),
      });

      if (!supaRes.ok) {
        const text = await supaRes.text();
        res.status(supaRes.status).json({ error: "Erro ao atualizar produto", details: text });
        return;
      }

      const data = await supaRes.json();
      if (!Array.isArray(data) || data.length === 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.status(200).json(data[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro interno", details: String(err) });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      if (!isAuthorized(req)) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const url = `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}`;
      const supaRes = await fetch(url, {
        method: "DELETE",
        headers: supabaseHeaders({ Prefer: "return=representation" }),
      });

      if (!supaRes.ok) {
        const text = await supaRes.text();
        res.status(supaRes.status).json({ error: "Erro ao deletar produto", details: text });
        return;
      }

      const data = await supaRes.json();
      if (!Array.isArray(data) || data.length === 0) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.status(200).json({ success: true, deleted: data[0] });
    } catch (err) {
      res.status(500).json({ error: "Erro interno", details: String(err) });
    }
    return;
  }

  res.setHeader("Allow", "GET, PATCH, DELETE, OPTIONS");
  res.status(405).json({ error: "Método não permitido" });
};
