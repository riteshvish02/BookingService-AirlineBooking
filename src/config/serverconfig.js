const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    FLIGHTSERVER:process.env.Flight_Service,
    PORT:process.env.PORT,
}