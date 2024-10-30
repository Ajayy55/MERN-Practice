const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/UserImages"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Initialize multer upload with configuration
const upload = multer({
  storage: storage,
});

// const upload = multer({ dest: 'uploads/' });
const { nonVerified } = require("../controllers/nonVerfiedApi");
const { verified } = require("../controllers/VerifiedApi");
const { getNonVerifiedData } = require("../controllers/getNonVerfied");
const { delUser } = require("../controllers/delUser");
const {
  signUp,
  getSignUpUser,
  signUpUserDelete,
  getEditData,
  editSignUpUser,
  editUser,
  deactivateUser,
  approveDeactivation,
  requestDeactivation,
} = require("../controllers/signUp");
const { login } = require("../controllers/loginUser");
const { userEntry, addMultiEntries } = require("../controllers/userEntries");
const { getUserEnties } = require("../controllers/getUserEnties");
const {
  nonVerifiedUserPurpose,
  updatePurpose,
  getUpdatePurpose,
  delPurposeDataByAdmin,
  delPurposeBySuperAdmin,
  delPurposeByAdmin,
} = require("../controllers/nonVerifiedUserPurpose");
const {
  getUserNonVerfiedPrupose,
} = require("../controllers/getUserNonverfiedPurpose");
const { getHouseDetails } = require("../controllers/getHouseDetails");
const {
  houseDetails,
  addHouseOwner,
  deleteVehicleByIndex,
  addHouseOwnerBySocietyAdmin,
  addHouseOwnerByHouseOwner,
  approveHouseOwnerBySocietyAdmin,
} = require("../controllers/houseNo");
const { verifyHouseMaid } = require("../controllers/verifiedUser");
const {
  getVerifyHouseMaid,
  getAllVerifyHouseMaid,
} = require("../controllers/getVerfiedUserData");
const {
  editEntry,
  delEntryByAdmin,
  delEntryBySuperAdmin,
} = require("../controllers/updateEntries");
const { updateEntry } = require("../controllers/updateEntries");
const { delEntry } = require("../controllers/updateEntries");
const {
  getMaidEntry,
  deleteMaidEntry,
} = require("../controllers/getEntryMaid");

const {
  delHouseMaid,
  updateHouseMaidImages,
  getHouseMaid,
  deleteImage,
  updateHouseMaidData,
} = require("../controllers/crudHouseMaid");

const { getPreviewImageData } = require("../controllers/getPreviewImage");
const {
  getHouseDetailsToEdit,
  updateHouseDetails,
  delHouseDetails,
} = require("../controllers/editHouseDetails");
// Society Curd
const {
  addSociety,
  getSocietyData,
  delSociety,
  userWithSociety,
  getSocietyDetailsWithId,
  deleteSocietyUserImagesWithId,
  updateSocietyImagesWithId,
  updateSocietyDeatilsWithId,
  updateSocietyLogoById,
} = require("../controllers/societyCurd");
const { translationGoogleApi } = require("../controllers/translationApi");
//role
const { createRole } = require("../controllers/roleCurd/roleCreate");
const { getRole } = require("../controllers/roleCurd/roleGet");
const { deleteRole } = require("../controllers/roleCurd/roleDelete");
const { roleGetEdit } = require("../controllers/roleCurd/roleGetEdit");
const { editRole } = require("../controllers/roleCurd/roleEdit");
const {
  userWithSocietyUnion,
  userWithSocietyUnionDelete,
  getEditWithSocietyUnion,
  editWithSocietyUnion,
  userWithSocietyUnionLogin,
} = require("../controllers/userWithSociety/userUnionSociety");
const { userLogout, getGuard } = require("../controllers/userLogout");
const { guardInOut, getGuardInOut } = require("../controllers/userLogin");
const { editSettingimage } = require("../controllers/editSettingImage");
const {
  editAdminimage,
  editSuperAdminimage,
} = require("../controllers/editadminImage");
const {
  entriesImportFormCsv,
  entriesImportFormCsvBySuperAdmin,
} = require("../controllers/CsvImport/entryImport");
const { translate } = require("../controllers/translate");
const {
  purposeImportFormCsv,
  purposeImportFormCsvBySuperAdmin,
} = require("../controllers/CsvImport/purposeImport");
const { nonverifyClockOut } = require("../controllers/nonVerifyClockOut");
const { usersImportFormCsv } = require("../controllers/CsvImport/usersImport");
const {
  houseListImportFormCsv,
} = require("../controllers/CsvImport/houseListImport");
const {
  societyListImportFormCsv,
} = require("../controllers/CsvImport/societyImport");
const {
  regularEntriesImportFormCsv,
} = require("../controllers/CsvImport/regularEntriesImport");

