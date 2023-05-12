import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: Number,
    code: {
        type: Number,
        required: true,
        unique: true
    },
    stock: Number,
    category: String,
    thumbnail: {
        type: Array,
        default: []
    },
    status: Boolean
});

export const productModel = mongoose.model(productCollection, productSchema)
