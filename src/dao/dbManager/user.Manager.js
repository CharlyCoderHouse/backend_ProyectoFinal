import { userModel } from '../models/users.Model.js';

export default class userManager {

    constructor() {
        console.log('Working user with DB');
    };
    
    getUser = async (email) => {
        const user = await userModel.findOne( email );
        return user; 
    };

    getUserById = async (id) => {
        const user = await userModel.findOne( id );
        return user; 
    };
    
    addUser = async (user) => {
        const result = await userModel.create(user);
        return result;
    };

    updateUser = async (id, user) => {
        const result = await userModel.updateOne({_id: id}, { $set: user });
        return result;
    };

    updatePushUser = async (id, data) => {
        const result = await userModel.updateOne({_id: id}, {$push: data});
        return result;
    };

    deleteUserById = async (id) => {
        const result = await userModel.deleteOne({_id: id});
        return result;
    };

};

