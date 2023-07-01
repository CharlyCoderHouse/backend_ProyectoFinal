import { USERDAO } from "../dao/index.js";

const getUser = async (email) => {
    const user = await USERDAO.getUser(email);
    return user;
};

const addUser = async (user) => {
    const result = await USERDAO.addUser(user);
    return result;
}; 

export {
    getUser,
    addUser  
}