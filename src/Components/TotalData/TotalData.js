import React,{useState} from 'react';
import "./TotalData.css";
import Dashboard from "../Dashboard/Dashboard";

const TotalData = () => {
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='dashboard-container'>
        <Dashboard onToggleSidebar={setCollapsed} />
        <div className={`dashboard-content ${collapsed ? 'collapsed' : ''}`}>
        Dashboard
        </div>
        </div>
  )
}

export default TotalData