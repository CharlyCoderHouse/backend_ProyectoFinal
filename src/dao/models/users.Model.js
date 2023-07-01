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
    password: String,
    cart: {
        type: {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ,
        default: {},
    },
    role: {
        type: String,
        default: 'user'
    }
});

userSchema.pre('find', function () {
    this.populate('carts.cart');
});

export const userModel = mongoose.model(userCollection, userSchema);