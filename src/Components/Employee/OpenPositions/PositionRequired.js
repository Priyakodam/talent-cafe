import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { db } from './../../Firebase/FirebaseConfig'; 

const AddPositionModal = ({ show, handleClose, fetchPositions }) => {
  const [positionName, setPositionName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false); // New state for saving condition

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Disable the button during the save operation
    try {
      await db.collection('positionsrequired').add({
        positionName,
        description,
        createdAt: new Date(),
      });
      // Reset fields and close modal after saving
      setPositionName('');
      setDescription('');
      fetchPositions(); // Fetch updated positions
      handleClose();
    } catch (error) {
      console.error("Error adding position:", error);
    } finally {
      setIsSaving(false); // Re-enable button after saving
    }
  };

  // Determine if the save button should be disabled (empty fields or while saving)
  const isSaveDisabled = isSaving || !positionName.trim() || !description.trim();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Position</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Position Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter position name"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          onClick={handleSubmit} 
          disabled={isSaveDisabled} // Disable if conditions are not met
        >
          {isSaving ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Add Position'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPositionModal;
