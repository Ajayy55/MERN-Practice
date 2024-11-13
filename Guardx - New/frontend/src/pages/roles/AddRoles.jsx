import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePermissions } from "../../context/PermissionsContext";

function AddRoles() {
  const { hasPermission, userRole } = usePermissions();
  const Actions = ["All", "Module", "Create", "Read", "Edit", "Delete"];
  
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
  
  const guardModules = [{ moduleName: 'Public access', actions: ['Module', 'Read', 'Create'] }];

  const [roleType, setRoleType] = useState(null);

  const getModules = () => {
    switch (roleType) {
      case 'saas':
        return saasModules;
      case 'society':
        return societyModules;
      case 'guardAccess':
        return guardModules;
      default:
        return [];
    }
  };

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
      const payload = {
        ...values,
        permissions: getModules().reduce((acc, module) => {
           acc[module.moduleName] = {moduleName:module.moduleName,actions:formik.values.permissions[module.moduleName] || []};
          return acc;
        }, {})
      };
      console.log("Submitting data:", payload);
      await fetch('/api/saveRole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
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
                              setRoleType('society');
                              formik.setFieldValue("roleType", "society");
                            }}
                          />
                          <label htmlFor="society" className="pe-4">Society Level</label>
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
