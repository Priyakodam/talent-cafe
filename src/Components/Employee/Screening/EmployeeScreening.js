import React,{useState} from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth }  from "../../Context/AuthContext";
import "./EmployeeScreening.css";

const EmployeeScreening = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false); 

  return (
    <div className='e-screening-container'>
    <EmployeeDashboard onToggleSidebar={setCollapsed} />
    <div className={`e-screening-content ${collapsed ? 'collapsed' : ''}`}>
<h2>Welcome, {user.name}</h2>
<h3>Open Positions</h3>
   
    </div>
    </div>
  )
}

export default EmployeeScreening