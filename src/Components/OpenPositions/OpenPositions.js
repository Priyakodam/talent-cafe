import React,{useState} from 'react';
import "./OpenPositions.css";
import Dashboard from "../Dashboard/Dashboard";

const OpenPositions = () => {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className='openpositions-container'>
        <Dashboard onToggleSidebar={setCollapsed} />
        <div className={`openpositions-content ${collapsed ? 'collapsed' : ''}`}>
        OpenPositions
        </div>
        </div>
  )
}

export default OpenPositions