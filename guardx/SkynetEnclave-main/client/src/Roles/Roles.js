import React, { useContext, useEffect, useState } from "react";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./role.css";
import { PORT } from "../Api/api";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
const Roles = () => {
  const { language } = useContext(LanguageContext);
  const getRoleId = JSON.parse(localStorage.getItem("roleId"));
  const getRoleLevel = localStorage.getItem("roleLevel");
  const roleType = JSON.parse(localStorage.getItem("role"));
  const guardLevelRole = JSON.parse(localStorage.getItem("roleTypeLevel"));
  //RoleFunctiolaity handle
  const [selectedRoleType, setSelectedRoleType] = useState("");
  const [societyLevelRole, setSocietyLevelRole] = useState("");
  const [societySubAdmin, setSocietySubAdmin] = useState("guardAccess");
  const [admin, setAdmin] = useState("adminRoleType");
  const validationSchema = Yup.object().shape({
    // title: Yup.string().required("Title is required"),
    // desc: Yup.string().required("Description is required"),
    permissions: Yup.array()
      .of(
        Yup.object().shape({
          moduleName: Yup.string().required("Module name is required"),
          actions: Yup.array()
            .of(Yup.string())
            .required("At least one action is required"),
        })
      )
      .required("Permissions are required"),
  });

  const initialModules = [
    { moduleName: "Regular Entries", actions: [] },
    { moduleName: "Guest Entries Request", actions: [] },
    { moduleName: "Type of Entries", actions: [] },
    { moduleName: "Purpose of Occasional", actions: [] },
    { moduleName: "House List", actions: [] },
    { moduleName: "Roles", actions: [] },
    { moduleName: "Society List", actions: [] },
    { moduleName: "Admin User", actions: [] },
    { moduleName: "Public access", actions: [] },
    { moduleName: "Attendance", actions: [] },
  ];

  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      permissions: initialModules,
      createdBy: getRoleId,
      defaultPermissionLevel: getRoleLevel,
      roleTypeLevelSociety: societyLevelRole || societySubAdmin,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Form Values:", values);
        await axios.post(`${PORT}/roleCreate`, values).then((res) => {
          toast.success(`${res.data.msg}`);
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        });
      } catch (error) {
        toast.error(`${error.response.data.msg}`);
      }
    },
  });

  const handleCheckboxChange = (moduleName, action) => {
    const updatedPermissions = formik.values.permissions.map((permission) => {
      if (permission.moduleName === moduleName) {
        if (permission.actions.includes(action)) {
          return {
            ...permission,
            actions: permission.actions.filter((a) => a !== action),
          };
        } else {
          return {
            ...permission,
            actions: [...permission.actions, action],
          };
        }
      }
      return permission;
    });
    formik.setFieldValue("permissions", updatedPermissions);
  };

  const navigate = useNavigate();
  const defaultActions = ["Module", "Create", "Read", "Edit", "Delete"];
  const [filteredModules, setFilteredModules] = useState([]);
  const filterPermissions = () => {
    return formik.values.permissions.filter((permission) => {
      switch (roleType) {
        case 1:
          switch (selectedRoleType) {
            case "saas":
              formik.setFieldValue("roleTypeLevelSociety", "saas");
              return (
                permission.moduleName !== "Public access" &&
                permission.moduleName !== "Regular Entries" &&
                permission.moduleName !== "Guest Entries Request" &&
                permission.moduleName !== "House List" &&
                permission.moduleName !== "Attendance"
              );
            case "society":
              formik.setFieldValue("roleTypeLevelSociety", "society");
              return (
                permission.moduleName !== "Society List" &&
                permission.moduleName !== "Public access"
              );
            default:
              return false;
          }
        case 2:
          switch (admin) {
            case "adminRoleType":
              return (
                permission.moduleName !== "Society List" &&
                permission.moduleName !== "Public access"
              );
            default:
              return false;
          }
        case 4:
          switch (societyLevelRole) {
            case "societyLevel":
              formik.setFieldValue("roleTypeLevelSociety", "societyLevel");
              return (
                permission.moduleName !== "Society List" &&
                permission.moduleName !== "Public access"
              );
            case "guardAccess":
              formik.setFieldValue("roleTypeLevelSociety", "guardAccess");

              return permission.moduleName === "Public access";
            default:
              return false;
          }
        case 5:
          switch (societySubAdmin) {
            case "guardAccess":
              return permission.moduleName === "Public access";
            default:
              return false;
          }
        default:
          if (selectedRoleType === "saas") {
            return true;
          }
          return false;
      }
    });
  };

  useEffect(() => {
    const modules = filterPermissions();
    setFilteredModules(modules);
  }, [formik.values.permissions, roleType, selectedRoleType, societyLevelRole]);
  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? " Add Roles" : "भूमिकाएँ जोड़ें "}
          </h5>

          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className="roles_main_div">
          <form onSubmit={formik.handleSubmit} className="form_roles">
            <div>
              <label htmlFor="title" className="editLabel">
                {language === "hindi" ? " Title" : "शीर्षक "}{" "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Title"
                className="edit-input-role"
                required
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="error-roles-title"> {formik.errors.title}</div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="desc" className="editLabel">
                {language === "hindi" ? " Description" : "विवरण  "}{" "}
                <span className="Star_color">*</span>
              </label>
              <br />
              <textarea
                id="desc"
                name="desc"
                value={formik.values.desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Description"
                className="edit-input-role"
                required
              />
              {formik.touched.desc && formik.errors.desc ? (
                <div className="error-roles-des">{formik.errors.desc}</div>
              ) : null}
            </div>
            {/* Radio buttons for role type selection */}
            {roleType === 1 && (
              <div className="role-type-selection">
                <label htmlFor="roleType" className="editLabel">
                  {language === "hindi" ? " Role Type" : "भूमिका प्रकार  "}
                  <span className="Star_color">*</span>
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="roleType"
                    value="saas"
                    required
                    checked={selectedRoleType === "saas"}
                    onChange={() => setSelectedRoleType("saas")}
                  />
                  {language === "hindi"
                    ? " SAAS Level Role"
                    : "समाज स्तर पर भूमिका "}
                </label>
                <label>
                  <input
                    type="radio"
                    name="roleType"
                    value="society"
                    required
                    checked={selectedRoleType === "society"}
                    onChange={() => setSelectedRoleType("society")}
                  />
                  {language === "hindi" ? " Society Role" : "समाज की भूमिका "}
                </label>
              </div>
            )}
            {roleType === 2 && (
              <div className="role-type-selection">
                <label htmlFor="roleType" className="editLabel">
                  {language === "hindi" ? " Role Type" : "भूमिका प्रकार  "}
                  <span className="Star_color">*</span>
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    required
                    name="roleType"
                    value="adminRoleType"
                    checked={admin === "adminRoleType"}
                    onChange={() => setAdmin("adminRoleType")}
                  />
                  {language === "hindi"
                    ? "Society Level Role"
                    : " समाज स्तर की भूमिका "}
                </label>
              </div>
            )}
            {roleType === 4 && (
              <div className="role-type-selection">
                <label htmlFor="roleType" className="editLabel">
                  {language === "hindi" ? " Role Type" : "भूमिका प्रकार  "}
                  <span className="Star_color">*</span>
                </label>
                <br />
                <label>
                  <input
                    required
                    type="radio"
                    name="roleType"
                    value="societyLevel"
                    checked={societyLevelRole === "societyLevel"}
                    onChange={() => setSocietyLevelRole("societyLevel")}
                  />
                  {language === "hindi"
                    ? "Society Level Role"
                    : " समाज स्तर की भूमिका "}
                </label>
                <label>
                  <input
                    type="radio"
                    name="roleType"
                    value="guardAccess"
                    checked={societyLevelRole === "guardAccess"}
                    onChange={() => setSocietyLevelRole("guardAccess")}
                  />
                  {language === "hindi" ? "Guard Access" : "  गार्ड एक्सेस"}
                </label>
              </div>
            )}
            {roleType === 5 && (
              <div className="role-type-selection">
                <label htmlFor="roleType" className="editLabel">
                  {language === "hindi" ? " Role Type" : "भूमिका प्रकार  "}
                  <span className="Star_color">*</span>
                </label>
                <br />

                <label>
                  <input
                    required
                    type="radio"
                    name="roleType"
                    value="guardAccess"
                    checked={societySubAdmin === "guardAccess"}
                    onChange={() => setSocietySubAdmin("guardAccess")}
                  />
                  {language === "hindi" ? "Guard Access" : "  गार्ड एक्सेस"}
                </label>
              </div>
            )}
            <br /> <br /> <br /> <br />
            <div className="main_permission">
              <table border="1">
                <thead>
                  <tr>
                    <th className="module-th-name">
                      {" "}
                      {language === "hindi"
                        ? "Module Name"
                        : "  मोड्यूल का नाम"}
                    </th>
                    <th>
                      {" "}
                      {language === "hindi"
                        ? " Module Actions"
                        : " मॉड्यूल क्रियाएँ"}
                    </th>
                  </tr>
                </thead>
                {/* <tbody>
                  {filteredModules.map((permission, index) => (
                    <tr key={index}>
                      <td>{permission.moduleName}</td>
                      <td>
                        <div className="module-action-div">
                          {permission.moduleName === "Public access" ||
                          permission.moduleName === "Attendance" ? (
                            <>
                              {permission.moduleName === "Public access" && (
                                <h4 key="Public">
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}Public`}
                                    id={`${permission.moduleName}Public`}
                                    checked={permission.actions.includes(
                                      "public"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        "public"
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.moduleName}Public`}
                                  >
                                    Public
                                  </label>
                                </h4>
                              )}
                              {permission.moduleName === "Attendance" && (
                                <h4 key="Attendance">
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}Attendance`}
                                    id={`${permission.moduleName}Attendance`}
                                    checked={permission.actions.includes(
                                      "module"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        "module"
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.moduleName}Attendance`}
                                  >
                                    Module
                                  </label>
                                </h4>
                              )}
                            </>
                          ) : // defaultActions.map((action) => (
                          //   <h4 key={action}>
                          //     <input
                          //       type="checkbox"
                          //       name={`${permission.moduleName}${action}`}
                          //       id={`${permission.moduleName}${action}`}
                          //       checked={permission.actions.includes(
                          //         action.toLowerCase()
                          //       )}
                          //       onChange={() =>
                          //         handleCheckboxChange(
                          //           permission.moduleName,
                          //           action.toLowerCase()
                          //         )
                          //       }
                          //     />
                          //     <label
                          //       htmlFor={`${permission.moduleName}${action}`}
                          //     >
                          //       {action}
                          //     </label>
                          //   </h4>
                          // ))
                          roleType === 4 &&
                            societyLevelRole === "societyLevel" ? (
                               defaultActions
                              .filter((action) => action.toLowerCase() !== "edit")
                              .map((action) => (
                                <td key={action}>
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}${action}`}
                                    id={`${permission.moduleName}${action}`}
                                    checked={permission.actions.includes(
                                      action.toLowerCase()
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        action.toLowerCase()
                                      )
                                    }
                                  />
                                </td>
                              ))
                          ) : (
                            defaultActions.map((action) => (
                              <td key={action}>
                                <input
                                  type="checkbox"
                                  name={`${permission.moduleName}${action}`}
                                  id={`${permission.moduleName}${action}`}
                                  checked={permission.actions.includes(
                                    action.toLowerCase()
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      permission.moduleName,
                                      action.toLowerCase()
                                    )
                                  }
                                />
                              </td>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {filteredModules.map((permission, index) => (
                    <tr key={index}>
                      <td>{permission.moduleName}</td>
                      <td>
                        <div className="module-action-div">
                          {permission.moduleName === "Public access" ||
                          permission.moduleName === "Attendance" ? (
                            <>
                              {permission.moduleName === "Public access" && (
                                <h4 key="Public">
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}Public`}
                                    id={`${permission.moduleName}Public`}
                                    checked={permission.actions.includes(
                                      "public"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        "public"
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.moduleName}Public`}
                                  >
                                    Public
                                  </label>
                                </h4>
                              )}
                              {permission.moduleName === "Attendance" && (
                                <h4 key="Attendance">
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}Attendance`}
                                    id={`${permission.moduleName}Attendance`}
                                    checked={permission.actions.includes(
                                      "module"
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        "module"
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.moduleName}Attendance`}
                                  >
                                    Module
                                  </label>
                                </h4>
                              )}
                            </>
                          ) : roleType === 4 &&
                            societyLevelRole === "societyLevel" ? (
                            // Filter out "edit" for specific modules only
                            defaultActions
                              .filter((action) => {
                                // Hide "edit" for specific modules only
                                if (
                                  (permission.moduleName ===
                                    "Type of Entries" ||
                                    permission.moduleName ===
                                      "Purpose of Occasional") &&
                                  action.toLowerCase() === "edit"
                                ) {
                                  return false;
                                }
                                return true;
                              })
                              .map((action) => (
                                <td key={action} className="td_permission">
                                  <input
                                    type="checkbox"
                                    name={`${permission.moduleName}${action}`}
                                    id={`${permission.moduleName}${action}`}
                                    checked={permission.actions.includes(
                                      action.toLowerCase()
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        permission.moduleName,
                                        action.toLowerCase()
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${permission.moduleName}${action}`}
                                  >
                                    {action}
                                  </label>
                                </td>
                              ))
                          ) : (
                            defaultActions.map((action) => (
                              <td key={action}>
                                <input
                                  type="checkbox"
                                  name={`${permission.moduleName}${action}`}
                                  id={`${permission.moduleName}${action}`}
                                  checked={permission.actions.includes(
                                    action.toLowerCase()
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      permission.moduleName,
                                      action.toLowerCase()
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${permission.moduleName}${action}`}
                                >
                                  {action}
                                </label>
                              </td>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="role_submit_btn">
              <button
                className="edit-button edit_btn_create_role"
                type="submit"
              >
                Create Role
              </button>
            </div>
          </form>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default Roles;
