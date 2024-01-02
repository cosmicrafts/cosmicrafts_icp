// src/routes/profileRoutes.js (unused)
const express = require('express');
const router = express.Router();
const profileController = require('../api/profile');

// Define the routes using the profileController functions
router.get('/:auth0Id', profileController.getProfile);
router.put('/:auth0Id', profileController.updateProfile);

module.exports = router;
