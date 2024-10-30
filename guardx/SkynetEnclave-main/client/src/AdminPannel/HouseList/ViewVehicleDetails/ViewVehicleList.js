import React, { useContext, useEffect } from "react";
import "./style.css";
import { LanguageContext } from "../../../lib/LanguageContext";
import { ThreeCircles } from "react-loader-spinner";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PORT } from "../../../Api/api";
const ViewVehicleList = ({ data }) => {
  const { language } = useContext(LanguageContext);
  const [loadingPermission, setLoadingPermission] = useState(true);
  const vehiclesArray =
    data && data[0] && data[0].vehicles ? data[0].vehicles : [];
  useEffect(() => {
    setTimeout(() => {
      setLoadingPermission(false);
    }, 4000);
  }, []);
  //   handle vehicle Functionality
  const handleDelete = async (ownerId, vehicleIndex) => {
    console.log(ownerId, vehicleIndex);
    try {
      const response = await axios.delete(
        `${PORT}/deleteVehicle/${ownerId}/${vehicleIndex}`
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while deleting the vehicle"
      );
    }
  };
  return (
    <div>
      <div>
        <div className="list-view-vehicle-user-heading">
          {language === "english" ? "वाहन सूची देखें" : "View Vehicle List "}
        </div>

        <div className="list-view-vehicle-user">
          {loadingPermission ? (
            <div className="three_circle_loader_vehicle_view">
              <ThreeCircles
                visible={true}
                height={90}
                width={90}
                color="#5e72e4"
                ariaLabel="three-circles-loading"
              />
            </div>
          ) : (
            <table className="vehicle-table">
              <thead>
                <tr>
                  <th>
                    {" "}
                    {language === "english" ? "वाहन सूची देखें" : "Vehicle ID "}
                  </th>
                  <th>
                    {" "}
                    {language === "english"
                      ? "वाहन सूची देखें"
                      : "Vehicle Type "}
                  </th>
                  <th>
                    {" "}
                    {language === "english" ? "वाहन प्रकार" : "Vehicle Number "}
                  </th>
                  <th>
                    {" "}
                    {language === "english" ? "वाहन संख्या" : "Vehicle Image "}
                  </th>
                  <th> {language === "english" ? "क्रिया" : "Action  "}</th>
                </tr>
              </thead>

              <tbody>
                {vehiclesArray.length > 0 ? (
                  vehiclesArray.map((item, index) => (
                    <tr key={index}>
                      <td>{`Vehicle ${index + 1}`}</td>
                      <td>{item.type ? item.type : "Not Added"}</td>
                      <td>{item.number ? item.number : "Not Added"}</td>
                      <td>
                        {item.image ? (
                          <img
                            src={`/${item.image.replace("public/", "")}`}
                            alt=""
                            className="vehicle-image"
                          />
                        ) : (
                          "Not Added"
                        )}
                      </td>
                      <td>
                        {" "}
                        <button
                          onClick={() => handleDelete(data[0]._id, index)}
                          className="dlt-btn"
                        >
                          <MdDelete
                            data-toggle="tooltip"
                            className="eyes_view"
                            data-placement="top"
                            title={
                              language === "hindi" ? "Click to Delete" : "हटाएं"
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No vehicles available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVehicleList;
