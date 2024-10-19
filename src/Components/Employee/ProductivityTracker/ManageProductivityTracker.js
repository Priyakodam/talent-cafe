import React, { useState, useEffect } from "react";
import { db } from './../../Firebase/FirebaseConfig';
import { useAuth } from "../../Context/AuthContext";
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useNavigate } from "react-router-dom"; // For navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for icons
import './ManageProductivityTracker.css'; // Custom CSS

const ManageProductivityTracker = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [productivityData, setProductivityData] = useState([]); // State to hold productivity data
  const [collapsed, setCollapsed] = useState(false); // For the sidebar toggle
  const navigate = useNavigate(); // To navigate to the edit page

  // Fetch productivity data based on logged-in user
  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        if (user) {
          const snapshot = await db.collection('productivity-tracker')
            .where('employeeName', '==', user.name)
            .get();

          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setProductivityData(data);
        }
      } catch (error) {
        console.error('Error fetching productivity data:', error);
      }
    };

    fetchProductivityData();
  }, [user]);

  // Function to format date in dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Navigate to Edit Page
  const handleEdit = (entry) => {
    navigate("/edit-productivity-tracker", { state: { entry } });
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
      try {
        // Remove the document from Firestore
        await db.collection('productivity-tracker').doc(id).delete();

        // Remove the deleted entry from the local state
        setProductivityData((prevData) => prevData.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error('Error deleting productivity data:', error);
      }
    }
  };

  return (
    <div>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`manage-productivity-tracker-content d-flex justify-content-center align-items-center ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '90vh' }}>
        <div className="card shadow-sm col-md-8 col-lg-9 manage-productivity-tracker-card">
          <div className="card-header">
            <h3 className="text-center">Manage Productivity Tracker</h3>
          </div>
          <div className="card-body table-responsive">
            {productivityData.length > 0 ? (
              <table className="table table-bordered manage-productivity-tracker-table">
                <thead>
                  <tr>
                    <th>SL No</th>
                    <th>Date</th>
                    <th>Emp Name</th>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Profiles Received</th>
                    <th>Profiles Reviewed</th>
                    <th>Time Taken</th>
                    <th>LinkedIn</th>
                    <th>Time Taken (LinkedIn)</th>
                    <th>Uploaded on ATS</th>
                    <th>Time Taken (Upload)</th>
                    <th>Candidates Screened</th>
                    <th>Duration</th>
                    <th>Candidates Selected</th>
                    <th>Profiles Submitted</th>
                    <th>Candidate Pipeline</th>
                    <th>Shortlisted by Client</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productivityData.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.employeeName || 0}</td>
                      <td>{entry.company_name || 0}</td>
                      <td>{entry.position || 0}</td>
                      <td>{entry.profilesReceived || 0}</td>
                      <td>{entry.profilesReviewed || 0}</td>
                      <td>{entry.timeTaken || 0}</td>
                      <td>{entry.linkedin || 0}</td>
                      <td>{entry.timeTakenLinkedin || 0}</td>
                      <td>{entry.candidateInfoUploaded || 0}</td>
                      <td>{entry.timeTakenUpload || 0}</td>
                      <td>{entry.candidatesScreened || 0}</td>
                      <td>{entry.duration || 0}</td>
                      <td>{entry.candidatesSL || 0}</td>
                      <td>{entry.profilesSubmitted || 0}</td>
                      <td>{entry.candidatePipeline || 0}</td>
                      <td>{entry.shortlistedByClient || 0}</td>
                      <td>
                        <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(entry)}>
                          <i className="fas fa-edit"></i> {/* Edit Icon */}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>
                          <i className="fas fa-trash-alt"></i> {/* Delete Icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No productivity data found for this user.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProductivityTracker;
