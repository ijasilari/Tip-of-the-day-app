import { Router } from "express";
// import { verifyToken } from "../middleware/verifyToken.js";
import { signUpUser, loginUser, getUsers } from "../controllers/users.js";
const usersRouter = Router();

usersRouter.get("/getusers", getUsers);

usersRouter.post("/signup", signUpUser);
usersRouter.post("/login", loginUser);

export default usersRouter;