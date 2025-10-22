import mongoose from "mongoose";

const userHistorySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  }, 
  chatHistory: {
    type: Array,
    default: [],
  }
});


export default mongoose.models.UserHistory || mongoose.model("UserHistory", userHistorySchema);
