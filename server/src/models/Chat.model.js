import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  originalMessage: {
    type: String,
    required: true
  },

  translatedMessage: {
    type: String,
    required: true
  }

}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);