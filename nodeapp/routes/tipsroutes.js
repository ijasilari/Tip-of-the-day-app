import { Router } from "express";
import { check } from "express-validator";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getTips,
  getTipsByCategory,
  deleteTipById,
  updateTipById,
  getTipById,
  addNewTip,
  getTipByIdPlainText,
  getTipByRandom,
} from "../controllers/tips.js";

const tipsRouter = Router();

tipsRouter.get("/getall", getTips);

tipsRouter.get("/getall/:category", getTipsByCategory);

tipsRouter.get("/randomtip", getTipByRandom);

tipsRouter.get("/:tid", getTipById);

tipsRouter.get("/:tid/plain", getTipByIdPlainText);

tipsRouter.use(verifyToken);

tipsRouter.delete("/:tid/delete", deleteTipById);

tipsRouter.patch(
  "/:tid/update",
  [check("description").notEmpty(), check("category").notEmpty()],
  updateTipById
);

tipsRouter.post(
  "/addtip",
  [check("description").notEmpty(), check("category").notEmpty()],
  addNewTip
);

export default tipsRouter;