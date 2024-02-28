import express from "express";

const router = express.Router();
import auth from "../middleware/auth.js";
import Job from "../models/JobModal.js";
import {
  appliedJobController,
  applyJobController,
  createJob,
  dashBoardController,
  deletePlacementOpportunity,
  downloadFileController,
  getAllDepartMentsController,
  getJobs,
  updatePlacementOpportunity,
} from "../controllers/job.js";
import { upload } from "../utils/multerCofig.js";
router.post("/create-job", auth, createJob);
router.get("/all-job", auth, getJobs);

router.put("/placements/:jobId", auth, updatePlacementOpportunity);
router.delete("/placements/:jobId", auth, deletePlacementOpportunity);
router.put("/apply/:jobId", auth, upload.single("file"), applyJobController);
router.get("/user-jobs", auth, appliedJobController);
router.get("/dashboard", auth, dashBoardController);
router.get("/departments", getAllDepartMentsController);
router.get("/download/:id", downloadFileController);

export default router;
