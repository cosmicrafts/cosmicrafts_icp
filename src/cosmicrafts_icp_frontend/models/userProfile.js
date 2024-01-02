// models/userProfile.js
import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    auth0Id: String, // Unique identifier from Auth0
    email: String,
    name: String,
    avatar: String,
    username: { type: String, default: null }
});

export const UserProfile =
 mongoose.model('UserProfile', userProfileSchema);