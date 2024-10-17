import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import "./EmployeeClient.css";
import { db } from "../../Firebase/FirebaseConfig"; // Import Firestore config
import {  doc, getDoc,updateDoc, arrayRemove, arrayUnion } from "firebase/firestore"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EmployeeViewClients = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false); 
    const [clients, setClients] = useState([]); // State to hold clients data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null); // To hold the selected client for editing
    const [editClientData, setEditClientData] = useState({});

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

    const filteredClients = clients.filter(client => 
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.mobile.includes(searchQuery) 
    );


    const handleEditClient = (client) => {
        setCurrentClient(client); // Set the client to be edited
        setEditClientData(client); // Initialize form with client's data
        setShowEditModal(true); // Show the edit modal
    };

    const handleDeleteClient = async (client) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this client?");
        
        if (confirmDelete) {
            const docRef = doc(db, 'clients_data', user.uid);
            try {
                await updateDoc(docRef, {
                    clients: arrayRemove(client) // Remove client from Firestore
                });
                setClients(clients.filter(c => c !== client)); // Update local state to remove the client
                alert("Client deleted successfully."); // Optional success message
            } catch (error) {
                console.error("Error deleting client:", error);
                alert("Failed to delete the client. Please try again."); // Optional error message
            }
        } else {
            // If user clicks "No", do nothing
            console.log("Client deletion canceled.");
        }
    };
    


    const handleSaveEdit = async () => {
        const docRef = doc(db, 'clients_data', user.uid);
        try {
            await updateDoc(docRef, {
                clients: arrayRemove(currentClient) // Remove the old client data
            });
            await updateDoc(docRef, {
                clients: arrayUnion(editClientData) // Add the updated client data
            });
            setClients(clients.map(client => client === currentClient ? editClientData : client)); // Update local state
            setShowEditModal(false); // Close the modal
        } catch (error) {
            console.error("Error updating client:", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditClientData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className='e-clients-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-clients-content ${collapsed ? 'collapsed' : ''}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                    <button onClick={handleAddClient} className="btn btn-primary">
                        <i className="fas fa-plus"></i> Add Client
                    </button>
                    <div className="position-relative">
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '200px' }} // Set width as needed
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search-button" 
                                onClick={clearSearch} 
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>
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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredClients.map((client, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{client.companyName}</td>
                                    <td>{client.contactPerson}</td>
                                    <td>{client.designation}</td>
                                    <td>{client.email}</td>
                                    <td>{client.mobile}</td>
                                    <td>{client.status}</td>
                                    <td>
                                        {/* Edit and Delete Icons */}
                                        <FontAwesomeIcon 
                                            icon={faEdit} 
                                            style={{ cursor: 'pointer', marginRight: '10px' }} 
                                            onClick={() => handleEditClient(client)} 
                                        />
                                        <FontAwesomeIcon 
                                            icon={faTrash} 
                                            style={{ cursor: 'pointer', color: 'red' }} 
                                            onClick={() => handleDeleteClient(client)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Client</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCompanyName">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companyName"
                                    value={editClientData.companyName || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formContactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactPerson"
                                    value={editClientData.contactPerson || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="designation"
                                    value={editClientData.designation || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={editClientData.email || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formMobile">
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mobile"
                                    value={editClientData.mobile || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="status"
                                    value={editClientData.status || ''}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default EmployeeViewClients;
