import { messageModel } from "../models/messageModel.js"

export default class messageManager {

    constructor() {
        console.log('Working chats with DB');
    };

    addMessage = async (message) => {
        const result = await messageModel.create(message);
        return result;
    };

};