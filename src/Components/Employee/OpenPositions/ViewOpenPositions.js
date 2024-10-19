import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './../../Firebase/FirebaseConfig';
import { useAuth } from "../../Context/AuthContext";
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ViewOpenPositions.css';

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const snapshot = await db.collection('position')
         
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
    navigate('/e-openpositions');
  };

  // Handle deleting a position with confirmation
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this position?");
    if (confirmed) {
      try {
        await db.collection('position').doc(id).delete();
        setPositions(positions.filter(position => position.id !== id));
        console.log("Position deleted successfully");
      } catch (error) {
        console.error("Error deleting position:", error);
      }
    }
  };

  // Handle editing a position
  const handleEdit = (position) => {
    navigate(`/e-openpositions?edit=true&id=${position.id}`, { state: position });
  };

  return (
    <div className='e-viewopenpositions-container'>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`e-viewopenpositions-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="table-title">Open Positions</h3>
            <button className="btn btn-primary add-client-btn" onClick={handleAddPosition}>
              + Add Position
            </button>
          </div>
          <div className="card-body">
            <table className="table table-striped table-bordered custom-table">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Position Title</th>
                  <th>Position From</th>
                  <th>Budget</th>
                  <th>Number Of Positions</th>
                  <th>Experience (years)</th>
                  <th>Priority</th>
                  <th>Priority Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
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
                      <td>{position.numOfOpenPositions}</td>
                      <td>{position.experience}</td>
                      <td>{position.priority}</td>
                      <td>{position.priorityDescription}</td>
                      <td>{position.status}</td>
                      <td>{new Date(position.createdAt.seconds * 1000).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => handleEdit(position)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> {/* Edit icon */}
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(position.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} /> {/* Delete icon */}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">No open positions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionList;
