import TicketsDao from '../dao/dbManager/ticket.Manager.js';

export default class TicketRepository {
    constructor() {
        this.dao = new TicketsDao();
    }

    getTickets = async () => {
        const result = await this.dao.find();
        return result;
    }

    getTicketsById = async (id) => {
        const result = await this.dao.findById(id);
        return result;
    }

    createTicket = async (ticket) => {
        const result = await this.dao.create(ticket);
        return result;
    }

}