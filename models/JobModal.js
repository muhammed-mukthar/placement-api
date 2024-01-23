import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  departmentId: {
    type: String,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  experience: {
    type: String,
  },
  position: {
    type: Number,
  },
  type: {
    type: String,
  },
  typeBadgeColor: {
    type: String,
  },
  postedDate: {
    type: String,
  },
  lastDate: {
    type: String,
  },
  status: {
    type: String,
    default: "Open",
  },
  statusBadgeColor: {
    type: String,
  },
  applicants: {
    type: Array,
  },
});

export default mongoose.model("Job", jobSchema);
