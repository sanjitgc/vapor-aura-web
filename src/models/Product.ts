import { Schema, model, models, type InferSchemaType } from "mongoose";

export const PRODUCT_CATEGORIES = [
    "Vape",
    "Glass",
    "Kratom",
    "CBD",
    "Hookah",
    "Vaporizer",
] as const;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 140,
        },
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1200,
        },
        image: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, sortOrder: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema>;

const Product = models.Product || model("Product", ProductSchema);

export default Product;
