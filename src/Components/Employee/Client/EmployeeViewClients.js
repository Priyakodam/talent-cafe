import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { db } from "../../Firebase/FirebaseConfig"; 
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './EmployeeClient.css';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const EmployeeViewClients = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [clients, setClients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [editFormData, setEditFormData] = useState({
        companyName: '',
        contactPerson: '',
        designation: '',
        email: '',
        mobile: '',
        status: 'Active'
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsCollectionRef = collection(db, 'clients');
                const q = query(clientsCollectionRef, orderBy("timestamp", "desc"));
                const clientDocs = await getDocs(q);

                const clientData = clientDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setClients(clientData);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    const handleEditClick = (client) => {
        setCurrentClient(client);
        setEditFormData(client);
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const clientDocRef = doc(db, 'clients', currentClient.id);
            await updateDoc(clientDocRef, editFormData);
            alert('Client updated successfully!');

            setClients(prevClients => prevClients.map(client =>
                client.id === currentClient.id ? { ...client, ...editFormData } : client
            ));

            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating client:", error);
            alert('Error updating client data.');
        }
    };

    const handleDeleteClick = async (clientId) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                const clientDocRef = doc(db, 'clients', clientId);
                await deleteDoc(clientDocRef);

                setClients(prevClients => prevClients.filter(client => client.id !== clientId));
                alert('Client deleted successfully!');
            } catch (error) {
                console.error("Error deleting client:", error);
                alert('Error deleting client.');
            }
        }
    };

    const handleAddClient = () => {
        navigate('/e-clients');
    };

    return (
        <div className='e-clients-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-clients-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="header-container">
                    <h2 className='mt-3'>Client List</h2>
                    <button onClick={handleAddClient} className="btn btn-primary">
                        <i className="fas fa-plus"></i> Add Client
                    </button>
                </div>
                <div className="table-responsive">
                    <Table striped bordered hover className="client-table">
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
                            {clients.map((client, index) => (
                                <tr key={client.id}>
                                    <td>{index + 1}</td>
                                    <td>{client.companyName}</td>
                                    <td>{client.contactPerson}</td>
                                    <td>{client.designation}</td>
                                    <td>{client.email}</td>
                                    <td>{client.mobile}</td>
                                    <td>{client.status}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(client)} className="btn btn-warning btn-sm">
                                            Edit
                                        </button>
                                        &nbsp;
                                        <button onClick={() => handleDeleteClick(client.id)} className="btn btn-danger btn-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="companyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={editFormData.companyName}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="contactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactPerson"
                                value={editFormData.contactPerson}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="designation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                name="designation"
                                value={editFormData.designation}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="mobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                type="tel"
                                name="mobile"
                                value={editFormData.mobile}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={editFormData.status}
                                onChange={handleInputChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeViewClients;
