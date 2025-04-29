import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId:{
    type:String
  },
  text: {
    type: String
  },
  sender: {
    type: String,
    required: [true, 'Sender name is required']
  },
  profilePic:{type:String},
  imageUrl:{type:String},
  publicId:{type:String},
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;