import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants:[
    {
      type: mongoose.Types.ObjectId,
      ref:'User'
    }
  ], 
  messages:[
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default:[]
    }
  ]

});

export const conversationModel = mongoose.model("Conversation", conversationSchema)
export type conversationModelType = typeof conversationModel;