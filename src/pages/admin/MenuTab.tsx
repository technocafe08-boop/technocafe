import { useState } from "react";
import { Plus, X, Trash2, Pencil } from "lucide-react";
import { useMenuCategories, useMenuItems, useMenuSubCategories } from "../../hooks/useMenu";
import { menuCategoriesStore, menuItemsStore, menuSubCategoriesStore } from "../../lib/menuStore";
import MagneticButton from "../../components/MagneticButton";
import SyncWarning from "../../components/admin/SyncWarning";

export default function MenuTab() {
  const categories = useMenuCategories();
  const subCategories = useMenuSubCategories();
  const items = useMenuItems();
  const syncState = {
    configured:
      menuCategoriesStore.getSyncState().configured &&
      menuSubCategoriesStore.getSyncState().configured &&
      menuItemsStore.getSyncState().configured,
    remoteHealthy:
      menuCategoriesStore.getSyncState().remoteHealthy &&
      menuSubCategoriesStore.getSyncState().remoteHealthy &&
      menuItemsStore.getSyncState().remoteHealthy,
    lastSyncError:
      menuItemsStore.getSyncState().lastSyncError ||
      menuCategoriesStore.getSyncState().lastSyncError ||
      menuSubCategoriesStore.getSyncState().lastSyncError,
  };

  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("🍽️");

  const [subName, setSubName] = useState("");
  const [subParent, setSubParent] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemSub, setItemSub] = useState("");
  const [error, setError] = useState("");

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) return;
    setError("");
    try {
      await menuCategoriesStore.add({ name: catName.trim(), emoji: catEmoji.trim() || "🍽️" });
      setCatName("");
      setCatEmoji("🍽️");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category.");
    }
  }

  async function handleDeleteCategory(id: string) {
    const inUse = items.some((it) => it.categoryId === id);
    if (inUse && !confirm("Some menu items use this category. Delete anyway? Those items will be hidden until reassigned.")) {
      return;
    }
    setError("");
    try {
      await menuCategoriesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    }
  }

  async function handleAddSub(e: React.FormEvent) {
    e.preventDefault();
    if (!subName.trim() || !subParent) return;
    setError("");
    try {
      await menuSubCategoriesStore.add({ name: subName.trim(), categoryId: subParent });
      setSubName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add sub-category.");
    }
  }

  async function handleDeleteSub(id: string) {
    const inUse = items.some((it) => it.subCategoryId === id);
    if (inUse && !confirm("Some items use this sub-category. Delete anyway?")) return;
    setError("");
    try {
      await menuSubCategoriesStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sub-category.");
    }
  }

  function resetItemForm() {
    setEditingItemId(null);
    setItemName("");
    setItemPrice("");
    setItemCategory("");
    setItemSub("");
    setError("");
  }

  function startEditItem(item: { id: string; name: string; price: number; categoryId: string; subCategoryId?: string }) {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(String(item.price));
    setItemCategory(item.categoryId);
    setItemSub(item.subCategoryId || "");
    setError("");
  }

  async function handleSubmitItem(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(itemPrice);
    if (!itemName.trim() || !itemCategory) {
      setError("Item name and category are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    setError("");
    const payload = {
      name: itemName.trim(),
      price,
      categoryId: itemCategory,
      subCategoryId: itemSub || undefined,
    };
    try {
      if (editingItemId) {
        await menuItemsStore.update(editingItemId, payload);
      } else {
        await menuItemsStore.add(payload);
      }
      resetItemForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save menu item.");
    }
  }

  async function handleDeleteItem(id: string) {
    setError("");
    try {
      if (editingItemId === id) resetItemForm();
      await menuItemsStore.remove(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete menu item.");
    }
  }

  const subsForItemCategory = subCategories.filter((s) => s.categoryId === itemCategory);

  return (
    <div>
      <SyncWarning state={syncState} label="MENU" />
      <h2 className="font-heading text-lg font-bold text-white/80 mb-4">FOOD MENU</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <section className="glass rounded-2xl p-5 md:p-6">
          <h3 className="font-heading text-sm font-bold mb-4 text-cyan tracking-wide">CATEGORIES</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 pl-3 pr-1.5 py-1 text-xs"
              >
                {c.emoji} {c.name}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id)}
                  aria-label={`Delete ${c.name}`}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink/20 hover:text-pink"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              value={catEmoji}
              onChange={(e) => setCatEmoji(e.target.value)}
              placeholder="🍽️"
              className="w-14 shrink-0 rounded-lg bg-white/5 border border-white/15 px-2 py-2 text-sm text-center placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
            <input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Momos"
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-cyan/20 border border-cyan/40 px-3 text-cyan hover:bg-cyan/30"
              aria-label="Add category"
            >
              <Plus size={16} />
            </button>
          </form>
        </section>

        {/* Sub-categories */}
        <section className="glass rounded-2xl p-5 md:p-6">
          <h3 className="font-heading text-sm font-bold mb-4 text-cyan tracking-wide">SUB-CATEGORIES</h3>
          <p className="text-white/40 text-xs mb-3">
            Optional — group items within a category (e.g. "Veg" / "Non-Veg" inside Maggi).
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {subCategories.map((s) => {
              const parent = categories.find((c) => c.id === s.categoryId);
              return (
                <span
                  key={s.id}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 pl-3 pr-1.5 py-1 text-xs"
                >
                  {s.name}
                  {parent && <span className="text-white/30">· {parent.name}</span>}
                <button
                  type="button"
                  onClick={() => handleDeleteSub(s.id)}
                  aria-label={`Delete ${s.name}`}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink/20 hover:text-pink"
                >
                    <X size={11} />
                  </button>
                </span>
              );
            })}
            {subCategories.length === 0 && <p className="text-white/40 text-xs">None yet.</p>}
          </div>
          <form onSubmit={handleAddSub} className="flex flex-col xs:flex-row gap-2">
            <select
              value={subParent}
              onChange={(e) => setSubParent(e.target.value)}
              className="rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
            >
              <option value="" className="bg-bg">Category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-bg">
                  {c.name}
                </option>
              ))}
            </select>
            <input
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="e.g. Veg"
              className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              disabled={!subParent}
              className="shrink-0 rounded-lg bg-cyan/20 border border-cyan/40 px-3 text-cyan hover:bg-cyan/30 disabled:opacity-40"
              aria-label="Add sub-category"
            >
              <Plus size={16} />
            </button>
          </form>
        </section>
      </div>

      {/* Item form */}
      <form onSubmit={handleSubmitItem} className="mt-6 glass rgb-border rounded-2xl p-6 md:p-8">
        <h3 className="font-heading text-base font-bold mb-5 text-cyan">
          {editingItemId ? "EDIT ITEM" : "ADD MENU ITEM"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Item name
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Cheese Maggi"
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Price (₹)
            <input
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="e.g. 80"
              inputMode="numeric"
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Category
            <select
              value={itemCategory}
              onChange={(e) => {
                setItemCategory(e.target.value);
                setItemSub("");
              }}
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan"
            >
              <option value="" className="bg-bg">Choose…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-bg">
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Sub-category (optional)
            <select
              value={itemSub}
              onChange={(e) => setItemSub(e.target.value)}
              disabled={subsForItemCategory.length === 0}
              className="rounded-lg bg-white/5 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan disabled:opacity-40"
            >
              <option value="" className="bg-bg">None</option>
              {subsForItemCategory.map((s) => (
                <option key={s.id} value={s.id} className="bg-bg">
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="mt-4 text-pink text-sm">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <MagneticButton
            type="submit"
            className="flex items-center gap-2 font-heading tracking-[0.1em] text-sm font-bold px-6 py-3 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan min-h-[44px]"
          >
            <Plus size={16} />
            {editingItemId ? "SAVE CHANGES" : "ADD ITEM"}
          </MagneticButton>
          {editingItemId && (
            <button type="button" onClick={resetItemForm} className="text-white/50 hover:text-white text-sm px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items list, grouped by category */}
      <div className="mt-8 space-y-6">
        {categories.map((c) => {
          const catItems = items.filter((it) => it.categoryId === c.id);
          if (catItems.length === 0) return null;
          return (
            <div key={c.id}>
              <h3 className="font-heading text-sm font-bold mb-3 text-white/60">
                {c.emoji} {c.name.toUpperCase()} ({catItems.length})
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 glass rounded-xl p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-white/50 text-xs">
                        ₹{item.price}
                        {item.subCategoryId && (
                          <> · {subCategories.find((s) => s.id === item.subCategoryId)?.name}</>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditItem(item)}
                      aria-label={`Edit ${item.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full glass text-white/70 hover:text-cyan shrink-0"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full glass text-white/70 hover:text-pink shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-white/40 text-sm text-center py-6">No menu items yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
