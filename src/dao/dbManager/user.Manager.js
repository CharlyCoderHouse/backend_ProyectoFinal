import { userModel } from '../models/users.Model.js';

export default class userManager {

    constructor() {
        console.log('Working user with DB');
    };
    
    getUser = async (email) => {
        const products = await userModel.findOne( email );
        //console.log("1" + JSON.stringify(products, null, '\t'));
        return products; 
    };

    addUser = async (user) => {
        const result = await userModel.create(user);
        return result;
    };

};

