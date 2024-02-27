import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
import Job from "../models/JobModal.js";

const secret = "test";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email }).lean();

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    if (oldUser.role == "student") {
      if (!oldUser.isApproved) {
        return res.status(400).json({ message: "Admin hasn't approved you " });
      }
    }
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1D",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, name, department } = req.body;
  console.log(req.body);
  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name,
      department,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ success: true, result, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });

    console.log(error);
  }
};

export const employeeSignup = async (req, res) => {
  const { email, password, name, department } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name,
      department,
      role: "employee",
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1D",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
export const AdminCreateUser = async (req, res) => {
  const { email, password, name, department, role } = req.body;
  console.log(req.body, password, name, "this ");
  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(hashedPassword, "has");
    const result = await UserModal.create({
      email,
      password: hashedPassword,
      name,
      department,
      isApproved: true,
      role,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1D",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const oldUser = await UserModal.findOne({ _id: id });

    if (!oldUser)
      return res.status(400).json({ message: "User doesn't exist" });

    let result = await UserModal.updateOne(
      { _id: id },
      {
        $set: {
          isApproved: true,
        },
      }
    );
    let users = await UserModal.find({ role: "student" });
    res.status(201).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModal.find();

    res.status(201).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const getAllPendingUsers = async (req, res) => {
  try {
    const allUsers = await UserModal.find({ isApproved: false });

    res.status(201).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
export const getAllEmployees = async (req, res) => {
  try {
    const allUsers = await UserModal.find({ role: "employee" });

    res.status(201).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await UserModal.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );
    res.json({ user: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
