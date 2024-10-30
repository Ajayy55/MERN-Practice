import React, { useContext, useState } from "react";
import "./style.css";
import { LanguageContext } from "../../../lib/LanguageContext";
import { Formik, Form, Field, FieldArray } from "formik";
import { MdOutlineSaveAlt } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { PORT } from "../../../Api/api";
import "react-toastify/dist/ReactToastify.css";
import ViewVehicleList from "../ViewVehicleDetails/ViewVehicleList";
import { useEffect } from "react";
const AddVehicle = ({ data }) => {
  const { language } = useContext(LanguageContext);
  const [step, setStep] = useState(1);
  const [vehicleDetails, setVehiclesDetails] = useState([]);
  const society_id = JSON.parse(localStorage.getItem("society_id")) || null;
  const id = data;
  const initialValues = {
    vehicles: [
      {
        type: "",
        number: "",
        image: null,
      },
    ],
  };
  // Validation functions for each step
  const validateStep1 = (values) => {
    const errors = {};
    if (!values.vehicles || values.vehicles.length === 0) {
      errors.vehicles = "At least one vehicle is required";
    } else {
      const vehicleErrors = [];
      values.vehicles.forEach((vehicle, index) => {
        const vehicleError = {};
        if (!vehicle.type) {
          vehicleError.type = "Vehicle type is required";
          vehicleErrors[index] = vehicleError;
        }
      });
      if (vehicleErrors.length > 0) {
        errors.vehicles = vehicleErrors;
      }
    }
    return errors;
  };

  const validateStep2 = (values) => {
    const errors = {};
    if (!values.vehicles || values.vehicles.length === 0) {
      errors.vehicles = "At least one vehicle is required";
    } else {
      const vehicleErrors = [];
      values.vehicles.forEach((vehicle, index) => {
        const vehicleError = {};
        if (!vehicle.number) {
          vehicleError.number = "Vehicle number is required";
          vehicleErrors[index] = vehicleError;
        } else if (!/^[A-Z0-9-]+$/i.test(vehicle.number)) {
          vehicleError.number = "Invalid vehicle number format";
          vehicleErrors[index] = vehicleError;
        }
      });
      if (vehicleErrors.length > 0) {
        errors.vehicles = vehicleErrors;
      }
    }
    return errors;
  };

  const validateStep3 = (values) => {
    const errors = {};
    if (!values.vehicles || values.vehicles.length === 0) {
      errors.vehicles = "At least one vehicle is required";
    } else {
      const vehicleErrors = [];
      values.vehicles.forEach((vehicle, index) => {
        const vehicleError = {};
        if (!vehicle.image) {
          vehicleError.image = "Vehicle image is required";
          vehicleErrors[index] = vehicleError;
        } else {
          const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
          if (!allowedTypes.includes(vehicle.image.type)) {
            vehicleError.image = "Unsupported file format";
            vehicleErrors[index] = vehicleError;
          }
        }
      });
      if (vehicleErrors.length > 0) {
        errors.vehicles = vehicleErrors;
      }
    }
    return errors;
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values, "form data");

    const formData = new FormData();

    // Append each vehicle's type, number, and image to the FormData
    values.vehicles.forEach((vehicle, index) => {
      formData.append(`vehicles[${index}][type]`, vehicle.type);
      formData.append(`vehicles[${index}][number]`, vehicle.number);
      if (vehicle.image) {
        formData.append(`vehicleImages`, vehicle.image);
      }
    });

    axios
      .post(`${PORT}addHouseOwner/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        resetForm();
        handleData();
        toast.success(res.data.message);
        setStep(1);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.error ||
            "An error occurred while adding vehicles"
        );
      });
  };

  const handleNext = (validateForm, setTouched, values) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setStep(step + 1);
      } else {
        // Mark all fields as touched to show errors
        setTouched(
          {
            vehicles: values.vehicles.map(() => ({
              type: true,
              number: true,
              image: true,
            })),
          },
          false
        );
      }
    });
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const handleData = async () => {
    try {
      const response = await axios.get(`${PORT}/getHouseDetails`);
      const filterData = await response.data.data.filter(
        (item) => item._id === id
      );
      setVehiclesDetails(filterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleData();
  }, [vehicleDetails]);

  return (
    <div>
      
      <Formik
        initialValues={initialValues}
        validate={
          step === 1
            ? validateStep1
            : step === 2
            ? validateStep2
            : validateStep3
        }
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          setFieldValue,
          validateForm,
          setTouched,
          values,
        }) => (
          <Form className="add-vehicle-detail-section">
            {/* Form Title */}
            <div className="add-vehicle-detail-title-div">
              {language === "english"
                ? "वाहन विवरण जोड़ें"
                : "Add Vehicle Details"}
            </div>

            <div className="add-vehicle-detail-inner-section">
              <FieldArray name="vehicles">
                {({ insert, remove, push }) => (
                  <div>
                    {values.vehicles.length > 0 &&
                      values.vehicles.map((vehicle, index) => (
                        <div key={index} className="vehicle-form-container">
                          {step === 1 && (
                            <div className="form-container-vehicle1">
                              {/* Type of Vehicle */}
                              <div className="input-container-vehicle">
                                <label>
                                  {language === "english"
                                    ? "वाहन का प्रकार"
                                    : "Type of Vehicle"}{" "}
                                  <span className="important_field">*</span>
                                </label>
                                <div className="input-with-icon-vehicle">
                                  <Field
                                    as="select"
                                    name={`vehicles.${index}.type`}
                                  >
                                    <option value="">
                                      {language === "english"
                                        ? "प्रकार चुनें"
                                        : "Select Type"}
                                    </option>
                                    <option value="Bike">Two-Wheelers</option>
                                    <option value="Car">Four-Wheelers</option>

                                    <option value="Truck">
                                      Heavy Vehicles (Truck,Bus,Lorry)
                                    </option>
                                    {/* Add more types as needed */}
                                  </Field>
                                </div>
                                {errors.vehicles &&
                                  errors.vehicles[index] &&
                                  errors.vehicles[index].type &&
                                  touched.vehicles &&
                                  touched.vehicles[index] &&
                                  touched.vehicles[index].type && (
                                    <div className="error">
                                      {errors.vehicles[index].type}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="form-container-vehicle2">
                              {/* Vehicle Number */}
                              <div className="input-container-vehicle">
                                <label>
                                  {language === "english"
                                    ? "वाहन संख्या"
                                    : "Vehicle Number"}{" "}
                                  <span className="important_field">*</span>
                                </label>
                                <div className="input-with-icon-vehicle">
                                  <Field
                                    type="text"
                                    name={`vehicles.${index}.number`}
                                    placeholder={
                                      language === "english"
                                        ? "अपना वाहन नंबर दर्ज करें"
                                        : "Enter your vehicle number"
                                    }
                                    maxLength={15}
                                  />
                                </div>
                                {errors.vehicles &&
                                  errors.vehicles[index] &&
                                  errors.vehicles[index].number &&
                                  touched.vehicles &&
                                  touched.vehicles[index] &&
                                  touched.vehicles[index].number && (
                                    <div className="error">
                                      {errors.vehicles[index].number}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="form-container-vehicle3">
                              {/* Vehicle Image */}
                              <div className="input-container-vehicle">
                                <label>
                                  {language === "english"
                                    ? "वाहन की छवि"
                                    : "Vehicle Image"}{" "}
                                  <span className="important_field">*</span>
                                </label>
                                <div className="input-with-icon-vehicle">
                                  <input
                                    type="file"
                                    name={`vehicles.${index}.image`}
                                    accept="image/*"
                                    onChange={(event) => {
                                      setFieldValue(
                                        `vehicles.${index}.image`,
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                  />
                                  <FaImages className="input-icon" />
                                </div>
                                {errors.vehicles &&
                                  errors.vehicles[index] &&
                                  errors.vehicles[index].image &&
                                  touched.vehicles &&
                                  touched.vehicles[index] &&
                                  touched.vehicles[index].image && (
                                    <div className="error">
                                      {errors.vehicles[index].image}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {/* Option to remove a vehicle */}
                          {values.vehicles.length > 1 && (
                            <button
                              type="button"
                              className="remove-vehicle-button"
                              onClick={() => remove(index)}
                            >
                              {language === "english" ? "हटाएं" : "Remove"}
                            </button>
                          )}
                        </div>
                      ))}
                    <button
                      disabled={step === 2 || step === 3}
                      type="button"
                      className="add-vehicle-button"
                      onClick={() =>
                        push({ type: "", number: "", image: null })
                      }
                    >
                      {language === "english" ? "वाहन जोड़ें" : "Add Vehicle"}
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <br />

            {/* Navigation Buttons */}
            <div className="add-vehicle-form-action-buttons">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="add-vehicle-back-button"
                >
                  {language === "english" ? "पीछे" : "Back"}
                </button>
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={() => handleNext(validateForm, setTouched, values)}
                  className="add-vehicle-next-button"
                >
                  {language === "english" ? "अगला" : "Next"}
                </button>
              )}

              {step === 3 && (
                <button type="submit" className="add-vehicle-save-button">
                  <MdOutlineSaveAlt className="add-vehicle-form-action-buttons-icon" />{" "}
                  {language === "english" ? "सहेजें" : "Save"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
      {/* <View Vehicle Details */}
      <ViewVehicleList data={vehicleDetails} />
      <ToastContainer />
    </div>
  );
};

export default AddVehicle;
