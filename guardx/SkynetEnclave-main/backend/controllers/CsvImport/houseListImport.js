const user = require("../../Models/houseSchema");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uploadsDir = "./public/houseCsv";
const csv = require("csvtojson");
fs.ensureDirSync(uploadsDir);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const newFileName = "icon-" + Date.now() + extension;
    cb(null, newFileName);
  },
});
const upload = multer({ storage: storage }).single("houseCsv");
exports.houseListImportFormCsv = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error handling
      console.error("Multer error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    } else if (err) {
      // Other unexpected errors
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: true, msg: "Internal server error" });
    }
    try {
      const filePath = await path.join(uploadsDir, req.file.filename);
      const jsonArray = await csv().fromFile(filePath);

      // Check if the CSV contains only headers and no data
      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res.status(400).json({ error: true, msg: "CSV file is empty" });
      }

      // Add parentId to each entry
      const createdBy = req.body.createdBy;
      const society_id = req.body.society_id;
      const updatedJsonArray = jsonArray.map((entry) => ({
        ...entry,
        createdBy,
        society_id,
      }));
      // Extract all usernames from the CSV file
      const usernames = updatedJsonArray.map((entry) => entry.username);
      const userPhoneNos = updatedJsonArray.map((entry) => entry.userPhoneNo);
      // Check if any of these usernames already exist in the database
      const existingUsers = await user.find({ username: { $in: usernames } });
      const existingUsersPhonNo = await user.find({
        userPhoneNo: { $in: userPhoneNos },
      });
      if (existingUsersPhonNo.length > 0) {
        return res.status(400).json({
          error: true,
          msg: `Phone number already exist`,
        });
      }
      else if (existingUsers.length > 0) {
        const existingUsernames = existingUsers.map((u) => u.username);
        return res.status(400).json({
          error: true,
          msg: `Username already exist`,
          exist: existingUsernames,
        });
      }

      try {
        const result = await user.insertMany(updatedJsonArray);
        return res.json({ msg: "Data added successfully", result });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: true, msg: "Data insertion failed" });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: true, msg: "CSV processing failed" });
    }
  });
};
