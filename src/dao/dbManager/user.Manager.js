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

    updateUserPass = async (id, newPass) => {
        const result = await userModel.updateOne({_id: id}, {$set: {password: newPass} });
        return result;
    };

};

