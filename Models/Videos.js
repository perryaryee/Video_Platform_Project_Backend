import mongoose from "mongoose";


const VideoSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isverified: { type: Boolean, required: false },
    verification_code: { type: String, required: true }

});

export default mongoose.model('videos', VideoSchema);