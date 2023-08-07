import UsersDao from '../dao/dbManager/user.Manager.js';

export default class UsersRepository {
    constructor() {
        this.dao = new UsersDao();
    }

    getUser = async (email) => {
        const result = await this.dao.getUser(email);
        return result;
    }

    addUser = async (user) => {
        const result = await this.dao.addUser(user);
        return result;
    }

    updateUserPass = async (id, newPass) => {
        const result = await this.dao.updateUserPass(id, newPass);
        return result;
    }

}