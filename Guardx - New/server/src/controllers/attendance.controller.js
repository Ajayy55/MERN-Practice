import useragent from "useragent";
import { RegularEntriesAttendance } from "../models/regularEntryAttendance.model.js";
import { MemberSession } from "../models/memberSession.model.js";
import { generateRandomPassword } from "../utils/GenrateRandomPass.js";

// const clockOutIfNeeded = async (model, query) => {
//     const existingRecord = await model.findOne(query).sort({ createdAt: -1 });
//     if (existingRecord && !existingRecord.clockOutTime) {
//       existingRecord.clockOutTime = Date.now();
//       await existingRecord.save();
//     }
//   };

const memberSession = async (req, res) => {
  const { memberId, login, sessionString } = req.body;
    let invalidString =false;
    
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  const userAgentString = req.headers['user-agent'];
  const agent =useragent.parse(userAgentString)
  let ipAddress = ip === "::1" ? "127.0.0.1" : ip;
  let browserName ;

  if (userAgentString.includes("Edg/")) {
    browserName = "Edge";}else{ browserName =agent.family}

  ipAddress =`${ipAddress}/${agent.os}/${browserName}`;

  if (!memberId) {
    return res.status(400).json({ message: "Member Id Required!" });
  }

  try {
    if (login) {
                const session = await generateRandomPassword();
                // console.log(session);
                const response = await MemberSession.create({
                    ...req.body,
                    sessionString:session,
                    ipAddress,
                });

                if (sessionString) {
                    const checkClockedInAgain = await MemberSession.findOne({
                    //if session found it will delete single entry matching memberID and preveioisu session id
                    memberId,
                    sessionString,
                    }).sort({ createdAt: -1 });
                    if (checkClockedInAgain && !checkClockedInAgain.clockOutTime) {
                    checkClockedInAgain.clockOutTime = Date.now();
                    await checkClockedInAgain.save();
                    }
                } 

                    if (!response) {
                        return res.status(500).json({
                            message: "Something went wrong while saving user attendance record",
                        });
                    }
                    
                    return res
                        .status(200)
                        .json({ message: "success Entry Saved", session });

    } else {

                if (sessionString) {
                    const checkClockedInAgain = await MemberSession.findOne({
                    //if session found it will delete single entry matching memberID and preveioisu session id
                    memberId,
                    sessionString,
                    }).sort({ createdAt: -1 });
                    if (checkClockedInAgain && !checkClockedInAgain.clockOutTime) {
                    checkClockedInAgain.clockOutTime = Date.now();
                    await checkClockedInAgain.save();
                    } else {
                        invalidString=true;
                    //   return res.status(400).json({ message: "Invalid Session String" }); //return res with invalid sting if string not matched or  already clock out with sesionstring
                    }
                } 
                
                if (!sessionString || invalidString){
                    const checkClockedInAgain = await MemberSession.find({
                    //if string not found while logout all sessions
                    memberId: memberId,
                    clockOutTime: { $exists: false },
                    });
                    if (checkClockedInAgain.length > 0) {
                    for (const session of checkClockedInAgain) {
                        session.clockOutTime = Date.now();
                        await session.save();
                    }

                    // console.log("Updated sessions:", checkClockedInAgain);
                    return res.status(400).json({
                        message: "All Session closed due to Session String not provided/ tempered",
                    });
                    }
                }
    }

    res.status(200).json({ message: "Logged Out !" });
  } catch (error) {
    console.log(
      error,
      "Internal server error while Clock in user attendance entry"
    );
    res.status(500).json({
      message: "Internal server error while Clock in user attendance entry",
    });
  }
};


const viewMemberAttendance = async (req, res) => {
    const id = req.params.id;

    try {
        const response = await MemberSession.find({ memberId: id });
        if (!response)
            return res.status(400).json({ message: "No Attendance Record Found !" });

        res.status(200).json({ message: "Attendence List :", response });
    } catch (error) {
        console.log(
            error,
            "Internal server error while getting  user attendance entry"
        );
        res.status(500).json({
            message: "Internal server error while getting user attendance entry",
        });
    }
};


const handleRegularEntryClockIn = async (req, res) => {
  const { regularEntryID, guardID, society } = req.body;
  // console.log(req.body);

  if (!regularEntryID || !guardID || !society) {
    return res
      .status(400)
      .json({ message: "Regular Entry Id or Gurad Id Society Id Required" });
  }
  try {
    const checkClockedInAgain = await RegularEntriesAttendance.findOne({
      regularEntryID,
      society,
    }).sort({ createdAt: -1 });
    // console.log(checkClockedInAgain);
    if (checkClockedInAgain && !checkClockedInAgain.clockOutTime) {
      checkClockedInAgain.clockOutTime = Date.now();
      await checkClockedInAgain.save();
    }

    const response = await RegularEntriesAttendance.create(req.body);

    if (!response) {
      return res
        .status(500)
        .json({ message: "Something went wrong while saving entry record" });
    }

    res.status(200).json({ message: "success Entry Saved" });
  } catch (error) {
    console.log(error, "Internal server error while Clock in regular entry");
    res
      .status(500)
      .json({ message: "Internal server error while Clock in regular entry" });
  }
};

const handleRegularEntryClockOut = async (req, res) => {
  const { regularEntryID, society } = req.body;

  if (!regularEntryID || !society) {
    return res
      .status(400)
      .json({ message: "Regular Entry Id/ Society ID Required" });
  }
  try {
    const response = await RegularEntriesAttendance.findOne({
      regularEntryID,
      society,
    }).sort({ createdAt: -1 });
    //    console.log(response);

    if (!response) {
      return res.status(500).json({ message: "No Record Found" });
    }

    if (!response.clockOutTime) {
      console.log(response);
      response.clockOutTime = Date.now();
      await response.save();
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error, "Internal server error while Clock out regular entry");
    res
      .status(500)
      .json({ message: "Internal server error while Clock out regular entry" });
  }
};

const viewRegularEntryAttendance = async (req, res) => {
  const { regularEntryID, society } = req.body;
  if (!regularEntryID || !society) {
    return res
      .status(400)
      .json({ message: "Regular Entry Id/ Society ID Required" });
  }

  try {
    const response = await RegularEntriesAttendance.find({
      regularEntryID,
      society,
    })
      .sort({ createdAt: -1 })
      .populate("regularEntryID", "name");
    // console.log(response);

    if (!response) {
      return res.status(500).json({ message: "No Record Found" });
    }

    res.status(200).json({ message: "success", response });
  } catch (error) {
    console.log(error, "Internal server error while getting regular entry");
    res
      .status(500)
      .json({ message: "Internal server error while gettingregular entry" });
  }
};

export {
  memberSession,
  viewMemberAttendance,
  handleRegularEntryClockIn,
  handleRegularEntryClockOut,
  viewRegularEntryAttendance,
};
