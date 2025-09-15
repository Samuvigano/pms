import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  wa_id: {
    type: String,
    required: true,
    index: true,
  },
  message_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  direction: {
    type: String,
    enum: ["inbound", "outbound"],
    required: true,
  },
  image: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const escalationsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new mongoose.Schema({
  wa_id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  last_interaction: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Escalation = mongoose.model("Escalation", escalationsSchema);

MessageSchema.index({ wa_id: 1, timestamp: -1 });

const Message = mongoose.model("Message", MessageSchema);

const User = mongoose.model("User", UserSchema);

export { Message, Escalation, User };
