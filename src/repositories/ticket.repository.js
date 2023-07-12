import TicketsDao from '../dao/dbManager/ticket.Manager.js';

export default class TicketRepository {
    constructor() {
        this.dao = new TicketsDao();
    }

    getTickets = async () => {
        const result = await this.dao.getTickets();
        return result;
    }

    getTicketsById = async (id) => {
        const result = await this.dao.getTicketsById(id);
        return result;
    }

    createTicket = async (ticket) => {
        const result = await this.dao.createTicket(ticket);
        return result;
    }

}