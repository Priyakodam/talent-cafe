import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserTie,
  FaUserPlus, 
  FaAddressBook,
} from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import "./Dashboard.css";
import Header from "./Header";
import { useAuth } from "../Context/AuthContext";
import Logout from "./LogOut";
import logo from "../Img/Company_logo.png";

const AdminDashboard = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed); 
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <div
            className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
            onClick={toggleSidebar}
          >
            <IoHomeOutline className="toggle-icon" />
          </div>
          <img src={logo} alt="Logo" className="company-logo" />
        </div>
        <div className="header-right">
          <div className="logout-button">
            <Logout />
          </div>
        </div>
      </div>

      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="position-sticky">
          <ul className="nav flex-column">
 <h2 className="text-center">{user.fullName}</h2>
            <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <Link className="nav-link" to="/dashboard" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>

            {/* <li className={`nav-item ${location.pathname === '/addemployee' ? 'active' : ''}`}>
              <Link className="nav-link" to="/addemployee" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Add Employee</span>}
              </Link>
            </li> */}

            <li className={`nav-item ${location.pathname === '/manageemployee' ? 'active' : ''}`}>
              <Link className="nav-link" to="/manageemployee" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Manage Employee</span>}
              </Link>
            </li>


            <li className={`nav-item ${location.pathname === '/clients'|| location.pathname === '/lead' ? 'active' : ''}`}>
              <Link className="nav-link" to="/clients" onClick={handleNavItemClick}>
                <FaUserTie  className="nav-icon" />
                {!collapsed && <span className="link_text">Clients</span>}
              </Link>
            </li>

         

            <li className={`nav-item ${location.pathname === '/openpositions' ? 'active' : ''}`}>
              <Link className="nav-link" to="/openpositions" onClick={handleNavItemClick}>
                <FaChalkboardTeacher className="nav-icon" />
                {!collapsed && <span className="link_text">Open Positions</span>}
              </Link>
            </li>

           

           

            <li className={`nav-item ${location.pathname === '/screening'? 'active' : ''}`}>
              <Link className="nav-link" to="/screening" onClick={handleNavItemClick}>
                <FaUserPlus    className="nav-icon" />
                {!collapsed && <span className="link_text">Screening</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/a-L1candidates' ? 'active' : ''}`}>
              <Link className="nav-link" to="/a-L1candidates" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">L1 Candidates</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/a-L2candidates' ? 'active' : ''}`}>
              <Link className="nav-link" to="/a-L2candidates" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">L2 Candidates</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/a-F2Fcandidates' ? 'active' : ''}`}>
              <Link className="nav-link" to="/a-F2Fcandidates" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">F2F Candidates</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/productivity-all-tracker'? 'active' : ''}`}>
              <Link className="nav-link" to="/productivity-all-tracker" onClick={handleNavItemClick}>
                <FaUserPlus    className="nav-icon" />
                {!collapsed && <span className="link_text">Productivity Tracker</span>}
              </Link>
            </li>
            
            <li className={`nav-item ${location.pathname === '/emp-daily-report'? 'active' : ''}`}>
              <Link className="nav-link" to="/emp-daily-report" onClick={handleNavItemClick}>
                <FaUserPlus    className="nav-icon" />
                {!collapsed && <span className="link_text">Emp Daily Report</span>}
              </Link>
            </li>

            

            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/" onClick={handleNavItemClick}>
                <FaSignOutAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Logout</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
