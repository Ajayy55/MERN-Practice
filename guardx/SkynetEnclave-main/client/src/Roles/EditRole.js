import React, { useContext } from "react";
import AdminNavbar from "../AdminPannel/AdminNavbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { PORT } from "../Api/api";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useState } from "react";
import Layout from "../lib/Layout";
import AddBackbtn from "../lib/AddBackbtn";
import { LanguageContext } from "../lib/LanguageContext";
const EditRole = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [selectedRoleType, setSelectedRoleType] = useState("");
  const [societyLevelRole, setSocietyLevelRole] = useState();
  const [societySubAdmin, setSocietySubAdmin] = useState("guardAccess");
  const roleType = JSON.parse(localStorage.getItem("role"));
  const [roleData, setRoleData] = useState();
  const [admin, setAdmin] = useState("adminRoleType");
  const getRoleDataWithId = async (id) => {
    try {
      await axios.get(`${PORT}/getEditRole/${id}`).then((res) => {
        console.log("getEditRole", res.data.getEditData);
        setRoleData(res.data.getEditData);
      });
    } catch (error) {}
  };

  useEffect(() => {
    getRoleDataWithId(id);
  }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
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
    { moduleName: "Public access", actions: [] },
  ];
  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      permissions: initialModules,
      roleTypeLevelSociety: societyLevelRole,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values, "99999");
      console.log(values, "udate values");
      try {
        await axios.put(`${PORT}/editRole/${id}`, values).then((res) => {
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
              formik.setFieldValue("roleTypeLevelSociety", societyLevelRole);
              return (
                permission.moduleName !== "Society List" &&
                permission.moduleName !== "Public access"
              );
            case "guardAccess":
              formik.setFieldValue("roleTypeLevelSociety", societyLevelRole);
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

  useEffect(() => {
    if (roleData) {
      formik.setValues({
        title: roleData.title,
        desc: roleData.desc,
        permissions: roleData.permissions,
        roleTypeLevelSociety: roleData.roleTypeLevelSociety,
      });
    }
  }, [roleData]);

  return (
    <>
      <Layout>
        <div className="table_heading">
          <h5 className="heading_top">
            {language === "hindi" ? "Edit Roles" : "भूमिकाएँ संपादित करें "}
          </h5>
          <div className="hrline"></div>
        </div>
        <AddBackbtn />
        <div className=" roles_main_div">
          <form onSubmit={formik.handleSubmit} className="form_roles">
            <div>
              <label htmlFor="title" className="editLabel">
                {language === "hindi" ? "Title" : "शीर्षक  "}
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
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="error"> {formik.errors.title}</div>
              ) : null}
            </div>
            <br />
            <div>
              <label htmlFor="desc" className="editLabel">
                {language === "hindi" ? " Description" : "विवरण   "}
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
              />
              {formik.touched.desc && formik.errors.desc ? (
                <div className="error">{formik.errors.desc}</div>
              ) : null}
            </div>
            <br />
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
                    checked={formik.values.roleTypeLevelSociety === "saas"}
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
                    checked={formik.values.roleTypeLevelSociety === "society"}
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
                    type="radio"
                    name="roleType"
                    value="societyLevel"
                    checked={
                      formik.values.roleTypeLevelSociety === "societyLevel"
                    }
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
                    checked={
                      formik.values.roleTypeLevelSociety === "guardAccess"
                    }
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
            {/* <label htmlFor="permissions" className="editLabel">Permissions</label> <br /><br /> */}
            <div className="main_permission">
              <table border="1">
                <thead>
                  <tr>
                    <th className="module-th-name">
                      {language === "hindi"
                        ? "Module Name"
                        : "  मोड्यूल का नाम"}
                    </th>
                    <th>
                      {language === "hindi"
                        ? " Module Actions"
                        : " मॉड्यूल क्रियाएँ"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((permission, index) => (
                    <tr key={index}>
                      <td>{permission.moduleName}</td>
                      <td>
                        <div className="module-action-div">
                          {permission.moduleName === "Public access" ? (
                            <h4 key="Public">
                              <input
                                type="checkbox"
                                name={`${permission.moduleName}Public`}
                                id={`${permission.moduleName}Public`}
                                checked={permission.actions.includes("public")}
                                onChange={() =>
                                  handleCheckboxChange(
                                    permission.moduleName,
                                    "public"
                                  )
                                }
                              />
                              <label htmlFor={`${permission.moduleName}Public`}>
                                {language === "hindi" ? " Public" : "जनता"}
                              </label>
                            </h4>
                          ) : (
                            defaultActions.map((action) => (
                              <h4 key={action}>
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
                              </h4>
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
                className="edit-button  edit_btn_create_role"
                type="submit"
              >
                Update Role
              </button>
            </div>
          </form>
        </div>
      </Layout>
      <ToastContainer />
    </>
  );
};

export default EditRole;
