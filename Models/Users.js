import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isverified: { type: Boolean, required: false },
    verification_code: { type: Number, required: true }

});

export default mongoose.model('users', UserSchema);