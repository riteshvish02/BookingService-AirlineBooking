const CrudRepository = require("./crud-repo")
const {Booking} = require("../models")

class BookingRepo extends CrudRepository {
   constructor(){
       super(Booking)
  }
  
  async createBooking(data,transation){
    const response = await Booking.create(data,{transation:transation})
    return response;
  }
}

module.exports = BookingRepo;