import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import "./EmployeeClient.css";
import { db } from "../../Firebase/FirebaseConfig"; // Import Firestore config
import {  doc, getDoc } from "firebase/firestore"; 
import Table from 'react-bootstrap/Table';


const EmployeeViewClients = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false); 
    const [clients, setClients] = useState([]); // State to hold clients data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Get the document that matches the user's UID
                const docRef = doc(db, 'clients_data', user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const clientArray = docSnap.data().clients; // Extract the clients array from the document
                    
                    const sortedClients = clientArray.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
                    setClients(sortedClients); // Set the state with the fetched clients data
                } else {
                    setError("No clients found for this user.");
                }
            } catch (error) {
                setError("Error fetching clients: " + error.message);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchClients();
    }, [user.uid]); 

    const handleAddClient = () => {
        navigate('/e-clients'); // Change this path to your actual route for adding clients
    };

    return (
        <div className='e-clients-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-clients-content ${collapsed ? 'collapsed' : ''}`}>
            <button onClick={handleAddClient} className="btn btn-primary mb-3">
            <i className="fas fa-plus"></i> Add Client
                </button>
                <h2>Clients List</h2>
                
                {loading && <p>Loading clients...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                    <Table striped bordered hover>
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
                                <tr key={index}>
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
                )}
            </div>
        </div>
    );
};

export default EmployeeViewClients;
