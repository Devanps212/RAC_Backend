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
        type:mongoose.Types.ObjectId,
        required: true
    },
    ownerRole : {
      type: String,
      required: true
    },
    status:{
        type: String,
        enum:['Pending', 'Confirmed', 'Cancelled', 'Completed', 'On Hold', 'In Progress'],
        default: 'Pending'
    },
    date: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
      },
    time: {
          start: { type: String, required: true },
          end: { type: String, required: true }
      },
    location: {
          start: { type: String, required: true },
          end: { type: String, required: true }
      },
    transaction: {
        type: {
            transaction: { type: String },
            amount: { type: Number }
        }
    },
    issues:{
        type: String,
        default:''
    }
})

export const bookingModel = mongoose.model('Bookings', bookingSchema)
export type BookingModelType = typeof bookingModel