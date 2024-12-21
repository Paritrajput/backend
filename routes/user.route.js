import express, { response, Router } from "express";
import {
  currentUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";
import {
  postBlog,
  upload,
  getAllBlogs,
  getUserBlogs,
} from "../controllers/blog.controller.js";
import authenticate from "../middleware/authenticate.js";
import contact from "../controllers/contact.controller.js";

const userRouter = Router();

// userRouter.get("/", () => {
//   response.send("hello world");
// });

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);
userRouter.get("/user", authenticate, currentUser);

userRouter.post("/blog", authenticate, upload.single("coverImage"), postBlog); // Handle the image upload
userRouter.get("/blogs", getAllBlogs);

userRouter.get("/myblogs", authenticate, getUserBlogs);
userRouter.post("/contact", contact);

export { userRouter };
