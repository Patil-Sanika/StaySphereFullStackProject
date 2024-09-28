const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');  // Ensure the path is correct
const Listing = require('../models/listing');

// const bookingController = require("../controller/booking.js");

// router.post('/book',bookingController.booking);

// Post bookings 
router.post('/book', async (req, res) => {
    try {
      
        const { listingId, checkinDate, checkoutDate, guests, fullName, email, phone } = req.body;

        // Validate that all required fields are present
        if (!listingId || !checkinDate || !checkoutDate || !guests || !fullName || !email || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the check-in and check-out dates are valid dates
        if (isNaN(new Date(checkinDate)) || isNaN(new Date(checkoutDate))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Ensure the listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check for duplicate booking
        const existingBooking = await Booking.findOne({
            listing: listingId,
            checkinDate: new Date(checkinDate),
            checkoutDate: new Date(checkoutDate),
            guests,
            fullName,
            email,
            phone
        });

        if (existingBooking) {
            return res.status(409).json({ error: 'Booking already exists' });
        }

        // Create a new booking
        const booking = new Booking({
            listing: listingId,
            checkinDate: new Date(checkinDate), // Ensure it's a Date object
            checkoutDate: new Date(checkoutDate), // Ensure it's a Date object
            guests,
            fullName,
            email,
            phone
        });

        await booking.save();

        console.log('Booking saved:', booking); // Add this log

        res.json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error creating booking:', error); // Log the error for debugging
        res.status(500).json({ error: 'An error occurred while processing your booking.' });
    }
});

// Get the saved booking 
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ error: 'An error occurred while retrieving bookings.' });
    }
});

module.exports = router;
