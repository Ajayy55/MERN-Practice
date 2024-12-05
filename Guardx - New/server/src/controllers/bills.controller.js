import { House } from '../models/house.model.js';
import billingSchema from './../models/Bill.model.js'


const conversionRate = 84.49; // 1 USD = 84.49 INR
//dueDate
const dueDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7); // Add 7 days to the current date
  // Format the date as DD-MM-YYYY
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = today.getDate().toString().padStart(2, "0");

  return `${day}-${month}-${year}`;HouseL
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const date = now.getDate().toString().padStart(2, "0");
  return `${date}-${month}-${year}`;
};

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

// exports.calculateSocietyBill = async (req, res) => {

//   const {
//     society_id,
//     totalHouse,
//     pricePerHouse,
//     discountAmount,
//     currencyType,
//     billingCycle,
//     billing_period_startDate,
//     billing_period_endDate,
//     discountType,
//   } = req.body;

//   if (
//     !society_id ||
//     !totalHouse ||
//     !pricePerHouse ||
//     !discountAmount ||
//     !currencyType ||
//     !billingCycle ||
//     !billing_period_startDate ||
//     !discountType
//   ) {
//     return res.status(400).json({
//       error: "Please provide all required fields.",
//     });
//   }

//   console.log(currencyType, "currencyType");

//   try {
//     // Find the society billing using society_id
//     const billing = await billingSchema.findOne({ society_id });

//     if (!billing) {
//       return res.status(404).json({ error: "Society not found." });
//     }

//     // Calculate the total amount based on the price per house and total houses
//     let totalAmount = totalHouse * pricePerHouse;
//     if (currencyType === "INR") {
//       amountCost = totalHouse * pricePerHouse;
//       totalAmountCost = `₹${amountCost.toFixed(2)}`;
//     } else if (currencyType === "USD") {
//       amountCost = (totalHouse * pricePerHouse) / conversionRate;
//       totalAmountCost = `$${amountCost.toFixed(2)}`;
//     }
//     // Apply the discount based on the discountType
//     if (discountType === "fixed") {
//       // Fixed discount: subtract the discountAmount directly from totalAmount
//       totalAmount -= discountAmount;
//     } else if (discountType === "flat") {
//       // Percentage discount: calculate the discount as a percentage of the total amount
//       const percentageDiscount = (totalAmount * discountAmount) / 100;
//       totalAmount -= percentageDiscount;
//       console.log(totalAmount, "totalAmount");
//     } else {
//       return res.status(400).json({
//         error: "Invalid discount type provided.",
//       });
//     }
//     totalAmount = totalAmount.toFixed(2); // Ensure two decimal places

//     let formattedAmount;
//     let totalAmountInINR, totalAmountInUSD;

//     if (currencyType === "INR") {
//       totalAmountInINR = totalAmount;
//       formattedAmount = `₹${totalAmountInINR}`;
//     } else if (currencyType === "USD") {
//       totalAmountInUSD = totalAmount / conversionRate;
//       formattedAmount = `$${totalAmountInUSD.toFixed(2)}`;
//     } else {
//       return res.status(400).json({
//         error: "Invalid currency type provided.",
//       });
//     }

//     // Check if a bill already exists for the given billing cycle
//     const existingBill = billing.bills.find(
//       (bill) => bill.billingCycle === billingCycle
//     );

//     // Get today's date
//     const today = new Date();

//     // Parse the billing_period_startDate (DD-MM-YYYY format)
//     const [startDay, startMonth, startYear] =
//       billing_period_startDate.split("-");
//     const billingStartDate = new Date(`${startMonth}-${startDay}-${startYear}`); // Reformat to MM-DD-YYYY

//     // Parse the billing_period_endDate (DD-MM-YYYY format)
//     const [endDay, endMonth, endYear] = billing_period_endDate.split("-");
//     const billingEndDate = new Date(`${endMonth}-${endDay}-${endYear}`); // Reformat to MM-DD-YYYY

//     // Calculate the date 32 days ago
//     const thirtyTwoDaysAgo = new Date();
//     thirtyTwoDaysAgo.setDate(today.getDate() - 32); // 32 days ago from today

