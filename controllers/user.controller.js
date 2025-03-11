import { Webhook } from "svix";
import userModel from "../models/user.model.js";

// api controller function to manage clerk user with database
const clerkWebhooks = async (req, res) => {
  try {
    const { data, type } = req.body;
    console.log(data, type);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    });
    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        const user = await userModel.create(userData);
        res.status(201).json({
          message: "User created successfully",
          success: true,
          data: user,
        });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        const user = await userModel.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { new: true }
        );
        res.status(200).json({
          message: "User updated successfully",
          success: true,
          data: user,
        });
        break;
      }
      case "user.deleted": {
        const user = await userModel.findOneAndDelete({ clerkId: data.id });
        res.status(200).json({
          message: "User deleted successfully",
          success: true,
          data: user,
        });
        break;
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
      success: false,
    });
  }
};
// api controller function to get user available credits
const getUserCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    const user = await userModel.findOne({
      clerkId,
    });
    res.status(200).json({
      message: "User credits fetched successfully",
      success: true,
      credits: user.creditBalance,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
      success: false,
    });
  }
};

const userControllers = {
  clerkWebhooks,
  getUserCredits,
};

export default userControllers;
