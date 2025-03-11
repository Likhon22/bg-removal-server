import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/user.model.js";

const removeBgImage = async (req, res) => {
  try {
    const { clerkId } = req.body;
    console.log(clerkId);

    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        creditBalance: user.creditBalance,
      });
    }
    if (user.creditBalance <= 0) {
      return res.status(400).json({
        message: "Insufficient credits",
        success: false,
      });
    }
    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);
    const formData = new FormData();
    formData.append("image_file", imageFile);
    

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIP_DROP_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    const base64 = Buffer.from(data, "binary").toString("base64");
    const resultImg = `data:${req.file.mimetype};base64,${base64}`;
    await userModel.findByIdAndUpdate(user?.id, {
      creditBalance: user.creditBalance - 1,
    });
    res.status(200).json({
      message: "Image background removed successfully",
      success: true,
      resultImg,
      creditBalance: user.creditBalance - 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const imageControllers = {
  removeBgImage,
};
export default imageControllers;
