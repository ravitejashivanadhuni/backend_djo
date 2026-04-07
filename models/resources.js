import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    type: { type: String, enum: ["PDF", "DOC"], required: true },
    category: { type: String, required: true },
    pages: Number,
    size: String,
    color: String,
    icon: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    fileUrl: String, // 🔥 important for downloads later
  },
  { timestamps: true }
);

// 🔥 Indexes for faster queries

resourceSchema.index({category:1});
resourceSchema.index({type:1});
resourceSchema.index({level: 1});

export default mongoose.model("Resource", resourceSchema);
