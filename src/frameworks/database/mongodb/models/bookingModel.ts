import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    carId:{
        type:mongoose.Types.ObjectId,
        ref:'Cars',
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    owner:{
        type:String,
        required: true
    },
    status:{
        type: String,
        enum:['Pending', 'Confirmed', 'Cancelled', 'Completed', 'On Hold', 'In Progress'],
        default: 'Pending'
    },
    date:{
        type: [{
          start: { type: Date, required: true },
          end: { type: Date, required: true }
        }]
      },
      time:{
        type: [{
          start: { type: String, required: true },
          end: { type: String, required: true }
        }]
      },
      location:{
        type: [{
          start: { type: String, required: true },
          end: { type: String, required: true }
        }]
      },
      transaction:{
        type: [{
          transaction: { type: String },
          amount: { type: Number }
        }]
      }
})

export const bookingModel = mongoose.model('Bookings', bookingSchema)
export type BookingModelType = typeof bookingModel