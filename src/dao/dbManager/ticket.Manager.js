import { ticketModel } from '../models/ticket.Model.js';

export default class TicketsDao {

    constructor() {
        console.log('Working tickets with DB');
    };

    getTickets = async () => {
        const result = await ticketModel.find().lean();
        return result;
    }

    getTicketsById = async (id) => {
        const result = await ticketModel.findById(id);
        return result;
    }

    createTicket = async (ticket) => {
        const result = await ticketModel.create(ticket);
        return result;
    }

}