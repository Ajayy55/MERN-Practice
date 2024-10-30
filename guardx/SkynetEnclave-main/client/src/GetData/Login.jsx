import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { PORT } from "../Api/api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useRef } from "react";
import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import GuardLayout from "../lib/GuardLayout";
import { LanguageContext } from "../lib/LanguageContext";
import { useContext } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";

import { Hourglass } from "react-loader-spinner";
function Login() {
  const [loading, setLoading] = useState(false);
  //show Eyes FUnctionality
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  //Navigation Process
  const [showToast, setShowToast] = useState(false);
  const [errorForLogin, setErrorForLogin] = useState();
  const [permissionData, setPermissionData] = useState([]);
  const [roleTypeSociety, setRoleTypeSociety] = useState([]);
  const handleDismissToast = () => {
    setShowToast(false);
  };
  const initialValues = {
    username: "",
    phone: "",
    password: "",
  };
  const handleToast = () => {
    if (showToast) {
      toast.error(
        `${
          language === "english"
            ? "अनधिकृत: अमान्य उपयोगकर्ता नाम या पासवर्ड"
            : "Unauthorized: Invalid Credentials"
        }`,
        {
          onClose: handleDismissToast,
        }
      );
    }
  };
  useEffect(() => {
    handleToast();
  }, [showToast, language]);
  const validationSchema = (language) =>
    Yup.object().shape({
      username: Yup.string()
        .required(
          language === "hindi"
            ? "Email or phone number is required"
            : "ईमेल या फोन नंबर आवश्यक है "
        )
        .test(
          "is-valid-contact",
          language === "hindi"
            ? "Please enter a valid email or mobile number "
            : "कृपया एक मान्य ईमेल या मोबाइल नंबर दर्ज करें।",
          (value) => {
            const trimmedValue = value ? value.trim() : ""; 
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\d{10}$/;
            
            // Ensure space is ignored and validate only after trimming
            if (!trimmedValue) return false; // Invalid if value is empty after trimming
        
            return emailPattern.test(trimmedValue) || phonePattern.test(trimmedValue);
          }
        )
        ,
      password: Yup.string()

        .min(
          6,
          `${
            language === "hindi"
              ? "Password must be at least 6 characters"
              : "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"
          }`
        )
        .max(
          25,
          `${
            language === "hindi"
              ? "Password must be of maximum 25 characters"
              : "पासवर्ड अधिकतम 25 अक्षरों का होना चाहिए"
          }`
        )

        .required(
          `${
            language === "hindi" ? "Password is required" : "पासवर्ड आवश्यक है"
          }`
        ),
    });
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(false);
    try {
      const response = await axios.post(`${PORT}/userWithSocietyUnionLogin`, {
        username: values.username.trim(),
        password: values.password,
      });
      console.log(response);
      if (response.status === 200) {
        //superadmin
        if (response.data.data.defaultPermissionLevel === 1) {
          setLoading(true);
          if (response.data.data.isActive === true) {
            const getSocietyRoleData = async () => {
              try {
                const roleResponse = await axios.get(`${PORT}/roleGet`);
                const apiRoles = await roleResponse.data.roles;

                const filteredRoles = await apiRoles.filter(
                  (item) => item.title === response.data.data.role
                );

                return filteredRoles;
              } catch (error) {
                console.error("Error fetching role data:", error);
              }
            };
            const checkRole = await getSocietyRoleData();
            if (checkRole.length > 0) {
              const { token } = response.data;
              const expiresAt = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 hours from now
              const data = {
                role: response.data.data.defaultPermissionLevel,
                token: token,
                expiresAt,
              };
              localStorage.setItem(
                "roleId",
                JSON.stringify(response.data.data._id)
              );
              localStorage.setItem(
                "role",
                JSON.stringify(response.data.data.defaultPermissionLevel)
              );
              localStorage.setItem("data", JSON.stringify(data));
              localStorage.setItem("roleLevel", "2");
              localStorage.setItem(
                "userRole",
                JSON.stringify(response.data.data.role)
              );
              const societyadminId = response.data.data._id;

              const getCurrentTime = () => {
                const now = new Date();
                let hours = now.getHours();
                const amOrPm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12;
                const minutes = now.getMinutes().toString().padStart(2, "0");
                return `${hours}:${minutes} ${amOrPm}`;
              };
              const guardLogin = async () => {
                const currentTime = getCurrentTime();
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const day = String(currentDate.getDate()).padStart(2, "0");
                try {
                  const currentTime = getCurrentTime();
                  let clockInTime;
                  let clockOutTime;
                  const response = await axios.post(`${PORT}/guardLogin`, {
                    createdBy: societyadminId,
                    date: `${day}/${month}/${year}`,
                    clockInTime: clockOutTime !== null ? currentTime : "",
                    clockOutTime: clockInTime ? null : currentTime,
                  });
                } catch (error) {
                  console.error("Error logging in guard:", error);
                }
              };
              guardLogin();
              window.location.href = "/admin/dashboard";
              setLoading(false);
              // }, 2000);
            } else {
              setLoading(false);
              toast.error(
                `${
                  language === "english"
                    ? "You don't have a role."
                    : "आपके पास कोई भूमिका नहीं है।"
                }`
              );
            }
          } else {
            setLoading(false);
            toast.error(
              `${
                language === "english"
                  ? "आपकी स्थिति निष्क्रिय है।"
                  : "Your status is Inactive"
              }`
            );
          }
        }
        // admin
        else if (response.data.data.defaultPermissionLevel === 2) {
          if (response.data.data.isActive === true) {
            const getSocietyRoleData = async () => {
              try {
                const roleResponse = await axios.get(`${PORT}/roleGet`);
                const apiRoles = await roleResponse.data.roles;

                const filteredRoles = await apiRoles.filter(
                  (item) => item.title === response.data.data.role
                );

                return filteredRoles;
              } catch (error) {
                console.error("Error fetching role data:", error);
              }
            };
            const checkRole = await getSocietyRoleData();

            if (checkRole.length > 0) {
              const { token } = response.data;
              const expiresAt = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 hours from now
              const data = {
                role: response.data.data.defaultPermissionLevel,
                token: token,
                expiresAt,
              };
              localStorage.setItem(
                "roleId",
                JSON.stringify(response.data.data._id)
              );
              localStorage.setItem(
                "societyLogo",
                JSON.stringify(response.data.data)
              );
              localStorage.setItem(
                "role",
                JSON.stringify(response.data.data.defaultPermissionLevel)
              );
              localStorage.setItem("roleLevel", "4");
              localStorage.setItem(
                "userRole",
                JSON.stringify(response.data.data.role)
              );
              localStorage.setItem("data", JSON.stringify(data));

              const societyadminId = response.data.data._id;

              const getCurrentTime = () => {
                const now = new Date();
                let hours = now.getHours();
                const amOrPm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12;
                const minutes = now.getMinutes().toString().padStart(2, "0");
                return `${hours}:${minutes} ${amOrPm}`;
              };
              const guardLogin = async () => {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const day = String(currentDate.getDate()).padStart(2, "0");
                try {
                  const currentTime = getCurrentTime();
                  let clockInTime;
                  let clockOutTime;
                  const response = await axios.post(`${PORT}/guardLogin`, {
                    createdBy: societyadminId,
                    date: `${day}/${month}/${year}`,
                    clockInTime: clockOutTime !== null ? currentTime : "",
                    clockOutTime: clockInTime ? null : currentTime,
                  });
                } catch (error) {
                  console.error("Error logging in guard:", error);
                }
              };
              guardLogin();
              window.location.href = "/admin/dashboard";
              setLoading(false);
              // }, 2000);
            } else {
              setLoading(false);
              toast.error(
                `${
                  language === "hindi"
                    ? "You don't have a role."
                    : "आपके पास कोई भूमिका नहीं है।"
                }`
              );
            }
          } else {
            setLoading(false);
            toast.error(
              `${
                language === "english"
                  ? "आपकी स्थिति निष्क्रिय है।"
                  : "Your status is Inactive"
              }`
            );
          }
        }
        // House Owner
        else if (response.data.data.defaultPermissionLevel === 3) {
          setLoading(true);
          if (response.data.data.isActive === true) {
            toast.error("Only Mobile App");
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
        //societyadmin
        else if (response.data.data.defaultPermissionLevel === 4) {
          const society_id = response.data?.data?.society_id;
          const getSocietyData = async (society_id) => {
            try {
              const response = await axios.get(`${PORT}/getSocietyData`);
              const res = await response.data.societyData;
              const filteredData = res.filter(
                (item) => item._id === society_id
              );
              return filteredData;
            } catch (error) {
              console.log("Error fetching society data:", error);
              setLoading(false);
            }
          };
          const filterData = await getSocietyData(society_id);
          if (!filterData || filterData.length === 0) {
            toast.error("You don't have a society.");
            return;
          } else {
            setLoading(true);
            if (response.data.data.isActive === true) {
              const getSocietyRoleData = async () => {
                try {
                  const roleResponse = await axios.get(`${PORT}/roleGet`);
                  const apiRoles = await roleResponse.data.roles;
                  const filteredRoles = await apiRoles.filter(
                    (item) => item.title === response.data.data.role
                  );
                  return filteredRoles;
                } catch (error) {
                  console.error("Error fetching role data:", error);
                }
              };
              const checkRole = await getSocietyRoleData();
              if (checkRole.length > 0) {
                const { token } = response.data;
                const expiresAt = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 hours from now
                const data = {
                  role: response.data.data.defaultPermissionLevel,
                  token: token,
                  expiresAt,
                };
                localStorage.setItem(
                  "roleId",
                  JSON.stringify(response.data.data._id)
                );
                localStorage.setItem(
                  "society_id",
                  JSON.stringify(response.data.data.society_id)
                );
                localStorage.setItem("roleLevel", "5");
                localStorage.setItem(
                  "societyLogo",
                  JSON.stringify(response.data.data)
                );

                localStorage.setItem(
                  "role",
                  JSON.stringify(response.data.data.defaultPermissionLevel)
                );
                localStorage.setItem(
                  "userRole",
                  JSON.stringify(response.data.data.role)
                );
                localStorage.setItem("data", JSON.stringify(data));
                const societyadminId = response.data.data._id;

                const getCurrentTime = () => {
                  // Get the current time in GMT (Ghana time)
                  const now = new Date();

                  // Convert time from Ghana (GMT) to India (IST) by adding 5 hours and 30 minutes
                  const indiaTime = new Date(
                    now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
                  );
                  // Get hours and minutes for IST
                  let indiaHours = indiaTime.getUTCHours();
                  const indiaAmOrPm = indiaHours >= 12 ? "PM" : "AM";
                  indiaHours = indiaHours % 12 || 12;
                  const indiaMinutes = indiaTime
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, "0");

                  // Return formatted IST time
                  return `${indiaHours}:${indiaMinutes} ${indiaAmOrPm}`;
                };

                // console.log("getCurrentTime --",getCurrentTime())
                const guardLogin = async () => {
                  const currentTime = getCurrentTime();
                  const currentDate = new Date();
                  const year = currentDate.getFullYear();
                  const month = String(currentDate.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(currentDate.getDate()).padStart(2, "0");
                  try {
                    const currentTime = getCurrentTime();
                    let clockInTime;
                    let clockOutTime;
                    const response = await axios.post(`${PORT}/guardLogin`, {
                      createdBy: societyadminId,
                      guardId: societyadminId,
                      clockInTime: clockOutTime !== null ? currentTime : "",
                      clockOutTime: clockInTime ? null : currentTime,
                      date: `${day}/${month}/${year}`,
                    });
                  } catch (error) {
                    console.error("Error logging in guard:", error);
                  }
                };
                guardLogin();
                // window.location.reload();
                // // setTimeout(() => {
                //   navigate("/admin/dashboard");
                window.location.href = "/admin/dashboard";
                setLoading(false);
                // }, 2000);
              } else {
                setLoading(true);
                toast.error(
                  `${
                    language === "english"
                      ? "You don't have a role."
                      : "आपके पास कोई भूमिका नहीं है।"
                  }`
                );
              }
            } else {
              setLoading(true);
              toast.error(
                `${
                  language === "english"
                    ? "आपकी स्थिति निष्क्रिय है।"
                    : "Your status is Inactive"
                }`
              );
            }
          }
        }
        //guardAccess/SocietySubAdmin
        else if (response.data.data.defaultPermissionLevel === 5) {
          console.log(response);
          setLoading(true);
          const society_id = response.data?.data?.society_id;
          const getSocietyData = async (society_id) => {
            try {
              const response = await axios.get(`${PORT}/getSocietyData`);
              const res = await response.data.societyData;
              const filteredData = res.filter(
                (item) => item._id === society_id
              );
              return filteredData;
            } catch (error) {
              console.log("Error fetching society data:", error);
            }
          };
          const filterData = await getSocietyData(society_id);
          if (!filterData || filterData.length === 0) {
            toast.error("You don't have a society.");
            setLoading(false);
            return;
          } else {
            if (response.data.data.isActive === true) {
              const getSocietyRoleData = async () => {
                try {
                  const roleResponse = await axios.get(`${PORT}/roleGet`);
                  const apiRoles = await roleResponse.data.roles;

                  const filteredRoles = await apiRoles.filter(
                    (item) => item.title === response.data.data.role
                  );

                  return filteredRoles;
                } catch (error) {
                  console.error("Error fetching role data:", error);
                }
              };
              const checkRole = await getSocietyRoleData();
              if (checkRole.length > 0) {
                const { token } = response.data;
                const expiresAt = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 hours from now
                const data = {
                  role: response.data.data.defaultPermissionLevel,
                  token,
                  expiresAt,
                };

                // console.log(response.data.data, "response.data.data");
                const a = response.data.data;
                const getRoleData = async () => {
                  try {
                    const roleResponse = await axios.get(`${PORT}/roleGet`);
                    const apiRoles = await roleResponse.data.roles;

                    const filteredRoles = apiRoles.filter(
                      (item) => item.title === a?.role
                    );
                    setPermissionData(filteredRoles[0]?.permissions);
                    console.log(filteredRoles[0]?.roleTypeLevelSociety);
                    setRoleTypeSociety(filteredRoles[0]?.roleTypeLevelSociety);
                    return filteredRoles[0]?.permissions;
                  } catch (error) {
                    console.error("Error fetching role data:", error);
                  }
                };
                const getSocietyRoleData = async () => {
                  try {
                    const roleResponse = await axios.get(`${PORT}/roleGet`);
                    const apiRoles = await roleResponse.data.roles;

                    const filteredRoles = apiRoles.filter(
                      (item) => item.title === a?.role
                    );
                    setPermissionData(filteredRoles[0]?.permissions);
                    return filteredRoles[0]?.roleTypeLevelSociety;
                  } catch (error) {
                    console.error("Error fetching role data:", error);
                  }
                };
                const ab = await getSocietyRoleData();
                if (ab === "societyLevel") {
                  localStorage.setItem(
                    "roleId",
                    JSON.stringify(response.data.data._id)
                  );
                  localStorage.setItem("roleLevel", "5");
                  localStorage.setItem(
                    "societyLogo",
                    JSON.stringify(response.data.data)
                  );
                  localStorage.setItem(
                    "role",
                    JSON.stringify(response.data.data.defaultPermissionLevel)
                  );
                  localStorage.setItem("roleTypeLevel", JSON.stringify(ab));
                  localStorage.setItem(
                    "society_id",
                    JSON.stringify(response.data.data.society_id)
                  );
                  localStorage.setItem(
                    "userRole",
                    JSON.stringify(response.data.data.role)
                  );

                  localStorage.setItem("data", JSON.stringify(data));

                  const getCurrentTime = () => {
                    // Get the current time in GMT (Ghana time)
                    const now = new Date();

                    // Convert time from Ghana (GMT) to India (IST) by adding 5 hours and 30 minutes
                    const indiaTime = new Date(
                      now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
                    );
                    // Get hours and minutes for IST
                    let indiaHours = indiaTime.getUTCHours();
                    const indiaAmOrPm = indiaHours >= 12 ? "PM" : "AM";
                    indiaHours = indiaHours % 12 || 12;
                    const indiaMinutes = indiaTime
                      .getUTCMinutes()
                      .toString()
                      .padStart(2, "0");
                    return `${indiaHours}:${indiaMinutes} ${indiaAmOrPm}`;
                  };
                  const guardLogin = async () => {
                    const currentTime = getCurrentTime();
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = String(currentDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const day = String(currentDate.getDate()).padStart(2, "0");
                    const user_id = response.data.data._id;
                    try {
                      const currentTime = getCurrentTime();
                      let clockInTime;
                      let clockOutTime;
                      await axios.post(`${PORT}/guardLogin`, {
                        createdBy: user_id,
                        guardId: user_id,
                        clockInTime: clockOutTime !== null ? currentTime : "",
                        clockOutTime: clockInTime ? null : currentTime,
                        date: `${day}/${month}/${year}`,
                      });
                    } catch (error) {
                      console.error("Error logging in guard:", error);
                    }
                  };
                  guardLogin();
                  window.location.href = "/admin/dashboard";
                  setLoading(false);
                  // }, 2000);
                } else {
                  getRoleData().then(async (permissions) => {
                    const permissionCheck =
                      Array.isArray(permissions[8]?.actions) &&
                      permissions[8].actions.includes("public");

                    const permissionStatus = permissionCheck
                      ? {
                          index: permissions[8]?.actions.indexOf("public"),
                          value: true,
                        }
                      : { index: -1, value: false };

                    if (permissionStatus.value) {
                      localStorage.setItem(
                        "roleId",
                        JSON.stringify(response.data.data.createdBy)
                      );
                      localStorage.setItem(
                        "role",
                        JSON.stringify(
                          response.data.data.defaultPermissionLevel
                        )
                      );
                      localStorage.setItem("guardAccess", JSON.stringify(data));
                      localStorage.setItem(
                        "guardId",
                        JSON.stringify(response.data.data._id)
                      );
                      localStorage.setItem(
                        "guardName",
                        JSON.stringify(response.data.data.username)
                      );
                      localStorage.setItem(
                        "userRole",
                        JSON.stringify(response.data.data.role)
                      );
                      const getGuardId = JSON.parse(
                        localStorage.getItem("guardId")
                      );
                      const getSocietyId = JSON.parse(
                        localStorage.getItem("roleId")
                      );
                      localStorage.setItem(
                        "society_id",
                        JSON.stringify(response.data.data.society_id)
                      );
                      const getCurrentTime = () => {
                        const now = new Date();
                        let hours = now.getHours();
                        const amOrPm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12;
                        const minutes = now
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");
                        return `${hours}:${minutes} ${amOrPm}`;
                      };

                      const guardLogin = async () => {
                        try {
                          const currentTime = getCurrentTime();
                          const currentDate = new Date();
                          const year = currentDate.getFullYear();
                          const month = String(
                            currentDate.getMonth() + 1
                          ).padStart(2, "0");
                          const day = String(currentDate.getDate()).padStart(
                            2,
                            "0"
                          );

                          let clockInTime;
                          let clockOutTime;

                          await axios.post(`${PORT}/guardLogin`, {
                            guardId: getGuardId,
                            societyId: getSocietyId,
                            date: `${day}/${month}/${year}`,
                            clockInTime:
                              clockOutTime !== null ? currentTime : "",
                            clockOutTime: clockInTime ? null : currentTime,
                          });
                        } catch (error) {
                          console.error("Error logging in guard:", error);
                        }
                      };
                      guardLogin();
                      // window.location.reload();
                      // setTimeout(() => {
                      // navigate("/");
                      //   setLoading(false);
                      // }, 2000);
                      setLoading(false);
                      window.location.href = "/";
                    } else {
                      setLoading(true);
                      toast.error(
                        "You do not have permission to access this Page"
                      );
                    }
                  });
                }
              } else {
                setLoading(true);
                toast.error(
                  `${
                    language === "hindi"
                      ? "You don't have a role."
                      : "आपके पास कोई भूमिका नहीं है।"
                  }`
                );
              }
            } else {
              setLoading(false);
              toast.error(
                `${
                  language === "hindi"
                    ? "Your status is Inactive"
                    : "आपकी स्थिति निष्क्रिय है।"
                }`
              );
            }
          }
        }
      }
    } catch (error) {
      setErrorForLogin(error.response.data.msg);
      setShowToast(true);
    }
  };
  const location = useLocation();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("data");
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [location, navigate]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("guardAccess");
    if (isAuthenticated) {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (location.pathname === "/profileSetting") {
      const guardname = JSON.parse(localStorage.getItem("guardName"));
      if (!guardname) {
        navigate("/login");
      }
    }
  }, [location.pathname]);
  const useRevalidateOnLanguageChange = () => {
    const { validateForm } = useFormikContext();

    React.useEffect(() => {
      validateForm(); // Trigger validation when language changes
    }, [language, validateForm]);
  };
  const RevalidateOnLanguageChange = () => {
    useRevalidateOnLanguageChange();
    return null;
  };
  return (
    <div className="background_image">
      <div
        id="overlay-gaurd"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <div className="loading_page_guard">
          <div
            aria-label="Orange and tan hamster running in a metal wheel"
            role="img"
            class="wheel-and-hamster"
          >
            <div class="wheel"></div>
            <div class="hamster">
              <div class="hamster__body">
                <div class="hamster__head">
                  <div class="hamster__ear"></div>
                  <div class="hamster__eye"></div>
                  <div class="hamster__nose"></div>
                </div>
                <div class="hamster__limb hamster__limb--fr"></div>
                <div class="hamster__limb hamster__limb--fl"></div>
                <div class="hamster__limb hamster__limb--br"></div>
                <div class="hamster__limb hamster__limb--bl"></div>
                <div class="hamster__tail"></div>
              </div>
            </div>
            <div class="spoke"></div>
          </div>
        </div>
      </div>
      <GuardLayout>
        <Navbar />
        <div className="main-form">
          <div className="form-container">
            <h2 className="login_title">
              {language === "english" ? "लॉगिन" : "LOGIN"}{" "}
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema(language)}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-field">
                    <label className="label_title" htmlFor="useremail">
                      {language === "english"
                        ? "ईमेल पता या मोबाइल नंबर"
                        : "Email address or mobile number"}
                    </label>
                    <Field type="text" name="username" maxLength="50" />
                    <div className="error_login">
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="label_title" htmlFor="password">
                      {language === "english" ? "पासवर्ड" : "Password"}
                    </label>

                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      maxLength="25"
                    />

                    <div className="error_login">
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    {loading ? (
                      <>
                        <Hourglass
                          visible={true}
                          height="20"
                          width="20"
                          ariaLabel="hourglass-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          colors={["#ffffff"]}
                          className="mt-1"
                        />
                      </>
                    ) : language === "english" ? (
                      "सबमिट"
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <RevalidateOnLanguageChange />
                </Form>
              )}
            </Formik>
            <ToastContainer />
            <div className="togglePasswordVisibilityLoginPageMainDiv">
              <div
                className="togglePasswordVisibilityLoginPage"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <IoIosEye className="eyebuttonLogin" />
                ) : (
                  <IoIosEyeOff className="eyebuttonLogin" />
                )}
              </div>
            </div>
          </div>
        </div>
      </GuardLayout>
    </div>
  );
}

export default Login;
