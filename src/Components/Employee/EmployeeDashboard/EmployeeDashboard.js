import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaAddressBook,
  FaSignOutAlt,
  FaUserTie,
  FaUserPlus, 
} from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import "./EmployeeDashboard.css";
import Header from "../../Dashboard/Header";
import { useAuth } from '../../Context/AuthContext';
import Logout from "../../Dashboard/LogOut";
import logo from "../../Img/Company_logo.png";

const EmployeeDashboard = ({ onToggleSidebar }) => {
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
            {/* <li className="nav-item">
              <div
                className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
                onClick={toggleSidebar}
              >
                <IoHomeOutline className="toggle-icon" />
              </div>
            </li> */}
 <h2 className="text-center">{user.name}</h2>
            <li className={`nav-item ${location.pathname === '/e-dashboard' ? 'active' : ''}`}>
              <Link className="nav-link" to="/e-dashboard" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/e-view-clients'? 'active' : ''}`}>
              <Link className="nav-link" to="/e-view-clients" onClick={handleNavItemClick}>
                <FaUserPlus    className="nav-icon" />
                {!collapsed && <span className="link_text">Clients</span>}
              </Link>
            </li>
           

           

            <li className={`nav-item ${location.pathname === '/e-openpositions'|| location.pathname === '/lead' ? 'active' : ''}`}>
              <Link className="nav-link" to="/e-openpositions" onClick={handleNavItemClick}>
                <FaUserTie  className="nav-icon" />
                {!collapsed && <span className="link_text">Open Positions</span>}
              </Link>
            </li>

            

            {/* <li className={`nav-item ${location.pathname === '/e-applicant' ? 'active' : ''}`}>
              <Link className="nav-link" to="/e-applicant" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">Applicants</span>}
              </Link>
            </li> */}

            <li className={`nav-item ${location.pathname === '/e-screening' ? 'active' : ''}`}>
              <Link className="nav-link" to="/e-screening" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">Screening</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/e-L1candidates' ? 'active' : ''}`}>
              <Link className="nav-link" to="/e-L1candidates" onClick={handleNavItemClick}>
                <FaAddressBook className="nav-icon" />
                {!collapsed && <span className="link_text">L1 Candidates</span>}
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

export default EmployeeDashboard;
