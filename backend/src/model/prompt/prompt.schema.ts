import { Schema, Model, model } from "mongoose";
import { IPromptTemplate } from "../../types/schema";

const promptTemplateSchema = new Schema<IPromptTemplate>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    template: {
      type: String
    },
    variables: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const PromptTemplate: Model<IPromptTemplate> = model<IPromptTemplate>(
  "PromptTemplate",
  promptTemplateSchema
);

export default PromptTemplate;
