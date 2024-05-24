
import { Schema, model, models } from "mongoose";

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = models.File || model("File", fileSchema);
export default File;
