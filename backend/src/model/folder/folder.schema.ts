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
    requests: [Schema.Types.ObjectId],
    type: {
      type: String,
      enum: ["llm", "image"],
      default: "llm",
    },
  },
  {
    timestamps: true,
  }
);

folderSchema
  .pre("findOne", function (next) {
    this.populate("folders");
    next();
  })
  .pre("find", function (next) {
    this.populate("folders");
    next();
  });

const Folder: Model<IFolder> = model<IFolder>("Folder", folderSchema);

export default Folder;
