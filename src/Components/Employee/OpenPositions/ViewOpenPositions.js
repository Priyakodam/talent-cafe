import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { db } from './../../Firebase/FirebaseConfig';
import { useAuth } from "../../Context/AuthContext";
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ViewOpenPositions.css'

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);  
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch data from Firestore when component mounts
    const fetchPositions = async () => {
      try {
        const snapshot = await db.collection('position')
          .where('createdBy', '==', user.uid) // Fetch positions added by the current user
          .orderBy('createdAt', 'desc')
          .get();
          
        const fetchedPositions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPositions(fetchedPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [user.uid]);

  const handleAddPosition = () => {
    navigate('/e-openpositions'); // Navigate to the 'e-openpositions' form page
  };

  return (
    <div className='e-viewopenpositions-container'>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`e-viewopenpositions-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Open Positions</h3>
          <button className="btn btn-primary" onClick={handleAddPosition}>
            Add Position
          </button>
        </div>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Position Title</th>
              <th>Position From</th>
              <th>Budget</th>
              <th>Experience (years)</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {positions.length > 0 ? (
              positions.map((position, index) => (
                <tr key={position.id}>
                  <td>{index + 1}</td>
                  <td>{position.positionTitle}</td>
                  <td>{position.positionFrom}</td>
                  <td>{position.budget}</td>
                  <td>{position.experience}</td>
                  <td>{position.status}</td>
                  <td>{new Date(position.createdAt.seconds * 1000).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No open positions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionList;