//     // If the billing start date is more than 32 days ago, create a new bill
//     if (existingBill && billingStartDate <= thirtyTwoDaysAgo) {
//       // Update the existing bill
//       existingBill.totalHouse = totalHouse;
//       existingBill.amount = formattedAmount;
//       existingBill.discountAmount = discountAmount;
//       existingBill.total = totalAmount;
//       existingBill.submitedDate = getCurrentDate();
//       existingBill.submitedTime = getCurrentTime();
//       // Save the updated billing details
//       await billing.save();

//       return res.json({
//         message: `Updated the ${billingCycle} bill for the society.`,
//         bill: formattedAmount,
//         billingDetails: billing,
//       });
//     } else if (!existingBill || billingStartDate > thirtyTwoDaysAgo) {
//       // Generate a random invoice number
//       const randomHour = Math.floor(10000000 + Math.random() * 900000); // Random 8-digit number
//       // If no existing bill for the cycle, or the start date is within 32 days, create a new bill
//       const newBill = {
//         billingCycle: billingCycle,
//         billing_period_startDate: billingStartDate, // Use Date object for start date
//         billing_period_endDate: billingEndDate, // Use Date object for end date
//         invoiceNo: `GUARDX/${new Date()
//           .toLocaleString("en-US", { month: "short" })
//           .toUpperCase()}/${totalHouse}/${randomHour}`, // Generate a unique invoice number
//         totalHouse: totalHouse,
//         amount: totalAmountCost,
//         paymentStatus: "unpaid", // Default to unpaid
//         dueDate: dueDate(), // Example due date
//         discountAmount: discountAmount,
//         total: formattedAmount,
//         submitedDate: getCurrentDate(),
//         submitedTime: getCurrentTime(),
//         discountType: discountType,
//       };

//       // Push the new bill to the bills array
//       billing.bills.push(newBill);

//       // Save the updated billing details
//       await billing.save();

//       return res.json({
//         message: `New ${billingCycle} bill generated for the society.`,
//         bill: formattedAmount,
//         billingDetails: billing,
//       });
//     }
//   } catch (error) {
//     console.error("Error adding or updating bill:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };




//calculateSocietyBill

