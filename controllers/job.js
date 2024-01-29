import express from "express";
import mongoose from "mongoose";
import JobModal from "../models/JobModal.js";
import UserModal from "../models/user.js";
import DepartmentModal from "../models/DepartmentModal.js";

const router = express.Router();
export const createJob = async (req, res) => {
  try {
    const newJob = new JobModal(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePlacementOpportunity = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedJob = await JobModal.findByIdAndUpdate(
      jobId,
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const allJobs = await JobModal.find();
    res.status(201).json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePlacementOpportunity = async (req, res) => {
  try {
    const { jobId } = req.params;
    const deletedJob = await JobModal.findByIdAndRemove(jobId);
    res.json(deletedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const applyJobController = async (req, res) => {
  try {
    const User = req.user;
    const { jobId } = req.params;
    const updatedJob = await JobModal.findByIdAndUpdate(
      jobId,
      {
        $addToSet: {
          applicants: User?._id,
        },
      },
      {
        new: true,
      }
    );
    res.json({ updatedJob: updatedJob, applied: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const appliedJobController = async (req, res) => {
  try {
    const User = req.user;
    // Find jobs where the applicants array includes the user's _id
    const allJobs = await JobModal.find({
      applicants: { $in: [User._id] },
    });
    res.json({ allJobs: allJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const dashBoardController = async (req, res) => {
  try {
    const User = req.user;
    // Find jobs where the applicants array includes the user's _id
    const totalJobs = await JobModal.count();
    const totalStudents = await UserModal.count({
      role: "student",
    });
    const totalPlacementOfficer = await JobModal.count({
      role: "employee",
    });

    let data = { totalJobs, totalPlacementOfficer, totalStudents };
    res.json({ data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllDepartMentsController = async (req, res) => {
  try {
    // Find jobs where the applicants array includes the user's _id
    const departments = await DepartmentModal.find();
    res.json({ data: departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default router;
