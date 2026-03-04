import { PRODUCT_CATEGORIES } from "@/models/Product";

export interface ProductInput {
    name: string;
    slug: string;
    category: (typeof PRODUCT_CATEGORIES)[number];
    description: string;
    image: string;
    price: number;
    inStock: boolean;
    isActive: boolean;
    sortOrder: number;
}

export interface ProductsQuery {
    limit: number;
    page: number;
    skip: number;
    category?: ProductInput["category"];
    inStock?: boolean;
    search?: string;
    includeInactive?: boolean;
}

type QueryValidationResult =
    | { ok: true; data: ProductsQuery }
    | { ok: false; message: string };

type PayloadValidationResult =
    | { ok: true; data: ProductInput }
    | { ok: false; message: string };

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 60;

function toFiniteNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "string") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: unknown): boolean | null {
    if (typeof value === "boolean") return value;
    if (typeof value !== "string") return null;
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    return null;
}

function sanitizeSlug(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function validateProductsQuery(searchParams: URLSearchParams): QueryValidationResult {
    const limitRaw = searchParams.get("limit");
    const pageRaw = searchParams.get("page");
    const categoryRaw = searchParams.get("category");
    const inStockRaw = searchParams.get("inStock");
    const searchRaw = searchParams.get("search");
    const includeInactiveRaw = searchParams.get("includeInactive");

    const limit = limitRaw ? toFiniteNumber(limitRaw) : DEFAULT_LIMIT;
    const page = pageRaw ? toFiniteNumber(pageRaw) : 1;

    if (!limit || limit < 1 || limit > MAX_LIMIT) {
        return { ok: false, message: `limit must be between 1 and ${MAX_LIMIT}` };
    }

    if (!page || page < 1) {
        return { ok: false, message: "page must be greater than 0" };
    }

    const data: ProductsQuery = {
        limit,
        page,
        skip: (page - 1) * limit,
    };

    if (categoryRaw) {
        const category = categoryRaw.trim() as ProductInput["category"];
        if (!PRODUCT_CATEGORIES.includes(category)) {
            return { ok: false, message: "Invalid category filter" };
        }
        data.category = category;
    }

    if (inStockRaw !== null) {
        const inStock = toBoolean(inStockRaw);
        if (inStock === null) {
            return { ok: false, message: "inStock must be true or false" };
        }
        data.inStock = inStock;
    }

    if (searchRaw) {
        const search = searchRaw.trim();
        if (search.length > MAX_SEARCH_LENGTH) {
            return { ok: false, message: `search must be less than ${MAX_SEARCH_LENGTH + 1} characters` };
        }
        if (search) {
            data.search = search;
        }
    }

    if (includeInactiveRaw !== null) {
        const includeInactive = toBoolean(includeInactiveRaw);
        if (includeInactive === null) {
            return { ok: false, message: "includeInactive must be true or false" };
        }
        data.includeInactive = includeInactive;
    }

    return { ok: true, data };
}

function isValidImagePath(path: string): boolean {
    return /^\/[a-zA-Z0-9/_\-.]+$/.test(path);
}

export function validateProductPayload(payload: unknown): PayloadValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, message: "Payload must be an object" };
    }

    const raw = payload as Record<string, unknown>;

    if (
        typeof raw.name !== "string" ||
        typeof raw.slug !== "string" ||
        typeof raw.category !== "string" ||
        typeof raw.description !== "string" ||
        typeof raw.image !== "string"
    ) {
        return { ok: false, message: "Missing required product fields" };
    }

    const name = raw.name.trim();
    const slug = sanitizeSlug(raw.slug);
    const category = raw.category.trim() as ProductInput["category"];
    const description = raw.description.trim();
    const image = raw.image.trim();
    const price = toFiniteNumber(raw.price);
    const inStock = raw.inStock === undefined ? true : toBoolean(raw.inStock);
    const isActive = raw.isActive === undefined ? true : toBoolean(raw.isActive);
    const sortOrder = raw.sortOrder === undefined ? 0 : toFiniteNumber(raw.sortOrder);

    if (!name || !slug || !description || !image || price === null || inStock === null || isActive === null || sortOrder === null) {
        return { ok: false, message: "Invalid product field values" };
    }

    if (!PRODUCT_CATEGORIES.includes(category)) {
        return { ok: false, message: "Invalid product category" };
    }

    if (!isValidImagePath(image)) {
        return { ok: false, message: "Image must be a valid public path starting with /" };
    }

    if (name.length > 120 || slug.length > 140 || description.length > 1200 || image.length > 300) {
        return { ok: false, message: "One or more fields are too long" };
    }

    if (price < 0 || sortOrder < 0) {
        return { ok: false, message: "price and sortOrder must be positive numbers" };
    }

    return {
        ok: true,
        data: {
            name,
            slug,
            category,
            description,
            image,
            price,
            inStock,
            isActive,
            sortOrder,
        },
    };
}

export function buildProductListQuery(query: ProductsQuery) {
    const mongoQuery: Record<string, unknown> = {};

    if (!query.includeInactive) {
        mongoQuery.isActive = true;
    }

    if (query.category) {
        mongoQuery.category = query.category;
    }

    if (typeof query.inStock === "boolean") {
        mongoQuery.inStock = query.inStock;
    }

    if (query.search) {
        const safe = escapeRegex(query.search);
        mongoQuery.$or = [
            { name: { $regex: safe, $options: "i" } },
            { description: { $regex: safe, $options: "i" } },
        ];
    }

    return mongoQuery;
}

export function isAdminRequest(request: Request): boolean {
    const secret = process.env.ADMIN_API_KEY;
    if (!secret) {
        return false;
    }

    const authHeader = request.headers.get("x-admin-key");
    return authHeader === secret;
}
