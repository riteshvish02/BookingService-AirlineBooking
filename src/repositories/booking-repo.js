const CrudRepository = require("./crud-repo")
const {Booking} = require("../models")
const AppError = require("../utils/errors/app-error")
const {Op} = require('sequelize')
const {ENUMS} = require('../utils/common')
const {CANCELLED,BOOKED} = ENUMS.Booking_status
const { StatusCodes } = require("http-status-codes")
class BookingRepo extends CrudRepository {
   constructor(){
       super(Booking)
  }
  
  async createBooking(data,transation){
    const response = await Booking.create(data,{transation:transation})
    return response;
  }
  async get(data,transaction){
    try {
      const response = await Booking.findByPk(data,{transaction:transaction})
      if(!response){
        throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND)
      }
      return response;
    } catch (error) {
      throw error
    }
   
  }

  async update(id,data,transaction){
    const response = await Booking.update(data,{
      where:{
        id:id
      }
    },{transaction:transaction})
    return response;
  }

async cancelOldBooking(timestamps){
  const response = await Booking.update({status:CANCELLED},{
    where:{
      [Op.and]: [
        { 
          createdAt:{
            [Op.lt]:timestamps
          }
        }, 
        { 
          status:{
            [Op.ne]:BOOKED
          }
         },
         {
          status:{
            [Op.ne]:CANCELLED
          }
         }
      ],     
    }
  })
  return response;
}
}

module.exports = BookingRepo;