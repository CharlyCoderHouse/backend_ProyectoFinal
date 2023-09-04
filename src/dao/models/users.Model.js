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
                cart: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'carts'
                    }
                ]
            }
        ,
        default: {},
    },
    role: {
        type: String,
        default: 'User'
    },
    last_connection: {
        type: Date
    },
    documents: {
        type: [
            {
                name: {
                    type: String
                },
                reference: {
                    type: String
                }
            }
        ],
        default: []
    },
    status: {
        type: Array,
        default: []
    }
});

userSchema.pre('find', function () {
    this.populate('cart.cart');
});

export const userModel = mongoose.model(userCollection, userSchema);