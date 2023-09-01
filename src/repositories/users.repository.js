export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAllUser = async (condition) => {
        const result = await this.dao.getAllUser(condition);
        return result;
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

    updatePushUser = async (id, data) => {
        const result = await this.dao.updatePushUser(id, data);
        return result;
    };

    deleteUserById = async (id) => {
        const result = await this.dao.deleteUserById(id);
        return result;
    };

    deleteAllUser = async (condition) => {
        const result = await this.dao.deleteAllUser(condition);
        return result;
    };

}