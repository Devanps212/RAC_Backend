import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref:'User',
    required: true
  },
  recieverId: {
    type: mongoose.Types.ObjectId,
    ref:'User',
    required: true
  },
  message:{
    type: String,
    required: true
  }
},
{
 timestamps: true 
});

export const MessageModel = mongoose.model("Message", messageSchema);

export type MessageModelType = typeof MessageModel;