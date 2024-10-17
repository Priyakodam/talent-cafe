import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import "./EmployeeClient.css";
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { db } from "../../Firebase/FirebaseConfig";
import { collection, addDoc} from 'firebase/firestore';

const EmployeeClient = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false); 
    const [companyName, setCompanyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [designation, setDesignation] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('Active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clientsCollectionRef = collection(db, 'clients'); // Reference to the collection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create a new client object
        const newClient = {
            companyName,
            contactPerson,
            designation,
            mobile,
            email,
            status,
            employeeUid:user.uid,
            timestamp: new Date(),
        };

        try {
            // Add the new client to the collection
            await addDoc(clientsCollectionRef, newClient);
            console.log('Client added successfully');
            alert('Client added successfully!');

            // Reset form fields
            setCompanyName('');
            setContactPerson('');
            setDesignation('');
            setMobile('');
            setEmail('');
            setStatus('Active');

        } catch (error) {
            console.error('Error storing client data:', error);
            alert('Error storing client data. Please try again.');
        } finally {
            setIsSubmitting(false); // End submission
        }
    };

    const handlebackclick = () => {
        navigate('/e-view-clients'); // Change this path to your actual route for adding clients
    };

    return (
        <div className='e-clients-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-clients-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="d-flex justify-content-center align-items-center mt-2 pt-5">
                    <Card className="mt-4" style={{ width: '50rem' }}>
                        <Card.Header>
                            <h2>Add Client</h2>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="companyName">
                                            <Form.Label>Company Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter company name"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="contactPerson">
                                            <Form.Label>Contact Person</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter contact person"
                                                value={contactPerson}
                                                onChange={(e) => setContactPerson(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="designation">
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter designation"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="mobile">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="Enter 10-digit mobile number"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                required
                                                pattern="[0-9]{10}" 
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="status">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                required
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">InActive</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div>
                                <Button onClick={handlebackclick} variant="btn btn-secondary">
                                       Back
                                    </Button>
                                    &nbsp;
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Adding..." : "Add Client"} 
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default EmployeeClient;
