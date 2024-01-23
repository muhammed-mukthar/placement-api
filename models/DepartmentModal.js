import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
  title: String,
});

var Department = mongoose.model("Department", departmentSchema);

export default Department;
