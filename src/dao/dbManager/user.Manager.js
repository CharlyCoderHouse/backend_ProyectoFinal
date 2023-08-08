import { userModel } from '../models/users.Model.js';

export default class userManager {

    constructor() {
        console.log('Working user with DB');
    };
    
    getUser = async (email) => {
        const products = await userModel.findOne( email );
        return products; 
    };

    addUser = async (user) => {
        const result = await userModel.create(user);
        return result;
    };

    updateUser = async (id, user) => {
        const result = await userModel.updateOne({_id: id}, { $set: user });
        return result;
    };

};

