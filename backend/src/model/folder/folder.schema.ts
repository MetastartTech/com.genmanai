import { Schema, Model, model } from "mongoose";
import { IFolder } from "../../types/schema";

const folderSchema = new Schema<IFolder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    parentFolder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    folders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "LlmRequest",
      },
    ],
  },
  {
    timestamps: true,
  }
);

folderSchema
  .pre("findOne", function (next) {
    this.populate("folders requests");
    next();
  })
  .pre("find", function (next) {
    this.populate("folders requests");
    next();
  });

const Folder: Model<IFolder> = model<IFolder>("Folder", folderSchema);

export default Folder;
