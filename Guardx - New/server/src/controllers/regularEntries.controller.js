import { RegularEntry } from "../models/regularEntry.model.js";

const addRegularEntry = async (req, res) => {
    const { name, email, mobile, gender, address, aadhaarNumber, entry,createdBy } =
    req.body;
  const files = req.files;

  if (
    !name ||
    !email ||
    !mobile ||
    !gender ||
    !address ||
    !aadhaarNumber ||
    !entry||
    !createdBy
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if(files.length<2){
    return res.status(400).json({ message: "Both User Profile & Proof Image Required" });
  }

  try {
    const isDuplicateEntry = await RegularEntry.findOne({
      $or: [
        { email: email },
        { mobile: mobile },
        { aadhaarNumber: aadhaarNumber },
      ],
    });

    if (isDuplicateEntry) {
      return res.status(404).json({
        message:
          "Duplicate Entry ! Regular Entry with this Credentials Already Exists",
      });
    }

    const newRegularEntry=new RegularEntry({...req.body})

    if (files) {
        if (files.regularProfileImage && files.regularProfileImage[0]) {
            newRegularEntry.regularProfileImage = files.regularProfileImage[0].path;
        }
        if (files.regularAadharImage && files.regularAadharImage[0]) {
            newRegularEntry.regularAadharImage = files.regularAadharImage[0].path;
        }
    }

    const response=await newRegularEntry.save();

    if(!response){
        return res.status(404).json({
            message:
              "Something Went Wrong while Adding Regular Entry",
          });
    }

    res.status(201).json({
        message:
          "Regular Entry Added Successfully",response
      });

  } catch (error) {
    console.log("Error while Adding Regular Entry", error);
    return res.status(500).json({
      message: "Internal server error while  Adding Regular Entry",
    });
  }
};

export { addRegularEntry };
