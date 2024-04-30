const express = require('express');
const router = express.Router();
const {infocontroller} = require("../../controllers")
const bookingroutes = require("./bookingroutes")

router.get('/info',infocontroller.info);
router.use('/bookings',bookingroutes)
module.exports = router;