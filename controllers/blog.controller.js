import { error } from "console";
import { Blog } from "../models/blog.model.js";
import multer from "multer";
import path from "path";

// Setup multer for file upload handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with current timestamp
  },
});

const upload = multer({ storage: storage });

// Create a new blog
const postBlog = async (req, res) => {
  const { title, content, category } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
  // const coverImage = req.file ? req.file.filename : null;

  if (!title || !content || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existed = await Blog.findOne({ title });
    if (existed) {
      return res.status(409).json({ error: "This title already exists" });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      coverImage,
      author: req.user.username,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog posted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error posting blog" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.username });
    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blogs" });
  }
};
export { postBlog, upload, getAllBlogs, getUserBlogs };
