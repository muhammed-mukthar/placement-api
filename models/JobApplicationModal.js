import mongoose from "mongoose";

const JobApplicationModalSchema = new mongoose.Schema({
  jobId: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
  },
  resume: {
    type: String,
  },
  createdUser: {
    type: String,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("JobApplicationModal", JobApplicationModalSchema);
