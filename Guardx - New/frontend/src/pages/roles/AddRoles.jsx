import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePermissions } from "../../context/PermissionsContext";
import axios from "axios";
import { PORT } from "../../port/Port";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BackButton from "../utils/BackButton";


function AddRoles() {
  const { hasPermission, userRole } = usePermissions();
  const [selectFlag,setSelectFlag]=useState([])
  const Actions = ["All", "Module", "Create", "Read", "Edit", "Delete"];
  const navigate=useNavigate();
  // console.log(userRole.permissionLevel);
  
  const saasModules = [
    { moduleName: 'Society List', actions: Actions },
    { moduleName: 'Type of Entries', actions: Actions },
    { moduleName: 'Purpose of Occasional', actions: Actions },
    { moduleName: 'Users', actions: Actions },
    { moduleName: 'Roles', actions: Actions },
  ];
  
  const societyModules = [
    { moduleName: 'Regular Entries', actions: Actions },
    { moduleName: 'Guest Entries', actions: Actions },
    { moduleName: 'Type of Entries', actions: Actions },
    { moduleName: 'Purpose of Occasional', actions: Actions },
    { moduleName: 'House List', actions: Actions },
    { moduleName: 'Attendance', actions: Actions },
    { moduleName: 'Announcements', actions: Actions },
    { moduleName: 'Complaints', actions: Actions },
    { moduleName: 'Users', actions: Actions },
    { moduleName: 'Roles', actions: Actions },
  ];
  
  const guardModules = [{ moduleName: 'Public access', actions: ['All','Module', 'Read', 'Create'] }];

  const [roleType, setRoleType] = useState(null);

  const getModules = () => {
    switch (roleType) {
      case 'saas':
        return saasModules;
      case 'society':
        return societyModules;
      case 'subSociety':
        return societyModules;
      case 'guardAccess':
        return guardModules;
      default:
        return [];
    }
  };
  
  
  const setPermissionLevel=()=>{
    switch(roleType){
      case 'saas': return 2;
      case 'society': return 3;
      case 'subSociety': return 4;
      case 'guardAccess': return 5;
    }
  }

  const formik = useFormik({
    initialValues: {
      roleTitle: '',
      roleDesc: '',
      roleType: '',
      permissions: {}
    },
    validationSchema: Yup.object({
      roleTitle: Yup.string().required("Role Title is required"),
      roleDesc: Yup.string(),
      roleType: Yup.string().required("Role Type is required"),
    }),
    onSubmit: async (values) => {
      let perm;
      const payload = {
        createdBy:localStorage.getItem('user'),
        permissionLevel:setPermissionLevel(),
        ...values,
        permissions: getModules().reduce((acc, module) => {
          // acc[module.moduleName] = formik.values.permissions[module.moduleName] || [];
           acc[module.moduleName] = {moduleName:module.moduleName,actions:formik.values.permissions[module.moduleName] || []};
          // acc = [{moduleName:module.moduleName,actions:formik.values.permissions[module.moduleName] || []}];
          return acc;
        }, {})
      };
      console.log("Submitting data:", payload);
      try {
        const url=`${PORT}addUserRoles`;
        const response=await axios.post(url,payload)
        console.log(response);
        
        if (response.status == 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response?.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/roles");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error?.response?.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        
      }
    },
  });

  // Toggle all permissions when "All" is checked
  const handleAllToggle = (moduleName, checked) => {
    const newPermissions = { ...formik.values.permissions };
    newPermissions[moduleName] = checked ? [...Actions] : [];
    formik.setFieldValue("permissions", newPermissions);
 
  };



  // Handle individual checkbox changes
  const handlePermissionChange = (moduleName, action, checked) => {
    const modulePermissions = formik.values.permissions[moduleName] || [];
    let updatedPermissions;

    if (checked) {
      updatedPermissions = action === "All" ? [...Actions] : [...new Set([...modulePermissions, action])];
    } else {
      updatedPermissions = modulePermissions.filter(item => item !== action && item !== "All");
    }

    formik.setFieldValue(`permissions.${moduleName}`, updatedPermissions);
   
  };


  
  return (
    <Layout>
      <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="container mt-0">
          <div> <BackButton/></div>
            {hasPermission("Roles", "Create") && (
              <form onSubmit={formik.handleSubmit}>
                <div className="card p-4">
                  <h3 className="card-title text-center">Add Roles Details</h3>
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <label htmlFor="roleTitle" className="form-label">
                        Role Title<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roleTitle"
                        name="roleTitle"
                        value={formik.values.roleTitle}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.roleTitle && formik.errors.roleTitle ? (
                        <div className="text-danger">{formik.errors.roleTitle}</div>
                      ) : null}
                    </div>

                    <div className="col-md-4 mb-4">
                      <label htmlFor="roleDesc" className="form-label">Role Description</label>
                      <input
                        type="text"
                        className="form-control"
                        id="roleDesc"
                        name="roleDesc"
                        value={formik.values.roleDesc}
                        onChange={formik.handleChange}
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label htmlFor="roleType" className="form-label">Role Type<span className="text-danger">*</span></label>
                      <br />
                      {userRole && userRole.permissionLevel <= 2 ? (
                        <>
                          <input
                            type="radio"
                            id="saas"
                            name="roleType"
                            onClick={() => {
                              setRoleType('saas');
                              formik.setFieldValue("roleType", "saas");
                            }}
                          />
                          <label htmlFor="saas" className="pe-4">SAAS Level</label>
                          <input
                            type="radio"
                            id="society"
                            name="roleType"
                            onClick={() => {
                              setRoleType('society');
                              formik.setFieldValue("roleType", "society");
                            }}
                          />
                          <label htmlFor="society">Society Level</label>
                        </>
                      ) : (
                        <>
                          <input
                            type="radio"
                            id="society"
                            name="roleType"
                            onClick={() => {
                              setRoleType('subSociety');
                              formik.setFieldValue("roleType", "subSociety");
                            }}
                          />
                          <label htmlFor="society" className="pe-4">Sub Society Level</label>
                          <input
                            type="radio"
                            id="guard"
                            name="roleType"
                            onClick={() => {
                              setRoleType('guardAccess');
                              formik.setFieldValue("roleType", "guardAccess");
                            }}
                          />
                          <label htmlFor="guard">Guard Access</label>
                        </>
                      )}
                      {formik.touched.roleType && formik.errors.roleType ? (
                        <div className="text-danger">{formik.errors.roleType}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Assign Modules</h4>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Module Name</th>
                            <th>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getModules().map((module, index) => (
                            <tr key={index}>
                              <td>{module.moduleName}</td>
                              <td className="d-flex justify-content-between">
                                {module.actions.map((action) => (
                                  <span key={action}>
                                    <input
                                      type="checkbox"
                                      checked={
                                        formik.values.permissions[module.moduleName]?.includes(action) || false
                                      }
                                      onChange={(e) => {
                                        if (action === "All") {
                                          handleAllToggle(module.moduleName, e.target.checked);
                                        } else {
                                          handlePermissionChange(module.moduleName, action, e.target.checked);
                                        }
                                      }}
                                    />
                                    
                                    <label style={{ display: "contents" }}>{action}</label>
                                  </span>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Save Role</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddRoles;
