import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { db } from './../../Firebase/FirebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from "../../Context/AuthContext";

const AddCompanyModal = ({ show, handleClose, fetchCompanies }) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For error display
  const clientsCollectionRef = collection(db, 'clients');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Clear any previous errors

    // Create a normalized version of the company name
    const companyNameNormalized = companyName.toLowerCase();

    try {
      // Check if the normalized company name already exists (case-insensitive check)
      const q = query(clientsCollectionRef, where("companyNameNormalized", "==", companyNameNormalized));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Client with the same company name exists
        setErrorMessage("Client details already exist");
        setIsSubmitting(false); // Stop submission
        return;
      }

      // If no duplicate is found, proceed with adding the client
      const newClient = {
        companyName, // Store original case
        companyNameNormalized, // Store lowercase for future comparisons
        contactPerson,
        designation,
        mobile,
        email,
        status,
        employeeName: user.name,
        employeeUid: user.uid,
        timestamp: new Date(),
      };

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
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          
          <Row>
            <Col md={6}>
              <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
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
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className='mt-3 ms-auto ' disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Add Company'}
</Button>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCompanyModal;
