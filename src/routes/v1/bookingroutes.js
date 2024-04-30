const express = require('express');
const router = express.Router();
const {bookingcontroller} = require("../../controllers")

router.post(
    '/',
     bookingcontroller.createBooking
);

module.exports = router;