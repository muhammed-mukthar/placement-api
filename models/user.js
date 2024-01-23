import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: "student" },
  departmentId: {
    type: String,
  },
  isApproved: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
