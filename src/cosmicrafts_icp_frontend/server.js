import express from 'express';
import mongoose from 'mongoose'; // Import mongoose
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { UserProfile } from './models/userProfile.js';

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Get user profile by Auth0 ID
app.get('/api/profile/:auth0Id', async (req, res) => {
    try {
        let profile = await UserProfile.findOne({ auth0Id: req.params.auth0Id });
        if (!profile) {
            // Create a new profile if it doesn't exist
            profile = new UserProfile({
                auth0Id: req.params.auth0Id,
                email: req.body.email, // Assuming email is sent in the body
                name: req.body.name, // Assuming name is sent in the body
                avatar: req.body.avatar // Assuming avatar is sent in the body
            });
            await profile.save();
        }
        res.json(profile);
    } catch (error) {
        console.error("Error fetching/creating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update user profile
app.put('/api/profile/:auth0Id', async (req, res) => {
    try {
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { auth0Id: req.params.auth0Id },
            { $set: req.body },
            { new: true } // Return the updated document
        );
        if (updatedProfile) {
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create a new user profile
app.post('/api/profile', async (req, res) => {
  try {
      let profile = new UserProfile({
          auth0Id: req.body.auth0Id, // Assuming Auth0 ID is sent in the body
          email: req.body.email,
          name: req.body.name,
          avatar: req.body.avatar,
          username: req.body.username
      });
      await profile.save();
      res.status(201).json(profile);
  } catch (error) {
      console.error("Error creating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

