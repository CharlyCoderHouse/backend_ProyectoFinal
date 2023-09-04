export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getTickets = async (condition) => {
        const result = await this.dao.getTickets(condition);
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