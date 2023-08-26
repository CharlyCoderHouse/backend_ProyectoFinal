import UsersDao from '../dao/dbManager/user.Manager.js';

export default class UsersRepository {
    constructor() {
        this.dao = new UsersDao();
    }

    getUser = async (email) => {
        const result = await this.dao.getUser(email);
        return result;
    }

    getUserById = async (id) => {
        const result = await this.dao.getUserById(id);
        return result; 
    };

    addUser = async (user) => {
        const result = await this.dao.addUser(user);
        return result;
    }

    updateUser = async (id, user) => {
        const result = await this.dao.updateUser(id, user);
        return result;
    }

    deleteUserById = async (id) => {
        const result = await this.dao.deleteUserById(id);
        return result;
    };

}