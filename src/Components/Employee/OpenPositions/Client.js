import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db } from './../../Firebase/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const AddCompanyModal = ({ show, handleClose, fetchCompanies }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'clients'), {
        companyName,
        contactPerson,
        designation,
        mobile,
        email,
        status: 'Active',
        timestamp: new Date(),
      });
      fetchCompanies(); // Refresh companies in parent component
      handleClose(); // Close modal after submission
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="companyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="contactPerson">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="designation">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="mobile">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Company
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCompanyModal;
