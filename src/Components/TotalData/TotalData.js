import React,{useState} from 'react';
import "./TotalData.css";
import Dashboard1 from "../Dashboard/Dashboard";
import Dashboard from "./Dashboard"

const TotalData = () => {
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='dashboard-container'>
        <Dashboard1 onToggleSidebar={setCollapsed} />
        <div className={`dashboard-content ${collapsed ? 'collapsed' : ''}`}>
       <Dashboard/>
        </div>
        </div>
  )
}

export default TotalData