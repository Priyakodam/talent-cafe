import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { db } from "../../Firebase/FirebaseConfig"; // Import Firestore config
import { collection, getDocs, query, orderBy  } from 'firebase/firestore';
import './EmployeeClient.css';
import Table from 'react-bootstrap/Table';

const EmployeeViewClients = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsCollectionRef = collection(db, 'clients'); // Reference to the clients collection
                // Query to order clients by timestamp in descending order (most recent first)
                const q = query(clientsCollectionRef, orderBy("timestamp", "desc")); 
                const clientDocs = await getDocs(q);
    
                const clientData = clientDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                setClients(clientData); // Store the client data in state
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
    
        fetchClients();
    }, []);// Dependency array includes user.uid to re-fetch data if user changes

    const handleAddClient = () => {
        navigate('/e-clients'); // Change this path to your actual route for adding clients
    };



    return (
        <div className='e-clients-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-clients-content ${collapsed ? 'collapsed' : ''}`}>
            <button onClick={handleAddClient} className="btn btn-primary">
                        <i className="fas fa-plus"></i> Add Client
                    </button>
                <h2 className='mt-3'>Client List</h2>
                <div className="table-responsive">
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Designation</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Status</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => (
                                <tr key={client.id}>
                                    <td>{index+1}</td>
                                    <td>{client.companyName}</td>
                                    <td>{client.contactPerson}</td>
                                    <td>{client.designation}</td>
                                    <td>{client.email}</td>
                                    <td>{client.mobile}</td>
                                    <td>{client.status}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeViewClients;
