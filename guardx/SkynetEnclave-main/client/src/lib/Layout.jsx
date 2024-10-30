import AdminNavbar from "../AdminPannel/AdminNavbar";
import { MdDashboard } from "react-icons/md";
import CommonNav from "../AdminSetting/CommonNav";
import { useLocation, useNavigate } from "react-router-dom";
import NavConfig from "./RoutePath";
import { useEffect } from "react";
import "./layout.css";
const Layout = ({ children }) => {
  const navConfig = NavConfig();
  const location = useLocation();
  const currentPath = location.pathname;
  const matchPath = (path, currentPath) => {
    const pathParts = path.split("/");
    const currentPathParts = currentPath.split("/");
    if (pathParts.length !== currentPathParts.length) return false;
    return pathParts.every(
      (part, index) => part.startsWith(":") || part === currentPathParts[index]
    );
  };
  const currentNavConfig =
    navConfig.find((nav) => matchPath(nav.path, currentPath)) || {};
  const { title = "Dashboard", icon: Icon = MdDashboard } = currentNavConfig;

  return (
    <section>
      <body className="g-sidenav-show   bg-gray-100">
        <div className="min-height-300 bg-primary position-absolute w-100"></div>
        <AdminNavbar />
        <main className="main-content  position-relative border-radius-lg ">
          <nav
            className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl "
            id="navbarBlur"
            data-scroll="false"
          >
            <div className="container-fluid py-1 px-3">
              <nav aria-label="breadcrumb">
                <h6 className="font-weight-bolder text-white mb-0 navbar_title">
                  {title} <Icon className="navbar_icon_title" />
                </h6>
              </nav>
              <div
                className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                id="navbar"
              >
                <div className="ms-md-auto pe-md-3 d-flex align-items-center"></div>
                <CommonNav />
              </div>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </section>
  );
};
export default Layout;
