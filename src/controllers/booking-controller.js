const { StatusCodes } = require("http-status-codes")
const {BookingService } = require("../services")

const {ErrorResponse,SuccessResponse} = require("../utils/common")
async function createBooking(req, res, next){
    try {
        const Booking = await BookingService.CreateBooking({
            flightId : req.body.flightId,
            userId : req.body.userId,
            noOfSeats:req.body.seats
           })
     SuccessResponse.data = Booking;
      return res    
      .status(StatusCodes.CREATED)
      .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error
        console.log(error);
        return res  
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse)
        
    }
}




module.exports = {
    createBooking,
    
}