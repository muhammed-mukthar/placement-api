import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  department: {
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
  applicants: {
    type: Array,
  },
});

export default mongoose.model("Job", jobSchema);
