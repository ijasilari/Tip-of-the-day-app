import { Router } from "express";
import { check } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getTips,
  getTipsByCategory,
  getTipsByCreator,
  deleteTipById,
  updateTipById,
  getTipById,
  addNewTip,
  getTipByIdPlainText,
  getTipByRandom,
  addLike,
} from "../controllers/tips.js";

const tipsRouter = Router();

tipsRouter.get("/getall", getTips);

tipsRouter.get("/getall/:category", getTipsByCategory);

tipsRouter.get("/getbycreator/:creator", getTipsByCreator);

tipsRouter.get("/randomtip", getTipByRandom);

tipsRouter.get("/:tid", getTipById);

tipsRouter.get("/:tid/plain", getTipByIdPlainText);

tipsRouter.use(verifyToken);

tipsRouter.patch("/:tid/like", addLike);

tipsRouter.delete("/:tid/delete", deleteTipById);

tipsRouter.patch(
  "/:tid/update",
  [
    check("description").notEmpty(),
    check("category").notEmpty(),
    check("creator").notEmpty(),
  ],
  updateTipById
);

tipsRouter.post(
  "/addtip",
  [
    check("description").notEmpty(),
    check("category").notEmpty(),
    check("creator").notEmpty(),
  ],
  addNewTip
);

export default tipsRouter;
