const { StatusCodes } = require("http-status-codes")
const {BookingService } = require("../services")

const {ErrorResponse,SuccessResponse} = require("../utils/common");

const inmemDb = {}
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

async function makePayment(req,res){
  try {
    const idempotencyKey = req.headers['x-idempotent-key'];
    if(!idempotencyKey ) {
      return res
          .status(StatusCodes.BAD_REQUEST)
          .json({message: 'idempotency key missing'});
  }
  if(inmemDb[idempotencyKey]) {
      return res
          .status(StatusCodes.BAD_REQUEST)
          .json({message: 'Cannot retry on a successful payment'});
  } 
    const response = await BookingService.makePayment({
       totalcost:req.body.totalcost,
       userId:req.body.userId,
       BookingId:req.body.bookingId
    })
    inmemDb[idempotencyKey] = idempotencyKey;
    SuccessResponse.data = response;
    return res    
    .status(StatusCodes.CREATED)
    .json(SuccessResponse)
  } catch (error) {
    console.log(error);
    ErrorResponse.error = error
    return res  
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(ErrorResponse)
  }
}



module.exports = {
    createBooking,
    makePayment
}