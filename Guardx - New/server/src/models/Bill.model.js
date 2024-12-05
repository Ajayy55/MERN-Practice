import mongoose from "mongoose"
const Schema = mongoose.Schema;

const getCurrentTime = () => {
    const currentDate = new Date();
    const ISTTime = currentDate.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
    });
    // console.log(ISTTime);
    return `${ISTTime}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const date = now.getDate().toString().padStart(2, "0");
    return `${date}-${month}-${year}`;
  };


// Define the Billing Schema
const billingSchema = new Schema({
  society_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "addSociety", 
    ref:"Society"
  },
  houseCount: {
    type: String,
  },
  planType: {
    type: String,
    enum: ["Standard", "Elite", "Supreme", "Custom"],
  },
  discountType: {
    type: String,
    enum: ["fixed", "flat"],
    default: "fixed",
  },
  discountAmount: {
    type: Number,
    default: 0, // Fixed or percentage discount amount
  },
  currencyType: {
    type: String,
    enum: ["INR", "USD"],
    required: true,
    default: "INR",
  },
  submitedDate: {
    type: String,
    default: getCurrentDate(),
  },
  submitedTime: {
    type: String,
    default: getCurrentTime(),
  },
  billingCycle: {
    type: String,
    enum: ["monthly", "quarterly", "annual"], // Billing cycle type
  },
  pricePerHouse: {
    type: String,
  },
  bills: [
    {
      billingCycle: {
        type: String,
        enum: ["monthly", "quarterly", "annual"], // Billing cycle type
      },
      billing_period_startDate: {
        type: Date,
        default: Date.now, // Automatically set to the current date
      },
      billing_period_endDate: {
        type: Date,
        default: function () {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 32); // Add 29 days to the current date
          // Return the date in YYYY-MM-DD format
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Pad the month with 0 if needed
          const day = String(currentDate.getDate()).padStart(2, "0"); // Pad the day with 0 if needed
          // Create a Date object with the formatted string
          return `${day}-${month}-${year}`;
        },
      },

      invoiceNo: {
        type: String, // Unique invoice number
      },
      totalHouse: {
        type: String, // Total number of houses
      },
      amount: {
        type: String, // Total billing amount
      },
      paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "overdue"], // Payment status of the bill
        default: "unpaid",
      },
      dueDate: {
        type: String, // Due date of the bill
      },
      discountAmount: {
        type: Number, // Discount applied
        default: 0,
      },
      total: {
        type: String, // Net amount after discount
      },
      submitedDate: {
        type: String,
        default: getCurrentDate(),
      },
      submitedTime: {
        type: String,
        default: getCurrentTime(),
      },
      discountType: {
        type: String,
        enum: ["fixed", "flat"],
        default: "fixed",
      },
      pricePerHouse: {
        type: String,
      },
      currencyType: {
        type: String,
        enum: ["INR", "USD"],
        required: true,
        default: "INR",
      },
      society_id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "addSociety", // Reference to the Society collection
        ref:"Society"
      },
    },
  ],
});
// Create the Billing Model based on the Schema
// module.exports = mongoose.model("Billing", billingSchema);
const Billing = mongoose.model("Billing", billingSchema);
export default Billing;

