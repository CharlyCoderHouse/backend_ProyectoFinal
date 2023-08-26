import UsersRepository from '../repositories/users.repository.js';

const usersRepository = new UsersRepository();

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

const deleteUserById = async (id) => {
    const result = await usersRepository.deleteUserById(id);
    return result;
};

export {
    getUser,
    getUserById,
    updateUser,
    addUser ,
    deleteUserById 
}