// Announcement
const {
  addAnnouncement,
} = require("../controllers/announcement/addAnnouncement");
const {
  getAnnouncement,
} = require("../controllers/announcement/getAnnouncement");
const {
  deleteAnnouncement,
} = require("../controllers/announcement/deleteAnnouncement");
const {
  editAnnouncement,
} = require("../controllers/announcement/editAnnouncement");
const { societyMediaUpload } = require("../controllers/societyMediaUpload/addSocietyMediaUpload");
const { societyDocumentsUpload } = require("../controllers/societyDocumentsUpload/scoietyDocumentsUpload");
const { deleteSocietyMedia, deleteSocietyDocuments } = require("../controllers/societyMediaUpload/deleteSocietyMedia");
// verifieduser
router.post("/nonVerified", nonVerified);
router.post("/verified", verified);
router.get("/getData", getNonVerifiedData);
router.delete("/delUser/:id", delUser);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/entries", userEntry);
router.get("/getEntries", getUserEnties);
router.post("/nonVerifiedPurpose", nonVerifiedUserPurpose);
router.post("/houseDetails", houseDetails);
router.get("/getHouseDetails", getHouseDetails);
router.post("/verifieduser", verifyHouseMaid);
router.get("/getVerifieUser/:paramsId", getVerifyHouseMaid);
router.get("/editEntry/:id", editEntry);
router.put("/editEntry/:id", updateEntry);
router.delete("/delEntryByAdmin/:id", delEntryByAdmin);
router.delete("/delEntryBySuperAdmin/:id", delEntryBySuperAdmin);
router.put("/updatePurpose/:id", updatePurpose);
router.get("/getUserNonVerfiedPrupose", getUserNonVerfiedPrupose);
router.get("/getUpdatePurpose/:id", getUpdatePurpose);
router.delete("/delPurposeDataByAdmin/:id", delPurposeByAdmin);
router.delete("/delPurposeBySuperAdmin/:id", delPurposeBySuperAdmin);
router.get("/getPreviewImageData/:id", getPreviewImageData);
router.get("/getMaidEntry", getMaidEntry);
router.delete("/deleteHouseMaidEntry/:id", deleteMaidEntry);
router.get("/houseDetailsUpdate/:id", getHouseDetailsToEdit);
router.put("/houseDetailsUpdate/:id", updateHouseDetails);
router.delete("/deleteHouseDetails/:id", delHouseDetails);
router.delete("/delHouseMaid/:id", delHouseMaid);
router.put("/updateHouseMaid/:id", updateHouseMaidImages);
router.put("/updateHouseMaidData/:id", updateHouseMaidData);
router.get("/updateHouseMaid/:id", getHouseMaid);
router.put("/delete-images/:id", deleteImage);
router.post("/translationApi", translationGoogleApi);
//create Society
router.post("/addSociety", addSociety);
//Get Society Data
router.get("/getSocietyData", getSocietyData);
//Delete Society Data
router.delete("/delSociety/:id", delSociety);
//Get Society Deatils With Id
router.get("/getSocietyDetailsWithId/:id", getSocietyDetailsWithId);
//deleteSocietyUserImagesWithId
router.put("/deleteSocietyUserImagesWithId/:id", deleteSocietyUserImagesWithId);
//updateSocietyImagesWithId
router.put("/updateSocietyImagesWithId/:id", updateSocietyImagesWithId);
router.put("/updateSocietyDeatilsWithId/:id", updateSocietyDeatilsWithId);
//create role
router.post("/roleCreate", createRole);
//get role
router.get("/roleGet", getRole);
router.delete("/deleteRole/:id", deleteRole);
router.get("/getEditRole/:id", roleGetEdit);
router.put("/editRole/:id", editRole);
//GetSignUpUser
router.get("/getSignUpUser", getSignUpUser);
//deleteSignUpUser
router.delete("/deleteSignUpUser/:id", signUpUserDelete);
//getEditUser
router.get("/getEditUser/:id", getEditData);
//editSignUpUser
router.put("/editSignUpUser/:id", editSignUpUser);
router.get("/userWithSociety", userWithSociety);
router.get("/getUserWithSocietyUser", userWithSocietyUnion);
router.delete("/deleteUserWithSocietyUser/:id", userWithSocietyUnionDelete);
router.get("/getEditWithSocietyUnion/:id", getEditWithSocietyUnion);
router.put("/editWithSocietyUnion/:id", editWithSocietyUnion);
router.post("/userWithSocietyUnionLogin", userWithSocietyUnionLogin);
router.post("/guardLogout", userLogout);
router.post("/guardLogin", guardInOut);
router.get("/getGuard", getGuard);
router.put(
  "/editImageGuard/:id",
  upload.single("Ownerimage"),
  editSettingimage
);
router.get("/getGuardInOut", getGuardInOut);
router.put("/editAdminimage/:id", upload.single("Ownerimage"), editAdminimage);
router.put(
  "/editSuperAdminimage/:id",
  upload.single("superAdminPhoto"),
  editSuperAdminimage
);
//Import entries fro CSV
router.post("/entriesImportFormCsv", entriesImportFormCsv);
router.post(
  "/entriesImportFormCsvBySuperAdmin",
  entriesImportFormCsvBySuperAdmin
);
router.post("/purposeImportFormCsv", purposeImportFormCsv);
router.post(
  "/purposeImportFormCsvBySuperAdmin",
  purposeImportFormCsvBySuperAdmin
);
//nonverifyClockOut
router.post("/nonverifyClockOut/:id", nonverifyClockOut);
//getAllVerifyHouseMaid
router.get("/getAllVerifyHouseMaid", getAllVerifyHouseMaid);
//Import Users
router.post("/usersImportFormCsv", usersImportFormCsv);
//Import HouseList
router.post("/houseListImportFormCsv", houseListImportFormCsv);
//Import Society List
router.post("/societyListImportFormCsv", societyListImportFormCsv);
//Import Regular User
router.post("/regularListImportFormCsv", regularEntriesImportFormCsv);
router.post("/addMultiEntries", addMultiEntries);
//Updated Society Logo
router.put("/updatedSocietyLogo/:id", updateSocietyLogoById);
// add Announcement
router.post("/addAnnouncement", addAnnouncement);
//get Announcement
router.get("/getAnnouncement", getAnnouncement);
//delete Announcement
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);
//edit Announcement
router.put("/editAnnouncement/:id", editAnnouncement);
//edit SignUp User
router.put("/editUser/:id", editUser);
router.post("/addHouseOwner/:id", addHouseOwnerBySocietyAdmin);
// deleteVehicleByIndex
router.delete("/deleteVehicle/:ownerId/:vehicleIndex", deleteVehicleByIndex);
// Upload Society Media
router.post("/societyMediaUpload/:id",societyMediaUpload)
// Upload Society Documents
router.post("/societyDocumentsUpload/:id",societyDocumentsUpload)
 //Delete Society Media
 router.delete("/deleteSocietyMedia/:societyId/:mediaId",deleteSocietyMedia)
 //Delete Society Documents
 router.delete("/deleteSocietyDocuments/:societyId/:mediaId",deleteSocietyDocuments)
 //Add houseOwnerByHouseOwner
 router.post("/addHouseOwnerByHouseOwner",addHouseOwnerByHouseOwner)
 // Approved House Owner By Society Admin
 router.post("/approveHouseOwnerBySocietyAdmin",approveHouseOwnerBySocietyAdmin)
 //approveDeactivation
 router.post("/approveDeactivation",approveDeactivation)
 //requestDeactivation
 router.post("/requestDeactivation",requestDeactivation)
module.exports = router;
