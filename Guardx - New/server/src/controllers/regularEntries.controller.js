import { RegularEntry } from "../models/regularEntry.model.js";

const addRegularEntry = async (req, res) => {
  const {
    name,
    mobile,
    gender,
    address,
    aadhaarNumber,
    entry,
    createdBy,
    society,
  } = req.body;
  const files = req.files;

  if (
    !name ||
    !society ||
    !mobile ||
    !gender ||
    !address ||
    !aadhaarNumber ||
    !entry ||
    !createdBy
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (files.length < 2) {
    return res
      .status(400)
      .json({ message: "Both User Profile & Proof Image Required" });
  }

  try {
    const isDuplicateEntry = await RegularEntry.findOne({
      $or: [{ mobile: mobile }, { aadhaarNumber: aadhaarNumber }],
    });

    if (isDuplicateEntry) {
      return res.status(404).json({
        message:
          "Duplicate Entry ! Regular Entry with this Credentials Already Exists",
      });
    }

    const newRegularEntry = new RegularEntry({ ...req.body });

    if (files) {
      if (files.regularProfileImage && files.regularProfileImage[0]) {
        newRegularEntry.regularProfileImage = files.regularProfileImage[0].path;
      }
      if (files.regularAadharImage && files.regularAadharImage[0]) {
        newRegularEntry.regularAadharImage = files.regularAadharImage[0].path;
      }
    }

    const response = await newRegularEntry.save();

    if (!response) {
      return res.status(404).json({
        message: "Something Went Wrong while Adding Regular Entry",
      });
    }

    res.status(201).json({
      message: "Regular Entry Added Successfully",
      response,
    });
  } catch (error) {
    console.log("Error while Adding Regular Entry", error);
    return res.status(500).json({
      message: "Internal server error while  Adding Regular Entry",
    });
  }
};

const getSocietyRegularEntryById = async (req, res) => {
  const { society, entry } = req.body;
  
  if (!society || !entry) {
    return res
      .status(400)
      .json({ message: "Both Society Id & Entry Id Required" });
  }

  try {
    const response = await RegularEntry.find({
      entry,
      society,
    }).populate("entry");

    if (!response) {
      return res.status(404).json({
        message: "No regular Entry Found",
      });
    }

    res.status(200).json({ message: "Regular Entry List :", response });
  } catch (error) {
    console.log("Error while Getting Regular Entry", error);
    return res.status(500).json({
      message: "Internal server error while  Getting Regular Entry",
    });
  }
};

const removeRegularEntry = async (req, res) => {
  const regularEntryId = req.params.id;
  try {
    const response = await RegularEntry.findByIdAndDelete(regularEntryId);
    if (!response) {
      return res.status(404).json({
        message: "Something went wrong while removing Regular entry",
      });
    }

    res.status(200).json({ message: "Regular Entry Removed !" });
  } catch (error) {
    console.log("Error while removing Regular Entry", error);
    return res.status(500).json({
      message: "Internal server error while  removing Regular Entry",
    });
  }
};

const editRegularEntry = async (req, res) => {
  const {
    name,
    mobile,
    gender,
    address,
    aadhaarNumber,
    regularEntry,
    updatedBy,
  } = req.body;
  const files = req.files;
  if (
    !name ||
    !mobile ||
    !gender ||
    !address ||
    !aadhaarNumber ||
    !regularEntry ||
    !updatedBy
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const isDuplicateEntry = await RegularEntry.findOne({
      _id: { $ne: regularEntry },
      $or: [{ mobile: mobile }, { aadhaarNumber: aadhaarNumber }],
    });

    if (isDuplicateEntry) {
      return res.status(404).json({
        message: "Duplicate Entry ! User with this Credentials Already Exists",
      });
    }
    const response = await RegularEntry.findByIdAndUpdate(
      regularEntry,
      { ...req.body },
      { new: true }
    );

    if (!response) {
      return res
        .status(404)
        .json({ message: "No House Record Found to Update" });
    }
    if (files) {
      if (files.regularProfileImage && files.regularProfileImage[0]) {
        fs.unlink(response.ownerImage, (err) => {
          if (err) {
            console.error("Failed to delete the old icon: ", err);
          } else {
            console.log("Old icon deleted successfully");
          }
        });
        response.regularProfileImage = files.regularProfileImage[0].path;
      }
      if (files.regularAadharImage && files.regularAadharImage[0]) {
        fs.unlink(response.aadhaarImage, (err) => {
          if (err) {
            console.error("Failed to delete the old icon: ", err);
          } else {
            console.log("Old icon deleted successfully");
          }
        });
        response.regularAadharImage = files.regularAadharImage[0].path;
      }
    }

    await response.save();
    res.json({ message: "Regular Entry Updated" });
  } catch (error) {
    console.log("Error while updating Regular Entry ", error);
    return res
      .status(500)
      .json({ message: "Internal server error while updating Regular Entry " });
  }
};

export {
  addRegularEntry,
  getSocietyRegularEntryById,
  removeRegularEntry,
  editRegularEntry,
};
