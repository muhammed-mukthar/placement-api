import express from "express";
import mongoose from "mongoose";
import JobModal from "../models/JobModal.js";
import UserModal from "../models/user.js";
import DepartmentModal from "../models/DepartmentModal.js";
import JobApplicationModal from "../models/JobApplicationModal.js";

const router = express.Router();
export const createJob = async (req, res) => {
  try {
    const User = req.user;

    const newJob = new JobModal({
      ...req.body,
      department: User.department,
      createdUser: User._id,
    });
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
    const User = req.user;
    const searchTerm = req.query.search || ""; // Get the search term from query params

    // Construct the query to filter by department and job title
    const query = {
      department: User.department,
      $or: [
        { jobTitle: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search by job title
      ],
      status: "Open",
      applicants: { $nin: [User._id] }, // Exclude jobs where user's _id is in applicants array
    };

    const allJobs = await JobModal.find(query);
    res.status(200).json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllEmployerController = async (req, res) => {
  try {
    const User = req.user;
    const searchTerm = req.query.search || ""; // Get the search term from query params

    // Construct the query to filter by department and job title
    const query = {
      createdUser: User._id,
    };

    const allJobs = await JobModal.find(query);
    res.status(200).json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deletePlacementOpportunity = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId, "sfd");
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

    const newJob = new JobApplicationModal({
      ...req.body,
      resume: req.file.path,
      createdUser: User?._id,
    });
    const savedJob = await newJob.save();
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

export const downloadFileController = async (req, res) => {
  try {
    const file = await JobApplicationModal.findById(req.params.id).lean();
    res.download(file.resume);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const getAllAppliedUsersController = async (req, res) => {
  try {
    let jobId = req.params.id;
    const data = await JobApplicationModal.find({ jobId: jobId });
    res.json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const selectApplicantController = async (req, res) => {
  try {
    let jobId = req.body.jobId;
    let jobApplicantId = req.body._id;
    console.log(req.body, "req.body");
    const User = req.user;

    const data = await JobApplicationModal.findOneAndUpdate(
      {
        _id: jobApplicantId,
      },
      {
        $set: {
          selected: true,
        },
      }
    );
    const update = await JobModal.findOneAndUpdate(
      {
        _id: jobId,
      },
      {
        $set: {
          selectedUser: User?._id,
          status: "Closed",
        },
      }
    );

    res.json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
export default router;
