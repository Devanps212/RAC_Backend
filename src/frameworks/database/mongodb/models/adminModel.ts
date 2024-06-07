import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    }
});

export const adminsModel = mongoose.model('Admin', adminSchema);
export type adminModel = typeof adminsModel