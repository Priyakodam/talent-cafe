import React,{useState} from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth }  from "../../Context/AuthContext";
import "./EmployeeTotalData.css";
const EmployeeTotalData = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='e-dashboard-container'>
        <EmployeeDashboard onToggleSidebar={setCollapsed} />
        <div className={`e-dashboard-content ${collapsed ? 'collapsed' : ''}`}>
<h2>Welcome, {user.name}</h2>
       
        </div>
        </div>
        
  )
}

export default EmployeeTotalData