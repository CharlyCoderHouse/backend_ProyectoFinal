import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        index: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: String,
    products: {
        type: [
            {
                title: String,
                price: Number,
                quantity: Number
            }
        ],
        default: [],
    }
});


export const ticketModel = mongoose.model(ticketCollection, ticketSchema);