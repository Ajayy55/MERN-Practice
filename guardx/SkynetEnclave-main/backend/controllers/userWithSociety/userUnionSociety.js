const SignUser = require("../../Models/signUpSchema");
const SocietyUser = require("../../Models/societySchema");
const HouseListUser = require("../../Models/houseSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.userWithSocietyUnion = async (req, res) => {
  try {
    const signUsers = await SignUser.find().exec();
    const societyUsers = await SocietyUser.find().exec();

    const combinedData = [...signUsers, ...societyUsers];

    res.status(200).send({ data: combinedData });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// Delete Both User and Society User
exports.userWithSocietyUnionDelete = async (req, res) => {
  const { id } = req.params;
  try {
    // Attempt to delete from SignUser collection
    const signUserResult = await SignUser.findByIdAndDelete(id).exec();
    if (signUserResult) {
      return res.status(200).send({
        message: "User deleted from SignUser collection",
        data: signUserResult,
      });
    }
    const societyUserResult = await SocietyUser.findByIdAndDelete(id).exec();
    if (societyUserResult) {
      return res.status(200).send({
        message: "User deleted from SocietyUser collection",
        data: societyUserResult,
      });
    }
    res.status(404).send({ message: "User not found" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// Get Both User and Society User
exports.getEditWithSocietyUnion = async (req, res) => {
  try {
    const id = req.params.id;

    const signUsers = await SignUser.find({ _id: id }).exec();
    const societyUsers = await SocietyUser.find({ _id: id }).exec();

    const combinedData = [...signUsers, ...societyUsers];

    res.status(200).send({ data: combinedData });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// Edit Api With User And Society Data Both Users
exports.editWithSocietyUnion = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, userPhoneNo, ...newData } = req.body;
    const existingUserByUsername = await SignUser.findOne({
      _id: { $ne: id },
      username: username,
    });

    const existingUserByPhoneNo = await SignUser.findOne({
      _id: { $ne: id },
      userPhoneNo: userPhoneNo,
    });
    let conflictField = "";

    if (existingUserByUsername && existingUserByPhoneNo) {
      conflictField = "Both Username and Phone Number";
    } else if (existingUserByUsername) {
      conflictField = "Username";
    } else if (existingUserByPhoneNo) {
      conflictField = "Phone Number";
    }
    if (conflictField) {
      return res.status(400).send({
        message: `${conflictField} already exists. Please choose another.`,
      });
    }
    const updatedSignUser = await SignUser.findOneAndUpdate(
      { _id: id },
      { username, userPhoneNo, ...newData },
      { new: true }
    ).exec();
    const updatedSocietyUser = await SocietyUser.findOneAndUpdate(
      { _id: id },
      { username, userPhoneNo, ...newData },
      { new: true }
    ).exec();

    res.status(200).send({
      message: "Data updated successfully.",
      updatedSocietyUser: updatedSocietyUser,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// Edit With SignUpUser


//Login API
exports.userWithSocietyUnionLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ msg: "Field and password are required" });
  }
  try {
    const isPhoneNumber = /^\d{10}$/.test(username);
    const query = isPhoneNumber
      ? {
          userPhoneNo: username,
          password,
        }
      : { username: username, password };
    const signUserPromise = SignUser.findOne(query).exec();
    const societyUserPromise = SocietyUser.findOne(query).exec();
    const houseListUserPromise = HouseListUser.findOne(query).exec();
    console.log(societyUserPromise);
    const [signUser, societyUser, houseListUser] = await Promise.all([
      signUserPromise,
      societyUserPromise,
      houseListUserPromise,
    ]);
    if (!signUser && !societyUser && !houseListUser) {
      return res.status(401).send({msg: "Unauthorized: Invalid Credentials"});
    }

    if (signUser && societyUser && houseListUser) {
      return res.status(400).send({
        msg: "Username or Phone Number exists in both schemas. Please contact support.",
      });
    }

    let userData;

    if (signUser) {
      userData = signUser.toObject();
      delete userData.password;
    } else if (societyUser) {
      userData = societyUser.toObject();
      delete userData.password;
    } else if (houseListUser) {
      userData = houseListUser.toObject();
      delete userData.password;
    }

    const token = jwt.sign(
      { data: userData },
      "Skynetenclave_is_my_secret_key",
      { expiresIn: "3h" }
    );

    console.log("Login successful");
    return res.status(200).send({
      data: userData,
      token: token,
      msg: "Login Successful",
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
