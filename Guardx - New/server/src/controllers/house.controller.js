import { House } from "../models/house.model.js";
import fs from "fs";
import { transporter } from "../utils/NodeMailer.js";
import { generateRandomPassword } from "../utils/GenrateRandomPass.js";
const registerHouse = async (req, res) => {
  const { email, mobile, password } = req.body;
  const files = req.files;

  if (!email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists by email or mobile
    const isUserExisted = await House.findOne({ email });
    if (isUserExisted) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const isMobileExisted = await House.findOne({ mobile });
    if (isMobileExisted) {
      return res
        .status(400)
        .json({ message: "User with this mobile already exists" });
    }

    // Create user without files
    const newUser = new House({ ...req.body });
    const response = await newUser.save();

    res.status(201).json(response);
  } catch (error) {
    console.log("Error while registering user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addHouseByAdmin = async (req, res) => {
  const { houseNo, blockNo, createdBy, society } = req.body;

  if (!houseNo || !blockNo) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const checkHouseExist = await House.findOne({
      houseNo,
      blockNo,
      society,
    });

    if (checkHouseExist) {
      return res
        .status(400)
        .json({ message: "House No of Block already assigned" });
    }

    const payload = {
      ...req.body,
    };

    const response = await House.create(payload);
    if (!response) {
      return res
        .status(400)
        .json({ message: "Something went wrong while adding House" });
    }

    res.status(201).json({ message: "House Successfully Added..!" });
  } catch (error) {
    console.log("Error while registering user adding House", error);
    return res
      .status(500)
      .json({ message: "Internal server error while adding House" });
  }
};

const getHouseListBySocietyId = async (req, res) => {
  const societyId = req.params.id;

  try {
    const response = await House.find({ society: societyId });
    if (!response) {
      return res.status(400).json({ message: "Empty Houslist" });
    }

    res.status(200).json({ message: "Society List : ", response });
  } catch (error) {
    console.log("Error while registering user Getting House List", error);
    return res
      .status(500)
      .json({ message: "Internal server error while getting House List" });
  }
};

const handleApprovalStatus = async (req, res) => {
  const { houseId, approvalStatus } = req.body;

  if (!houseId || !approvalStatus) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    const house = await House.findById(houseId).populate("society");
    // console.log("house", house);

    if (approvalStatus === "Approved") {
      if (
        !house.email ||
        !house.mobile ||
        !house.aadhaarNumber ||
        !house.aadhaarImage
      ) {
        return res
          .status(404)
          .json({ message: "House Owner KYC required, Incomplete Profile" });
      }
    } 
    if (approvalStatus === "Rejected") {
      house.approvalStatus = approvalStatus;
      const status = house.save();
      return res
          .status(200)
          .json({ message: "House Application, Rejected !" });
    }


    if (!house) {
      return res.status(404).json({ message: "No House Record Found" });
    }

    house.approvalStatus = approvalStatus;
    
    const status = house.save();
    if (status) {
      try {
        if (!house.email) {
          return res.status(400).json({ message: "Owner Email not found" });
        }

        const password = await generateRandomPassword();
        // console.log("pass", password);
        const societyName = house.society.name.toUpperCase();
        const societyCity = house.society.city.toUpperCase();
        const emailText = ` <div class="container">
            <h1>Dear ${house.ownerName},</h1>
            <p>Thank you for choosing us!</p>
            <p>We are pleased to inform you that your request to join the <b>${societyName},${societyCity} </b>at GuardX online portal has been successfully accepted by the Society Admin.</p>
            <p><b>Username : <b> ${house.email} / ${house.mobile} </p>
            <p><b>Your System Genrated Password is ${password} please Reset Password if Required<b></p>
            <p>You can now enjoy access to all the features and services provided through our portal, including:</p>
            <p>Viewing notices and announcements</p>
            <p>Managing your house and visitor details</p>
            <p>Staying connected with your society members</p>
<br><br><p>Thank you for your cooperation!</p>  
            <footer>
                Best regards,<br>
               GuradX-Securities
            </footer>
        </div>`;

        const info = await transporter.sendMail({
          from: '"Ajay Sood" <cathryn5@ethereal.email>', // sender address
          to: house.email, // list of receivers
          subject: "Your Request to Join Society Portal Has Been Accepted 🎉", // Subject line
          // text: text, // plain text body
          html: emailText, // html body
        });
        house.password = password;
        await house.save();

        console.log("Message sent: %s", info.messageId);
        if(info.messageId){
          res.status(200).json({ message: "Status Approved,Email with user password sent to house Owner " });
        }
      } catch (error) {
        console.log("node mail error", error);
        res.status(500).json({ message: "Approved Email genration faild " });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Something went Wrong while  Updated Status..!" });
    }
  } catch (error) {
    console.log("Error while updating approval Status House List", error);
    return res.status(500).json({
      message:
        "Internal server error while updating approval Status House List",
    });
  }
};

const removeHouse = async (req, res) => {
  const houseId = req.params.id;

  try {
    const response = await House.findByIdAndDelete(houseId);
    if (!response) {
      return res
        .status(404)
        .json({ message: "Something Went wrong while Removing house" });
    }

    res.status(200).json({ message: "House record removed !" });
  } catch (error) {
    console.log("Error while Removing House ", error);
    return res
      .status(500)
      .json({ message: "Internal server error while Removing House " });
  }
};

const editHouse = async (req, res) => {
  const { email, mobile, ownerName, houseNo, blockNo, aadhaarNumber, houseId } =
    req.body;
  const files = req.files;
  // console.log("files", req.body, files);

  if (
    !email ||
    !mobile ||
    !ownerName ||
    !houseNo ||
    !blockNo ||
    !aadhaarNumber ||
    !houseId
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const isDuplicateEntry = await House.findOne({
      _id: { $ne: houseId },
      $or: [
        { email: email },
        { mobile: mobile },
        { aadhaarNumber: aadhaarNumber },
      ],
    });

    if (isDuplicateEntry) {
      return res.status(404).json({
        message: "Duplicate Entry ! User with this Credentials Already Exists",
      });
    }
    const response = await House.findByIdAndUpdate(
      houseId,
      { ...req.body },
      { new: true }
    );

    if (!response) {
      return res
        .status(404)
        .json({ message: "No House Record Found to Update" });
    }
    if (files) {
      if (files.ownerImage && files.ownerImage[0]) {
        // fs.unlink(response.ownerImage, (err) => {
        //   if (err) {
        //     console.error("Failed to delete the old icon: ", err);
        //   } else {
        //     console.log("Old icon deleted successfully");
        //   }
        // });
        response.ownerImage = files.ownerImage[0].path;
      }
      if (files.aadhaarImage && files.aadhaarImage[0]) {
        // fs.unlink(response.aadhaarImage, (err) => {
        //   if (err) {
        //     console.error("Failed to delete the old icon: ", err);
        //   } else {
        //     console.log("Old icon deleted successfully");
        //   }
        // });
        response.aadhaarImage = files.aadhaarImage[0].path;
      }
      if (files.vehicleImage && files.vehicleImage[0]) {
        // fs.unlink(response.aadhaarImage, (err) => {
        //   if (err) {
        //     console.error("Failed to delete the old icon: ", err);
        //   } else {
        //     console.log("Old icon deleted successfully");
        //   }
        // });
        response.vehicles.push({
          vehicleType: req?.body?.vehicleType || "",
          vehicleNumber: req?.body?.vehicleNumber || "",
          vehicleImage: files.vehicleImage[0].path,
        });
      }
    }

    await response.save();
    res.json({ message: "house Updated" });
  } catch (error) {
    console.log("Error while updating House ", error);
    return res
      .status(500)
      .json({ message: "Internal server error while updating House " });
  }
};

const removeHouseVehicle = async (req, res) => {
  const { houseId, vehicleId } = req.body;
  // console.log(req.body);

  await House.updateOne(
    { _id: houseId },
    { $pull: { vehicles: { _id: vehicleId } } } // Pulls the matching vehicle by its _id
  )
    .then((result) => {
      console.log("Vehicle removed:", result);
      res.status(200).json({ message: "Vehicle Removed Succesfully" });
    })
    .catch((error) => {
      console.error("Error removing vehicle:", error);
      res
        .status(500)
        .json({ message: "Something Went Wrong While Removing Vehcile" });
    });
};
export {
  registerHouse,
  addHouseByAdmin,
  getHouseListBySocietyId,
  handleApprovalStatus,
  removeHouse,
  editHouse,
  removeHouseVehicle,
};
