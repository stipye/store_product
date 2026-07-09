import { useEffect, useMemo, useState } from "react";
import {
  Dumbbell,
  LogOut,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { API_URL, type Product } from "../types";

const STORAGE_KEY = "afiml_admin_secret";

function formatPrice(value?: number) {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface Toast {
  type: "success" | "error";
  message: string;
}

const emptyProduct = (): Product => ({
  id: "",
  name: "",
  brand: "",
  price: 0,
  original_price: undefined,
  discount: undefined,
  image: "",
  images: [],
  description: "",
  features: [],
  affiliate_link: "",
  badge: "",
  sold_count: "",
  rating: 5,
  gender: "unissex",
  marketplace: "mercado_livre",
  ml_item_id: "",
  reviews: [],
  active: true,
  in_stock: true,
  free_shipping: false,
  is_best_seller: false,
  is_new: false,
  origin: "brasil",
  stock_status: "",
  frete: "",
});

export default function Admin() {
  const [secret, setSecret] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [toast, setToast] = useState<Toast | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSecret(saved);
  }, []);

  useEffect(() => {
    if (secret) fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products?all=1`, {
        headers: secret ? { "X-API-Secret": secret } : {},
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      // Fallback: try the public endpoint (active only) so admin still shows something
      try {
        const res2 = await fetch(`${API_URL}/api/products`);
        const data2 = await res2.json();
        setProducts(Array.isArray(data2) ? data2 : []);
      } catch {
        setToast({ type: "error", message: "Erro ao carregar produtos" });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogin() {
    if (!secretInput.trim()) {
      setAuthError("Digite a chave secreta");
      return;
    }
    localStorage.setItem(STORAGE_KEY, secretInput.trim());
    setSecret(secretInput.trim());
    setAuthError("");
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setSecret(null);
    setProducts([]);
  }

  function openCreateModal() {
    setEditing(emptyProduct());
    setNewImageUrl("");
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditing({ ...product, images: product.images ? [...product.images] : [] });
    setNewImageUrl("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSave() {
    if (!editing || !secret) return;
    if (!editing.name.trim() || !editing.price) {
      setToast({ type: "error", message: "Preencha nome e preço" });
      return;
    }

    const payload: Product = {
      ...editing,
      id: editing.id || crypto.randomUUID(),
      image: editing.images && editing.images.length > 0 ? editing.images[0] : editing.image,
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Secret": secret,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setToast({ type: "success", message: "Produto salvo com sucesso" });
      closeModal();
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Erro ao salvar produto" });
    }
  }

  async function handleDelete(product: Product) {
    if (!secret) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "DELETE",
        headers: { "X-API-Secret": secret },
      });
      if (!res.ok) throw new Error();
      setToast({ type: "success", message: "Produto removido" });
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      setToast({ type: "error", message: "Erro ao remover produto" });
    } finally {
      setDeleteTarget(null);
    }
  }

  async function toggleVisibility(product: Product) {
    if (!secret) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Secret": secret,
        },
        body: JSON.stringify({ active: !product.active }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)),
      );
      setToast({ type: "success", message: "Visibilidade atualizada" });
    } catch {
      setToast({ type: "error", message: "Erro ao atualizar visibilidade" });
    }
  }

  function addImage() {
    if (!newImageUrl.trim() || !editing) return;
    setEditing({ ...editing, images: [...(editing.images ?? []), newImageUrl.trim()] });
    setNewImageUrl("");
  }

  function removeImage(idx: number) {
    if (!editing) return;
    const imgs = [...(editing.images ?? [])];
    imgs.splice(idx, 1);
    setEditing({ ...editing, images: imgs });
  }

  function setMainImage(idx: number) {
    if (!editing) return;
    const imgs = [...(editing.images ?? [])];
    const [chosen] = imgs.splice(idx, 1);
    imgs.unshift(chosen);
    setEditing({ ...editing, images: imgs });
  }

  function moveImage(idx: number, dir: -1 | 1) {
    if (!editing) return;
    const imgs = [...(editing.images ?? [])];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= imgs.length) return;
    [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
    setEditing({ ...editing, images: imgs });
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const visible = products.filter((p) => p.active !== false).length;
    const hidden = total - visible;
    return { total, visible, hidden };
  }, [products]);

  // ---- LOGIN SCREEN ----
  if (!secret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl btn-primary-gradient text-white">
              <Dumbbell className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h1 className="text-xl font-black text-gray-900">Painel PromoPump</h1>
            <p className="text-sm font-semibold text-gray-500">
              Digite a chave secreta para continuar
            </p>
          </div>

          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Chave secreta"
            className="w-full rounded-full border-2 border-gray-200 px-5 py-3 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
          />

          {authError && (
            <p className="mt-2 text-xs font-bold text-red-500">{authError}</p>
          )}

          <button
            onClick={handleLogin}
            className="mt-4 w-full rounded-full btn-primary-gradient px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ---- ADMIN DASHBOARD ----
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl btn-primary-gradient text-white">
              <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-black text-gray-900">
              Admin <span className="text-[var(--color-primary)]">PromoPump</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:border-red-300 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-bold uppercase text-gray-400">Total</p>
            <p className="mt-1 text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-bold uppercase text-gray-400">Na loja</p>
            <p className="mt-1 text-3xl font-black text-emerald-600">{stats.visible}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-bold uppercase text-gray-400">Ocultos</p>
            <p className="mt-1 text-3xl font-black text-gray-400">{stats.hidden}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full rounded-full border-2 border-gray-200 py-2.5 pl-10 pr-4 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-full btn-primary-gradient px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200"
          >
            <Plus className="h-4 w-4" />
            Adicionar produto
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-black uppercase text-gray-400">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Badges</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-semibold text-gray-400">
                    Carregando produtos...
                  </td>
                </tr>
              )}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-semibold text-gray-400">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts.map((product) => {
                  const imgCount = product.images?.length ?? (product.image ? 1 : 0);
                  const hasDiscount =
                    !!product.original_price && product.original_price > product.price;
                  return (
                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-300" />
                              </div>
                            )}
                            {imgCount > 1 && (
                              <span className="absolute bottom-0 right-0 rounded-tl-md bg-gray-900/80 px-1 text-[9px] font-black text-white">
                                {imgCount}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-gray-900">{product.name}</p>
                            <p className="text-xs font-semibold text-gray-400">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-black text-gray-900">{formatPrice(product.price)}</p>
                        {hasDiscount && (
                          <p className="text-xs font-semibold text-gray-400 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.marketplace === "mercado_livre" && (
                            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-yellow-950">
                              ML
                            </span>
                          )}
                          {product.marketplace === "amazon" && (
                            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-black text-white">
                              AMZ
                            </span>
                          )}
                          {product.gender === "feminino" && (
                            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                              ♀
                            </span>
                          )}
                          {product.gender === "masculino" && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              ♂
                            </span>
                          )}
                          {product.free_shipping && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                              Frete
                            </span>
                          )}
                          {product.is_new && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Novo
                            </span>
                          )}
                          {product.is_best_seller && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                              Top
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVisibility(product)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            product.active !== false
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.active !== false ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}
                          {product.active !== false ? "Visível" : "Oculto"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/produto/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            title="Ver produto"
                          >
                            <Star className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500"
                            title="Deletar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-base font-black text-gray-900">Excluir produto?</h3>
            </div>
            <p className="text-sm font-semibold text-gray-500">
              Tem certeza que deseja excluir "{deleteTarget.name}"? Essa ação não pode
              ser desfeita.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-bold text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-black text-gray-900">
                {editing.id && products.some((p) => p.id === editing.id)
                  ? "Editar produto"
                  : "Novo produto"}
              </h3>
              <button onClick={closeModal} aria-label="Fechar">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
              {/* Image manager */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                  Imagens
                </label>
                <div className="flex flex-wrap gap-3">
                  {(editing.images ?? []).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-yellow-400 px-1 text-[9px] font-black text-white">
                          Principal
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/50 py-0.5">
                        <button
                          onClick={() => setMainImage(idx)}
                          title="Definir como principal"
                          className="text-white hover:text-yellow-300"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveImage(idx, -1)}
                          title="Mover para esquerda"
                          className="text-white hover:text-orange-300"
                        >
                          <ArrowUp className="h-3 w-3 -rotate-90" />
                        </button>
                        <button
                          onClick={() => moveImage(idx, 1)}
                          title="Mover para direita"
                          className="text-white hover:text-orange-300"
                        >
                          <ArrowDown className="h-3 w-3 -rotate-90" />
                        </button>
                        <button
                          onClick={() => removeImage(idx)}
                          title="Remover"
                          className="text-white hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL da imagem"
                    className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                  <button
                    onClick={addImage}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Nome
                  </label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Marca
                  </label>
                  <input
                    value={editing.brand}
                    onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Preço
                  </label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Preço original
                  </label>
                  <input
                    type="number"
                    value={editing.original_price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        original_price: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    value={editing.discount ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        discount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Badge
                  </label>
                  <input
                    value={editing.badge ?? ""}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Link afiliado
                  </label>
                  <input
                    value={editing.affiliate_link ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, affiliate_link: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Marketplace
                  </label>
                  <select
                    value={editing.marketplace ?? "mercado_livre"}
                    onChange={(e) =>
                      setEditing({ ...editing, marketplace: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    <option value="mercado_livre">Mercado Livre</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Gênero
                  </label>
                  <select
                    value={editing.gender ?? "unissex"}
                    onChange={(e) => setEditing({ ...editing, gender: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="unissex">Unissex</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                    Origem
                  </label>
                  <select
                    value={editing.origin ?? "brasil"}
                    onChange={(e) => setEditing({ ...editing, origin: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    <option value="brasil">Brasil</option>
                    <option value="internacional">Internacional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={!!editing.free_shipping}
                    onChange={(e) =>
                      setEditing({ ...editing, free_shipping: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-[var(--color-primary)]"
                  />
                  Frete grátis
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={!!editing.is_best_seller}
                    onChange={(e) =>
                      setEditing({ ...editing, is_best_seller: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-[var(--color-primary)]"
                  />
                  Mais vendido
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={!!editing.is_new}
                    onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })}
                    className="h-4 w-4 rounded accent-[var(--color-primary)]"
                  />
                  Novidade
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={editing.in_stock !== false}
                    onChange={(e) =>
                      setEditing({ ...editing, in_stock: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-[var(--color-primary)]"
                  />
                  Em estoque
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-black uppercase text-gray-400">
                  Descrição
                </label>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-semibold focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <label className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-bold text-gray-700">
                  Visível na loja
                </span>
                <input
                  type="checkbox"
                  checked={editing.active !== false}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-5 w-5 rounded accent-[var(--color-primary)]"
                />
              </label>
            </div>

            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={closeModal}
                className="flex-1 rounded-full border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-full btn-primary-gradient px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
