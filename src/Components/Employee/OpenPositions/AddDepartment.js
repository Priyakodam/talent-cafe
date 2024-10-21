import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { db } from './../../Firebase/FirebaseConfig';

const AddDepartmentModal = ({ show, handleClose, fetchDepartments }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false); // New state for saving condition

  const handleSave = async () => {
    setIsSaving(true); // Disable button during save operation
    try {
      await db.collection('departments').add({
        departmentName,
        departmentDescription,
        createdAt: new Date(),
      });
      // Reset fields and close modal after saving
      setDepartmentName('');
      setDepartmentDescription('');
      fetchDepartments(); // Fetch updated departments
      handleClose();
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      setIsSaving(false); // Re-enable button after save operation
    }
  };

  // Determine if save button should be disabled (empty fields or while saving)
  const isSaveDisabled = isSaving || !departmentName.trim() || !departmentDescription.trim();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Department</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Department Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter department description"
              value={departmentDescription}
              onChange={(e) => setDepartmentDescription(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={isSaveDisabled} // Disable button if conditions are not met
        >
          {isSaving ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Save Department'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDepartmentModal;
