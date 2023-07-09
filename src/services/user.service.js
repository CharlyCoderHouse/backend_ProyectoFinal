import UsersRepository from '../repositories/users.repository.js';

const usersRepository = new UsersRepository();

const getUser = async (email) => {
    const user = await usersRepository.getUser(email);
    return user;
};

const addUser = async (user) => {
    const result = await usersRepository.addUser(user);
    return result;
}; 

export {
    getUser,
    addUser  
}