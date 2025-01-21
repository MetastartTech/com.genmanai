import mongoose, { Schema } from "mongoose";
import { IUserActivityLog } from "../../types/schema";

const userActivityLogSchema = new Schema<IUserActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["folder", "prompt", "llm_request", "image_request"],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const UserActivityLog = mongoose.model<IUserActivityLog>(
  "UserActivityLog",
  userActivityLogSchema
);

export default UserActivityLog;
