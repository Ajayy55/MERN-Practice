const nodemailer = require("nodemailer");
const user = require("../../Models/houseSchema");
exports.sendEmail = (houseDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nitishpathania.dx@gmail.com",
      pass: "zhbb smls jyoy hsnj",
    },
  });
  const mailOptions = {
    from: "nitishpathania.dx@gmail.com",
    to: houseDetails.username,
    subject: "House Owner Approved",
    text: `Congratulations! Your house has been approved. Your credentials are:
           Username: ${houseDetails.username},
            Password: ${houseDetails.password}
        `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email", error);
    } else {
      user
        .findByIdAndUpdate(
          houseDetails._id,
          { isEmailSent: true },
          { new: true }
        )
        .then((updatedHouse) => {
          if (updatedHouse) {
            console.log("isEmailSent updated to true");
          } else {
            console.log("Failed to update isEmailSent");
          }
        })
        .catch((err) => {
          console.log("Error updating isEmailSent", err);
        });
    }
  });
};
