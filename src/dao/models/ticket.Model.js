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
    productBuy: {
        type: [
            {
                name: String,
                prices: Number,
                quantitys: Number
            }
        ],
        default: [],
    }
});


export const ticketModel = mongoose.model(ticketCollection, ticketSchema);