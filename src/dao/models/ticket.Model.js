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
    purchaser: String
});


export const ticketModel = mongoose.model(ticketCollection, ticketSchema);