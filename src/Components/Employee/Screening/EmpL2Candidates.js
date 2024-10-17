import React,{useState} from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth }  from "../../Context/AuthContext";
import "./EmpL2Candidates.css";

const L2Candidates = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);  
  return (
    <div className='e-L2Candidates-container'>
        <EmployeeDashboard onToggleSidebar={setCollapsed} />
        <div className={`e-L2Candidates-content ${collapsed ? 'collapsed' : ''}`}>
<h2>Welcome, {user.name}</h2>
<h3>Open Positions</h3>
       
        </div>
        </div>
  )
}

export default L2Candidates