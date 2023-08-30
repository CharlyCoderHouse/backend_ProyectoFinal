import { usersRepository } from '../repositories/index.js';

const getAllUser = async () => {
    const user = await usersRepository.getAllUser();
    return user;
};

const getUser = async (email) => {
    const user = await usersRepository.getUser(email);
    return user;
};

const getUserById = async (id) => {
    const result = await usersRepository.getUserById(id);
    return result; 
};

const addUser = async (user) => {
    const result = await usersRepository.addUser(user);
    return result;
}; 

const updateUser = async (id, user) => {
    const result = await usersRepository.updateUser(id, user);
    return result;
};

const updatePushUser = async (id, data) => {
    const result = await usersRepository.updatePushUser(id, data);
    return result;
};

const deleteUserById = async (id) => {
    const result = await usersRepository.deleteUserById(id);
    return result;
};

const deleteAllUser = async (condition) => {
    const result = await usersRepository.deleteAllUser(condition);
    return result;
};

export {
    getAllUser,
    getUser,
    getUserById,
    updateUser,
    updatePushUser,
    addUser ,
    deleteUserById, 
    deleteAllUser 
}