import mongoose, { Schema, Types } from 'mongoose'


const comments = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: true
  },
  comment:{
    type: String,
    required: true
  },
  userRating: {
    type:Number
  }
})
const carSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    owner:{
        type:String,
        required : true,
        enum:['Admin', 'Partner']
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required: true
    },
    mileage : {
        type: Number,
        default:0
    },
    engine: {
        type: String,
        default: '',
      },
      transmission: {
        type: String,
        default: '',
      },
      fuelType: {
        type: String,
        default: '',
      },
      interior: {
        type:[String],
        default: [],
      },
      exterior: {
        type: [String],
        default: [],
      },
      status: {
        type: String,
        enum: ['available', 'maintenance', 'booked', 'not available'],
        default: '',
      },
      rating: {
        type: Number,
        default: 0,
      },
      ratingsCount: {
        type: Number,
        default: 0
    },
      description: {
        type: String,
        default: '',
      },
      comments: {
        type: [comments],
        default: [],
      },
      vehicleNumber: {
        type: String,
        default: '',
      },
      rentPricePerWeek: {
        type: Number,
        default: 0,
      },
      rentPricePerDay: {
        type: Number,
        default: 0,
      },
      insuranceDetails: {
        type: String,
        default: '',
      },
      seats:{
        type:Number,
        required: true
      },
      addedBy: {
        type: String,
        required: true,
      },
      addedById : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        refpath:'owner'
      },
      createdAt : {
        type: Date,
        default: Date.now()
      },
      thumbnailImg :{
        type:String,
        required: true
      },
      offer: {
        discount:{
          type: Number,
          default: 0,
        },
        price:{
          type: Number,
          default: null
        }
      }
})

export const carModel = mongoose.model('Cars', carSchema)
export type carModelType = typeof carModel