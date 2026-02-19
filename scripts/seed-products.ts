import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

const products = [
    {
        name: "Vape",
        slug: "vape",
        category: "Vape",
        description: "Latest disposables, pod systems, and premium vape devices.",
        image: "/icons/display/vapes.png",
        price: 19.99,
        inStock: true,
        isActive: true,
        sortOrder: 1,
    },
    {
        name: "Glass",
        slug: "glass",
        category: "Glass",
        description: "Clean-crafted glass pieces with standout quality and style.",
        image: "/icons/display/glass.png",
        price: 39.99,
        inStock: true,
        isActive: true,
        sortOrder: 2,
    },
    {
        name: "Kratom",
        slug: "kratom",
        category: "Kratom",
        description: "Trusted kratom products with reliable quality and selection.",
        image: "/icons/display/kratom.svg",
        price: 24.99,
        inStock: true,
        isActive: true,
        sortOrder: 3,
    },
    {
        name: "CBD",
        slug: "cbd",
        category: "CBD",
        description: "Premium CBD options selected for consistency, quality, and trust.",
        image: "/icons/display/cbd.svg",
        price: 29.99,
        inStock: true,
        isActive: true,
        sortOrder: 4,
    },
    {
        name: "Hookah",
        slug: "hookah",
        category: "Hookah",
        description: "Premium hookah setups, bowls, coals, and flavor essentials.",
        image: "/icons/display/hookah.png",
        price: 49.99,
        inStock: true,
        isActive: true,
        sortOrder: 5,
    },
    {
        name: "Vaporizer",
        slug: "vaporizer",
        category: "Vaporizer",
        description: "Trusted dry herb and concentrate vaporizers for every level.",
        image: "/icons/display/vaporizers.png",
        price: 79.99,
        inStock: true,
        isActive: true,
        sortOrder: 6,
    },
] as const;

async function seedProducts() {
    const connection = await connectToDatabase();
    if (!connection) {
        throw new Error("Database is not available. Configure MONGODB_URI before seeding.");
    }

    let upsertedCount = 0;
    for (const product of products) {
        await Product.findOneAndUpdate(
            { slug: product.slug },
            product,
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );
        upsertedCount += 1;
    }

    console.log(`Seed complete: ${upsertedCount} products upserted.`);
}

seedProducts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Product seed failed:", error);
        process.exit(1);
    });
