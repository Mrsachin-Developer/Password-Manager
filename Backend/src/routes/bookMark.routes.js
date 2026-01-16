import express from "express";
import {
  addMark,
  deleteMark,
  updateMark,
  getMarks,
  getMarkById,
} from "../controllers/bookMark.controller.js";
import checkPoint from "../middlewares/checkpoint.midddleware.js";

const router = express.Router();

router.use(checkPoint); //  protected routes

router.post("/", addMark); // Create
router.get("/", getMarks); // List (pagination, filter, search)
router.get("/:id", getMarkById); // Single fetch
router.patch("/:id", updateMark); // Update
router.delete("/:id", deleteMark); // Delete

export default router;
