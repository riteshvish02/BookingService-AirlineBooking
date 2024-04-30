const express = require('express');
const router = express.Router();
const {bookingcontroller} = require("../../controllers")

router.post(
    '/',
     bookingcontroller.createBooking
);

router.post(
    '/payments',
     bookingcontroller.makePayment
);


module.exports = router;