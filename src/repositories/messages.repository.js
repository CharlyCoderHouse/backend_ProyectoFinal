export default class MessagesRepository {

    constructor(dao) {
        this.dao = dao;
    };

    addMessage = async (message) => {
        const result = await this.dao.addMessage(message);
        return result;
    };

};