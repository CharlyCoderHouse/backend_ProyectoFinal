import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
        unique: true,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
        
    },
    category: String,
    thumbnail: {
        type: Array,
        default: []
    },
    status: Boolean
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema)
