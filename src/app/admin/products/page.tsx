"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const ADMIN_KEY_STORAGE = "vaporAuraAdminKey";

const categories = [
    "Vape",
    "Glass",
    "Kratom",
    "CBD",
    "Hookah",
    "Vaporizer",
] as const;

type Category = (typeof categories)[number];

interface ProductRecord {
    _id: string;
    name: string;
    slug: string;
    category: Category;
    description: string;
    image: string;
    price: number;
    inStock: boolean;
    isActive: boolean;
    sortOrder: number;
}

interface ProductFormState {
    name: string;
    slug: string;
    category: Category;
    description: string;
    image: string;
    price: string;
    inStock: boolean;
    isActive: boolean;
    sortOrder: string;
}

const initialFormState: ProductFormState = {
    name: "",
    slug: "",
    category: "Vape",
    description: "",
    image: "/icons/display/vapes.png",
    price: "0",
    inStock: true,
    isActive: true,
    sortOrder: "0",
};

function toSlug(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function productToForm(product: ProductRecord): ProductFormState {
    return {
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        image: product.image,
        price: String(product.price),
        inStock: product.inStock,
        isActive: product.isActive,
        sortOrder: String(product.sortOrder),
    };
}

function formToPayload(form: ProductFormState) {
    return {
        name: form.name.trim(),
        slug: toSlug(form.slug || form.name),
        category: form.category,
        description: form.description.trim(),
        image: form.image.trim(),
        price: Number(form.price),
        inStock: form.inStock,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
    };
}

export default function AdminProductsPage() {
    const [adminKey, setAdminKey] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [products, setProducts] = useState<ProductRecord[]>([]);
    const [form, setForm] = useState<ProductFormState>(initialFormState);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [message, setMessage] = useState<string>("");

    const hasKey = useMemo(() => adminKey.length > 0, [adminKey]);

    useEffect(() => {
        const storedKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
        if (storedKey) {
            setKeyInput(storedKey);
            void storeKey(storedKey);
        }
    }, []);

    useEffect(() => {
        if (hasKey) {
            void loadProducts();
        } else {
            setProducts([]);
        }
    }, [hasKey]);

    async function loadProducts() {
        setIsLoading(true);
        setMessage("");
        try {
                const response = await fetch("/api/products?limit=50&includeInactive=true", {
                    cache: "no-store",
                    headers: {
                        "x-admin-key": adminKey,
                    },
                });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                setMessage(payload.message ?? "Failed to load products.");
                return;
            }
            setProducts(payload.data ?? []);
        } catch {
            setMessage("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }

    async function verifyAdminKey(key: string) {
        const response = await fetch("/api/products?limit=1&includeInactive=true", {
            cache: "no-store",
            headers: {
                "x-admin-key": key,
            },
        });

        return response.ok;
    }

    async function storeKey(override?: string) {
        const trimmed = (override ?? keyInput).trim();
        if (!trimmed) {
            setMessage("Enter admin key to continue.");
            return;
        }

        setIsUnlocking(true);
        setMessage("");

        try {
            const valid = await verifyAdminKey(trimmed);
            if (!valid) {
                window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
                setAdminKey("");
                setMessage("Invalid admin key.");
                return;
            }

            window.sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed);
            setAdminKey(trimmed);
            setMessage("Admin access granted.");
        } catch {
            setMessage("Unable to validate admin key right now.");
        } finally {
            setIsUnlocking(false);
        }
    }

    function clearKey() {
        window.sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey("");
        setKeyInput("");
        setEditingSlug(null);
        setForm(initialFormState);
        setMessage("");
    }

    function updateField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function startCreate() {
        setEditingSlug(null);
        setForm(initialFormState);
        setMessage("");
    }

    function startEdit(product: ProductRecord) {
        setEditingSlug(product.slug);
        setForm(productToForm(product));
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!adminKey) {
            setMessage("Admin key is required.");
            return;
        }

        setIsSaving(true);
        setMessage("");
        try {
            const payload = formToPayload(form);
            const isEditing = Boolean(editingSlug);
            const endpoint = isEditing ? `/api/products/${encodeURIComponent(editingSlug ?? "")}` : "/api/products";
            const method = isEditing ? "PATCH" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-key": adminKey,
                },
                body: JSON.stringify(payload),
            });
            const body = await response.json();

            if (!response.ok || !body.success) {
                setMessage(body.message ?? "Failed to save product.");
                return;
            }

            setMessage(isEditing ? "Product updated successfully." : "Product created successfully.");
            setEditingSlug(null);
            setForm(initialFormState);
            await loadProducts();
        } catch {
            setMessage("Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteProduct(slug: string) {
        if (!adminKey) {
            setMessage("Admin key is required.");
            return;
        }

        const confirmed = window.confirm("Delete this product?");
        if (!confirmed) {
            return;
        }

        setIsDeleting(slug);
        setMessage("");
        try {
            const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
                method: "DELETE",
                headers: {
                    "x-admin-key": adminKey,
                },
            });
            const body = await response.json();
            if (!response.ok || !body.success) {
                setMessage(body.message ?? "Failed to delete product.");
                return;
            }
            if (editingSlug === slug) {
                setEditingSlug(null);
                setForm(initialFormState);
            }
            setMessage("Product deleted.");
            await loadProducts();
        } catch {
            setMessage("Failed to delete product.");
        } finally {
            setIsDeleting(null);
        }
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin · Products</h1>
                <p className={styles.subtitle}>Create, update, and delete product catalog entries.</p>
            </header>

            <Card className={styles.keyCard}>
                <div className={styles.keyRow}>
                    <input
                        type="password"
                        value={keyInput}
                        onChange={(event) => setKeyInput(event.target.value)}
                        className={styles.input}
                        placeholder="Enter ADMIN_API_KEY"
                        autoComplete="off"
                    />
                    <Button onClick={() => void storeKey()} type="button" size="md" disabled={isUnlocking}>
                        {isUnlocking ? "Checking..." : "Unlock"}
                    </Button>
                    <Button onClick={clearKey} type="button" variant="outline" size="md">
                        Clear
                    </Button>
                </div>
                <p className={styles.helpText}>
                    This page stores the key in your browser session only.
                </p>
            </Card>

            {!hasKey ? (
                <Card className={styles.noticeCard}>
                    <p className={styles.noticeText}>Add admin key above to manage products.</p>
                </Card>
            ) : (
                <>
                    <section className={styles.contentGrid}>
                        <Card className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <h2>{editingSlug ? "Edit Product" : "Add Product"}</h2>
                                {editingSlug ? (
                                    <Button type="button" variant="outline" size="sm" onClick={startCreate}>
                                        New
                                    </Button>
                                ) : null}
                            </div>

                            <form className={styles.form} onSubmit={submitForm}>
                                <label className={styles.label}>
                                    Name
                                    <input
                                        className={styles.input}
                                        value={form.name}
                                        onChange={(event) => updateField("name", event.target.value)}
                                        required
                                        maxLength={120}
                                    />
                                </label>

                                <label className={styles.label}>
                                    Slug
                                    <input
                                        className={styles.input}
                                        value={form.slug}
                                        onChange={(event) => updateField("slug", event.target.value)}
                                        required
                                        maxLength={140}
                                    />
                                </label>

                                <label className={styles.label}>
                                    Category
                                    <select
                                        className={styles.select}
                                        value={form.category}
                                        onChange={(event) => updateField("category", event.target.value as Category)}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className={styles.label}>
                                    Description
                                    <textarea
                                        className={styles.textarea}
                                        value={form.description}
                                        onChange={(event) => updateField("description", event.target.value)}
                                        required
                                        maxLength={1200}
                                    />
                                </label>

                                <label className={styles.label}>
                                    Image Path
                                    <input
                                        className={styles.input}
                                        value={form.image}
                                        onChange={(event) => updateField("image", event.target.value)}
                                        required
                                        maxLength={300}
                                    />
                                </label>

                                <div className={styles.inlineFields}>
                                    <label className={styles.label}>
                                        Price
                                        <input
                                            className={styles.input}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.price}
                                            onChange={(event) => updateField("price", event.target.value)}
                                            required
                                        />
                                    </label>

                                    <label className={styles.label}>
                                        Sort Order
                                        <input
                                            className={styles.input}
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={form.sortOrder}
                                            onChange={(event) => updateField("sortOrder", event.target.value)}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className={styles.checkboxRow}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={form.inStock}
                                            onChange={(event) => updateField("inStock", event.target.checked)}
                                        />
                                        In Stock
                                    </label>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(event) => updateField("isActive", event.target.checked)}
                                        />
                                        Active
                                    </label>
                                </div>

                                <Button type="submit" disabled={isSaving} size="lg">
                                    {isSaving ? "Saving..." : editingSlug ? "Update Product" : "Create Product"}
                                </Button>
                            </form>
                        </Card>

                        <Card className={styles.listCard}>
                            <div className={styles.listHeader}>
                                <h2>Catalog ({products.length})</h2>
                                <Button type="button" variant="outline" size="sm" onClick={() => void loadProducts()} disabled={isLoading}>
                                    {isLoading ? "Refreshing..." : "Refresh"}
                                </Button>
                            </div>

                            <div className={styles.productList}>
                                {products.map((product) => (
                                    <div key={product._id} className={styles.productRow}>
                                        <div className={styles.productMeta}>
                                            <p className={styles.productName}>{product.name}</p>
                                            <p className={styles.productSubline}>
                                                {product.category} · ${product.price.toFixed(2)} · {product.slug}
                                            </p>
                                        </div>
                                        <div className={styles.productActions}>
                                            <Button type="button" variant="outline" size="sm" onClick={() => startEdit(product)}>
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => void deleteProduct(product.slug)}
                                                disabled={isDeleting === product.slug}
                                            >
                                                {isDeleting === product.slug ? "Deleting..." : "Delete"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {!products.length && !isLoading ? (
                                    <p className={styles.emptyText}>No products found. Seed products or create a new item.</p>
                                ) : null}
                            </div>
                        </Card>
                    </section>
                </>
            )}

            {message ? <p className={styles.message}>{message}</p> : null}
        </main>
    );
}
