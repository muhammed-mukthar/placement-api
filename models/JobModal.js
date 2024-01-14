import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  typeBadgeColor: {
    type: String,
    required: true,
  },
  postedDate: {
    type: String,
    required: true,
  },
  lastDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  statusBadgeColor: {
    type: String,
    required: true,
  },
  applicants: {
    type: Array,
  },
});

export default mongoose.model("Job", jobSchema);
