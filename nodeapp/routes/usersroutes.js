import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  signUpUser,
  loginUser,
  getUsers,
  getUserWithId,
  deleteUserWithId,
  updateUserWithId,
} from "../controllers/users.js";
const usersRouter = Router();

usersRouter.get("/getusers", getUsers);
usersRouter.get("/:uid", getUserWithId);

usersRouter.post("/signup", signUpUser);
usersRouter.post("/login", loginUser);

usersRouter.use(verifyToken);
usersRouter.patch("/:uid/update", updateUserWithId);

usersRouter.delete("/:uid/delete", deleteUserWithId);

export default usersRouter;