export const genrateAutomaticBills = async (req, res) => {
  try {
    const billing = await billingSchema
      .find({})
      .populate({ path: "society_id", select: "isActive approvalStatus" });
    // console.log(billing);
    
    const newSociety = billing?.filter((society) => {
     return society.society_id.isActive == true ;
    });

    const houseCount = async (society_id) => {
      const totalHouse = await House.find({
        society: society_id,
        isActive: true,
        approvalStatus:'Approved'
      });
      return await totalHouse.length;
    };

    newSociety.forEach(async (society) => {
      
      if (society.bills.length === 0) {
        const today = new Date();
        const [day, month, year] = society?.submitedDate.split("-").map(Number);
        const submitedDate = new Date(year, month - 1, day);
        const billingdDate = new Date(submitedDate);
        billingdDate.setDate(billingdDate.getDate() + 30);

        console.log(billingdDate.toLocaleString());
        // console.log(today.toLocaleString());

        if (new Date() < billingdDate) {
          console.log("returned");
          return;
        }
      }

      if (society.bills.length > 0) {
        const lastBill = society.bills[society.bills.length - 1];
        // console.log("lastBill", lastBill);
        const endDate = new Date(lastBill.billing_period_endDate); // Parse the date
        // console.log(endDate.toLocaleString(), new Date().toLocaleString());
        if (new Date() < endDate) {
          return;
        }
      }

      let totalHouse = await houseCount(society.society_id);
      let totalAmount = totalHouse * Number(society?.pricePerHouse);
      let totalAmountCost;
      if (society.currencyType === "INR") {
        totalAmountCost = `₹${totalAmount.toFixed(2)}`;
      } else if (society.currencyType === "USD") {
        const conversionRate = 84.49; // Example conversion rate, update it as needed
        totalAmountCost = `$${(totalAmount / conversionRate).toFixed(2)}`;
      } else {
        return res.status(400).json({
          error: "Invalid currency type provided.",
        });
      }

      if (society.discountType === "fixed") {
        // Fixed discount: subtract the discountAmount directly from totalAmount
        totalAmount -= society.discountAmount;
      } else if (society.discountType === "flat") {
        // Percentage discount: calculate the discount as a percentage of the total amount
        const percentageDiscount = (totalAmount * society.discountAmount) / 100;
        totalAmount -= society.percentageDiscount;
      } else {
        return res.status(400).json({
          error: "Invalid discount type provided.",
        });
      }

      totalAmount = Math.max(0, totalAmount);
      totalAmount = totalAmount.toFixed(2); // Ensure two decimal places

      let formattedAmount;
      let totalAmountInINR, totalAmountInUSD;

      if (society.currencyType === "INR") {
        totalAmountInINR = totalAmount;
        formattedAmount = `₹${totalAmountInINR}`;
      } else if (society.currencyType === "USD") {
        totalAmountInUSD = totalAmount / 84.49; // Example conversion rate, update it as needed
        formattedAmount = `$${totalAmountInUSD.toFixed(2)}`;
      }

      // Get today's date
      const today = new Date();
      const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(today);  
      // Parse the billing_period_startDate and billing_period_endDate (DD-MM-YYYY format)
      let billingStartDate;
      let billingEndDate;
      if (society.bills.length === 0) {
        // If there are no bills, set the billing start date to today's date - 30 days
        // const b="2024-12-22"
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate()); // 30 days ago from today
        billingStartDate = thirtyDaysAgo.setDate(today.getDate() - 30);
        billingEndDate = thirtyDaysAgo.setDate(today.getDate() + 30);
      } else {
        // If there are existing bills, use the last bill's end date as the start date for the new bill
        const lastBill = society.bills[society.bills.length - 1];
        const lastBillEndDate = new Date(lastBill.billing_period_endDate); // Parse the last bill's end date
        billingStartDate = lastBillEndDate;
        billingEndDate = new Date(lastBillEndDate);
        billingEndDate.setDate(lastBillEndDate.getDate() + 30); // Set the end date 30 days after the last bill's end date
      }

      // Generate a random invoice number
      const randomHour = Math.floor(10000000 + Math.random() * 900000); // Random 8-digit number

      const newBill = {
        billingCycle: society.billingCycle,
        billing_period_startDate: billingStartDate, // Use Date object for start date
        billing_period_endDate: billingEndDate, // Use Date object for end date
        invoiceNo: `GUARDX/${new Date()
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase()}/${new Date()
            .toLocaleString("en-US", {year:"2-digit" })
            }/${totalHouse}/${randomHour}`, // Generate a unique invoice number
        totalHouse: totalHouse,
        amount: totalAmountCost,
        paymentStatus: "unpaid", // Default to unpaid
        dueDate: dueDate(), // Example due date, implement this function
        discountAmount: society.discountAmount,
        total: formattedAmount,
        submitedDate: getCurrentDate(),
        submitedTime: getCurrentTime(),
        discountType: society.discountType,
        pricePerHouse: society.pricePerHouse,
        currencyType: society.currencyType,
        society_id: society.society_id,
      };
      console.log(newBill);
      society.bills.push(newBill);
      await society.save();
    });

    //  res.status(200).json({
    //   message: `New bill's generated for the society.`,
    // });
  } catch (error) {
    console.log(error);
  }
};



