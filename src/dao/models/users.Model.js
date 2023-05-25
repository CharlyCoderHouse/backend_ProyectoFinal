import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: String,
    password: String
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;