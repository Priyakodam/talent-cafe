import React,{useState} from 'react';
import "./ClientList.css";
import Dashboard from "../Dashboard/Dashboard";

const ClientList = () => {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className='clientlist-container'>
        <Dashboard onToggleSidebar={setCollapsed} />
        <div className={`clientlist-content ${collapsed ? 'collapsed' : ''}`}>
        ClientList
        </div>
        </div>
  )
}

export default ClientList