const user = require("../../Models/signUpSchema");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const uploadsDir = "./public/usersCsv";
const xlsx = require("xlsx");
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
const upload = multer({ storage: storage }).single("usersCsv");

exports.usersImportFormCsv = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: true, msg: "File upload failed" });
    } else if (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: true, msg: "Internal server error" });
    }

    try {
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (
        jsonArray.length === 0 ||
        jsonArray.every((row) =>
          Object.values(row).every((cell) => cell === "")
        )
      ) {
        return res
          .status(400)
          .json({ error: true, msg: "Excel file is empty" });
      }

      const createdBy = req.body.createdBy;
      const society_id = req.body.society_id;
      const defaultPermissionLevel = req.body.defaultPermissionLevel;
      const filteredJsonArray = jsonArray.filter(
        (entry) => entry.username && entry.password
      );
      // Check for existing usernames
      const usernames = filteredJsonArray.map((entry) => entry.username);
      const existingUsers = await user.find({ username: { $in: usernames } });

      if (existingUsers.length > 0) {
        const existingUsernamesCount = existingUsers.reduce((acc, user) => {
          acc[user.username] = (acc[user.username] || 0) + 1;
          return acc;
        }, {});

        return res.status(400).json({
          error: true,
          msg: "Usernames already exist",
          existingUsers: existingUsernamesCount,
        });
      }

      // Add additional fields
      const updatedJsonArray = filteredJsonArray.map((entry) => ({
        ...entry,
        createdBy,
        society_id,
        defaultPermissionLevel,
      }));
      try {
        const result = await user.insertMany(updatedJsonArray);
        return res.json({ msg: "Data added successfully", result });
      } catch (err) {
        console.error("Data insertion error:", err);
        return res
          .status(500)
          .json({ error: true, msg: "Data insertion failed" });
      }
    } catch (err) {
      console.error("File processing error:", err);
      return res
        .status(500)
        .json({ error: true, msg: "File processing failed" });
    }
  });
};
