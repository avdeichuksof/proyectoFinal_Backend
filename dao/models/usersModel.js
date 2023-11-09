import { Schema, model } from "mongoose"

const UserSchema = new Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"]
    },
    documents: [{
        name: {
            type: String
        },
        reference: {
            type: String
        }
    }],
    lastConnection: {
        type: String
    }
})


const User = model('User', UserSchema)
export default User