// exports.calculateSocietyBill = async (req, res) => {

  export const calculateSocietyBill = async (req, res) => {
  const {
    society_id,
    totalHouse,
    pricePerHouse,
    discountAmount,
    currencyType,
    billingCycle,
    discountType,
  } = req.body;
  try {
    // Find the society billing using society_id
    const billing = await billingSchema.findOne({society_id}).populate({path:"society_id",select:"isActive"});

    if (!billing) {
      return res.status(404).json({ error: "Society not found." });
    }

    if(billing?.society_id?.isActive==false){
      return res.status(404).json({ error: "InActive Soicety" });
    }

   
    // Calculate the total amount based on the price per house and total houses
    let totalAmount = totalHouse * pricePerHouse;
    let totalAmountCost;
    if (currencyType === "INR") {
      totalAmountCost = `₹${totalAmount.toFixed(2)}`;
    } else if (currencyType === "USD") {
      const conversionRate = 84.49; // Example conversion rate, update it as needed
      totalAmountCost = `$${(totalAmount / conversionRate).toFixed(2)}`;
    } else {
      return res.status(400).json({
        error: "Invalid currency type provided.",
      });
    }

    // Apply the discount based on the discountType
    if (discountType === "fixed") {
      // Fixed discount: subtract the discountAmount directly from totalAmount
      totalAmount -= discountAmount;
    } else if (discountType === "flat") {
      // Percentage discount: calculate the discount as a percentage of the total amount
      const percentageDiscount = (totalAmount * discountAmount) / 100;
      totalAmount -= percentageDiscount;
    } else {
      return res.status(400).json({
        error: "Invalid discount type provided.",
      });
    }
    // Ensure totalAmount doesn't go below 0
    totalAmount = Math.max(0, totalAmount);
    totalAmount = totalAmount.toFixed(2); // Ensure two decimal places

    let formattedAmount;
    let totalAmountInINR, totalAmountInUSD;

    if (currencyType === "INR") {
      totalAmountInINR = totalAmount;
      formattedAmount = `₹${totalAmountInINR}`;
    } else if (currencyType === "USD") {
      totalAmountInUSD = totalAmount / 84.49; // Example conversion rate, update it as needed
      formattedAmount = `$${totalAmountInUSD.toFixed(2)}`;
    }

    // Get today's date
    const today = new Date();
    // Parse the billing_period_startDate and billing_period_endDate (DD-MM-YYYY format)
    let billingStartDate;
    let billingEndDate;
    if (billing.bills.length === 0) {
      // If there are no bills, set the billing start date to today's date - 30 days
      // const b="2024-12-22"
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate()); // 30 days ago from today
      billingStartDate = thirtyDaysAgo.setDate(today.getDate() - 30);
      billingEndDate = thirtyDaysAgo.setDate(today.getDate() + 30);
    } else {
      // If there are existing bills, use the last bill's end date as the start date for the new bill
      const lastBill = billing.bills[billing.bills.length - 1];
      const lastBillEndDate = new Date(lastBill.billing_period_endDate); // Parse the last bill's end date
      billingStartDate = lastBillEndDate;
      billingEndDate = new Date(lastBillEndDate);
      billingEndDate.setDate(lastBillEndDate.getDate() + 30); // Set the end date 30 days after the last bill's end date
    }
    // Generate a random invoice number
    const randomHour = Math.floor(10000000 + Math.random() * 900000); // Random 8-digit number
    // If no existing bill for the cycle, create a new bill
    const newBill = {
      billingCycle: billingCycle,
      billing_period_startDate: billingStartDate, // Use Date object for start date
      billing_period_endDate: billingEndDate, // Use Date object for end date
      invoiceNo: `GUARDX/${new Date()
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase()}/${totalHouse}/${randomHour}`, // Generate a unique invoice number
      totalHouse: totalHouse,
      amount: totalAmountCost,
      paymentStatus: "unpaid", // Default to unpaid
      dueDate: dueDate(), // Example due date, implement this function
      discountAmount: discountAmount,
      total: formattedAmount,
      submitedDate: getCurrentDate(),
      submitedTime: getCurrentTime(),
      discountType: discountType,
      pricePerHouse:pricePerHouse,
      currencyType:currencyType,
      society_id
    };

    // Push the new bill to the bills array
    billing.bills.push(newBill);

    // Save the updated billing details
    await billing.save();

    return res.json({
      message: `New ${billingCycle} bill generated for the society.`,
      bill: formattedAmount,
      billingDetails: billing,
    });
    //   }
  } catch (error) {
    console.error("Error adding or updating bill:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};



// exports.createBill = async (req, res) => {
export const createBill = async (req, res) => {
  try {
    const {
      intervalType,
      discountType,
      societyHouseList,
      planType,
      currencyType,
      society_id,
      totalHouse,
      amount,
      discountAmount,
      pricePerHouse

    } = req.body;
    console.log(req.body)

    // Create a new bill
    const newBill = new billingSchema({
      society_id,
      amount,
      billingCycle: intervalType,
      billing_period_startDate: getCurrentDate(),
      billing_period_endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
      , // Example: 1 month later
      houseCount: societyHouseList,
      planType: planType,
      currencyType,
      totalHouse,
      discountType,
      discountAmount,
      pricePerHouse
    });
    await newBill.save();
    res
      .status(201)
      .json({ message: "Bill created successfully", bill: newBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating bill", error: error.message });
  }
};