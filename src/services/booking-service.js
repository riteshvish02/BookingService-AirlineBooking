const { StatusCodes } = require("http-status-codes")
const {BookingRepo} = require("../repositories")
const axios = require("axios");
const AppError = require("../utils/errors/app-error")
const db = require("../models")
const {serverconfig} = require("../config")
const Bookingrepo = new BookingRepo()

async function CreateBooking(data){
  const transaction = await db.sequelize.transaction()
  try {
   const flight = await axios.get( `${serverconfig.FLIGHTSERVER}/api/v1/flights/${data.flightId}`)
   const flightdata = flight.data.data
   if(data.noOfSeats > flightdata.totalSeats){
     throw new AppError("Not enough seats are available", StatusCodes.BAD_REQUEST)
   }
     
   const totalBillingAmount = flightdata.price * data.noOfSeats;
   const bookingpayload = {...data,totalcoast:totalBillingAmount}
  const booking = await Bookingrepo.createBooking(bookingpayload,transaction)
  await axios.patch( `${serverconfig.FLIGHTSERVER}/api/v1/flights/${data.flightId}/seats`,{
    seats:data.noOfSeats
  })
 
   await transaction.commit()
   return booking
  } catch (error) {
    await transaction.rollback()
    throw error
  }
    

}

// 
module.exports = {
    CreateBooking,
    
};