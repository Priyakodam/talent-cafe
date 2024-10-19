import React,{useState} from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth }  from "../../Context/AuthContext";
import "./EmployeeTotalData.css";
import Dashboard from './Dashboard';
const EmployeeTotalData = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='e-dashboard-container'>
        <EmployeeDashboard onToggleSidebar={setCollapsed} />
        <div className={`e-dashboard-content ${collapsed ? 'collapsed' : ''}`}>
<Dashboard/>
        </div>
        </div>
        
  )
}

export default EmployeeTotalData