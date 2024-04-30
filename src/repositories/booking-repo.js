const CrudRepository = require("./crud-repo")
const {Booking} = require("../models")
const AppError = require("../utils/errors/app-error")
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
      const response = await this.model.findByPk(data,{transaction:transaction})
      if(!response){
        throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND)
      }
      return response;
    } catch (error) {
      throw error
    }
   
  }

  async update(id,data,transaction){
    const response = await this.model.update(data,{
      where:{
        id:id
      }
    },{transaction:transaction})
    return response;
  }
}

module.exports = BookingRepo;