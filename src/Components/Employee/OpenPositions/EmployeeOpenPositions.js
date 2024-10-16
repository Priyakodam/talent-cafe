import React,{useState} from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth }  from "../../Context/AuthContext";
import "./EmployeeOpenPositions.css";

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);  
  return (
    <div className='e-openpositions-container'>
        <EmployeeDashboard onToggleSidebar={setCollapsed} />
        <div className={`e-openpositions-content ${collapsed ? 'collapsed' : ''}`}>
<h2>Welcome, {user.name}</h2>
<h3>Open Positions</h3>
       
        </div>
        </div>
  )
}

export default OpenPositions