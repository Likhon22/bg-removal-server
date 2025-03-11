import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }
    const decoded = jwt.decode(token);
    req.body.clerkId = decoded.clerkId;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export default authUser;