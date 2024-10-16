import React,{useState} from 'react';
import "./Screening.css";
import Dashboard from "../Dashboard/Dashboard";

const Screening = () => {
    const [collapsed, setCollapsed] = useState(false);


  return (
    <div className='screening-container'>
        <Dashboard onToggleSidebar={setCollapsed} />
        <div className={`screening-content ${collapsed ? 'collapsed' : ''}`}>
        Screening
        </div>
        </div>
  )
}

export default Screening