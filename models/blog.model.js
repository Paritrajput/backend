import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  coverImage: { type: String },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Blog = mongoose.model("Blog", blogSchema);
