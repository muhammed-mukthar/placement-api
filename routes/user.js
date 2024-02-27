import express from "express";
const router = express.Router();

import {
  AdminCreateUser,
  approveUser,
  employeeSignup,
  getAllEmployees,
  getAllPendingUsers,
  getAllUsers,
  signin,
  signup,
  updateUserInfo,
} from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/employee-signup", employeeSignup);
router.post("/admin/create-user", AdminCreateUser);
router.post("/approve/:id", approveUser);
router.get("/users", getAllUsers);
router.get("/employees", getAllEmployees);
router.put("/:id", updateUserInfo);
router.get("/pending-users", getAllPendingUsers);

export default router;
