import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(404).json({ message: "un authorized access" });
    }

    const isCustomAuth = token?.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      let userData = await UserModal.findOne({ _id: decodedData?.id });
      console.log(decodedData, userData);
      console.log(userData);
      req.user = userData;
    } else {
      decodedData = jwt.decode(token);
      let userData = await UserModal.findOne({ _id: decodedData?.id });
      console.log(decodedData, userData);
      console.log(userData);

      req.user = userData;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
