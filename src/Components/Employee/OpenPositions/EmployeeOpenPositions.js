import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from './../../Firebase/FirebaseConfig';
import "./EmployeeOpenPositions.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddPositionModal from './PositionRequired'; // Import the modal component

const OpenPositions = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [positionTitle, setPositionTitle] = useState('');
  const [positionFrom, setPositionFrom] = useState('');
  const [budget, setBudget] = useState('');
  const [experience, setExperience] = useState(""); // Set default value for range
  const [numOfOpenPositions, setNumOfOpenPositions] = useState(''); // New field for number of positions
  const [status, setStatus] = useState('active');
  const [positions, setPositions] = useState([]); // For the positions dropdown
  const [showModal, setShowModal] = useState(false); // Modal state

  // Fetch positions from Firestore
  const fetchPositions = async () => {
    try {
      const snapshot = await db.collection('positionsrequired').get();
      const positionList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPositions(positionList);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []); // Fetch positions on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('position').add({
        positionTitle,
        positionFrom,
        budget,
        experience,
        numOfOpenPositions, // Save the new field in Firestore
        status,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      console.log("Position added successfully");
      // Resetting form fields after submission
      setPositionTitle('');
      setPositionFrom('');
      setBudget('');
      setExperience(1); // Reset experience range input
      setNumOfOpenPositions(''); // Reset new field
      setStatus('active');
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <div className='e-openpositions-container'>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`e-openpositions-content ${collapsed ? 'collapsed' : ''}`}>
        <h2>Welcome, {user.name}</h2>
        <h3>Open Positions</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Position Title:</label>
                <div className="input-group">
                  <select
                    className="form-control"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(position => (
                      <option key={position.id} value={position.positionName}>{position.positionName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(true)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Position From:</label>
                <input
                  type="text"
                  className="form-control"
                  value={positionFrom}
                  onChange={(e) => setPositionFrom(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Budget:</label>
                <input
                  type="number"
                  className="form-control"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Experience (years):</label>
                <input
                  type="number"
                  className="form-control"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Number of Open Positions:</label> {/* New input field */}
                <input
                  type="number"
                  className="form-control"
                  value={numOfOpenPositions}
                  onChange={(e) => setNumOfOpenPositions(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        {/* Modal for adding position */}
        <AddPositionModal 
          show={showModal} 
          handleClose={() => setShowModal(false)} 
          fetchPositions={fetchPositions} 
        />
      </div>
    </div>
  );
};

export default OpenPositions;
