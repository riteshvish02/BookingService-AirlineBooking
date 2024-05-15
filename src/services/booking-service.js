const { StatusCodes } = require("http-status-codes")
const {BookingRepo} = require("../repositories")
const axios = require("axios");
const AppError = require("../utils/errors/app-error")
const {Queue} = require('../config')
const db = require("../models")
const {serverconfig} = require("../config")
const {ENUMS} = require("../utils/common")
const { BOOKED,
  CANCELLED,
  PENDING,
  INITIATED} = ENUMS.Booking_status
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
   const bookingpayload = {...data,totalcost:totalBillingAmount}
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

async  function makePayment(data){
  const transaction = await db.sequelize.transaction()
  try {
      const bookingdetails = await Bookingrepo.get(data.BookingId,transaction)
      if(bookingdetails.status == CANCELLED){
        throw new AppError("Booking has been expired", StatusCodes.BAD_REQUEST)
      }
      // console.log(bookingdetails);
      const bookingTime = new Date(bookingdetails.createdAt)
      const currentTime = new Date()
      if(currentTime - bookingTime > 300000){
          await Bookingrepo.update(data.BookingId,{status:CANCELLED},transaction)
          throw new AppError('the Booking Has been Expired',StatusCodes.BAD_REQUEST)
      }
     
      if(bookingdetails.totalcost.toString() !== data.totalcost.toString()) {
        throw new AppError("the Amount of the does not match", StatusCodes.BAD_REQUEST)
      }
      if(bookingdetails.userId.toString() !== data.userId.toString()) {
            throw new AppError("the User corresponding to the booking does not match", StatusCodes.BAD_REQUEST)
      }

      //assume payment is successful
      await Bookingrepo.update(data.BookingId,{status:BOOKED},transaction)
      await transaction.commit()
      Queue.senddata({
        recepient:"kv@gmail.com",
        subject:"Flight booked",
        body: `booking successfully done for flight`
      })
      return bookingdetails
  } catch (error) {
    await transaction.rollback()
    throw error
  }

}

async function cancelBooking(bookingId){
  const transaction = await db.sequelize.transaction()
  try {
    const bookingdetails = await Bookingrepo.get(bookingId,transaction)
    if(bookingdetails.status == CANCELLED){
      await transaction.rollback()
      return true
    }
    await axios.patch( `${serverconfig.FLIGHTSERVER}/api/v1/flights/${bookingdetails.flightId}/seats`,{
      seats:bookingdetails.noOfSeats,
      dec:0
    })

    await Bookingrepo.update(bookingId,{status:CANCELLED},transaction)
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw error
  }

}

async function cancelOldBookings(){
try {
  const time = new Date( new Date() - 1000 * 300) //time 5 min ago
  const response = await Bookingrepo.cancelOldBooking(time)
  return response
} catch (error) {
  throw error
}
}
// 
module.exports = {
    CreateBooking,
    makePayment,
    cancelOldBookings
};