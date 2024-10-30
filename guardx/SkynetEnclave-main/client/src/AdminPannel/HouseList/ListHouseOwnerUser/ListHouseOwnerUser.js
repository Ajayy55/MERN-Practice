import React, { useContext } from "react";
import "./style.css";
import { LanguageContext } from "../../../lib/LanguageContext";
const ListHouseOwnerUser = ({ data }) => {
  const { language } = useContext(LanguageContext);
  return (
    <div>
      <div className="list-view-house-user-heading">
        {language === "english" ? "मालिक उपयोगकर्ता " : "House Owner User "}
      </div>

      <div className="list-view-house-user">
        <table className="user-table">
          <thead>
            <tr>
              <th> {language === "english" ? "नाम" : "Name"}</th>
              <th> {language === "english" ? "ईमेल" : "Email"}</th>
              <th> {language === "english" ? "पासवर्ड" : "Password"}</th>
              <th>
                {" "}
                {language === "english"
                  ? "RWA सदस्य हैं?"
                  : "Is this an RWA member?"}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.ownerName ? data.ownerName : "Not Added"}</td>

              <td>{data.username ? data.username : "Not Added"}</td>
              <td>{data.password ? data.password : "Not Added"}</td>
              <td>{data.isRwaMember ? data.isRwaMember : "Not Added"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListHouseOwnerUser;
