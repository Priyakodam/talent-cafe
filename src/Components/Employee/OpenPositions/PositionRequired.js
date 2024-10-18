import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { db } from './../../Firebase/FirebaseConfig'; 

const AddPositionModal = ({ show, handleClose, fetchPositions }) => {
  const [positionName, setPositionName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('positionsrequired').add({
        positionName,
        description,
        createdAt: new Date(),
      });
      console.log("Position added successfully");
      fetchPositions(); // Fetch updated positions
      handleClose(); // Close the modal after success
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Position</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Position Name:</label>
            <input
              type="text"
              className="form-control"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary">Add Position</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPositionModal;
