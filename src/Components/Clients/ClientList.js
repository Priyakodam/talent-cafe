import React, { useEffect, useState } from 'react';
import "./ClientList.css";
import Dashboard from "../Dashboard/Dashboard";
import { db } from "../Firebase/FirebaseConfig"; // Import Firestore config
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Table from 'react-bootstrap/Table';

const ClientList = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsCollectionRef = collection(db, 'clients'); // Reference to the clients collection
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
    }, []); // Empty dependency array to run once when the component mounts

    return (
        <div className='clientlist-container'>
            <Dashboard onToggleSidebar={setCollapsed} />
            <div className={`clientlist-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="card shadow-lg clientlist-card"> {/* Card container for the table */}
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2 className="mt-2">Client List</h2>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table className="styled-table" bordered hover>
                                <thead className="thead-custom">
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
                                            <td>{index + 1}</td>
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
            </div>
        </div>
    );
}

export default ClientList;
