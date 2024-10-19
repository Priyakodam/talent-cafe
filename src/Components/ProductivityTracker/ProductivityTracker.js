import React, { useState, useEffect } from "react";
import { db } from './../Firebase/FirebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductivityTracker.css'; // Custom CSS for the component
import Dashboard from "../Dashboard/Dashboard"; // Optional, remove if not needed

const ProductivityTracker = () => {
  const [productivityData, setProductivityData] = useState([]); // State to hold productivity data
  const [selectedDate, setSelectedDate] = useState(""); // State to hold the selected date
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data based on selected date

  // Helper function to get today's date in 'yyyy-mm-dd' format
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Set today's date as the default selected date
  useEffect(() => {
    const today = getTodayDate();
    setSelectedDate(today); // Set the default date to today
  }, []);

  // Fetch all productivity data
  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        const snapshot = await db.collection('productivity-tracker').get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProductivityData(data);
      } catch (error) {
        console.error('Error fetching productivity data:', error);
      }
    };

    fetchProductivityData();
  }, []);

  // Filter data when the selectedDate changes
  useEffect(() => {
    const filtered = productivityData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0]; // Convert entry date to 'yyyy-mm-dd'
      return entryDate === selectedDate;
    });

    setFilteredData(filtered);
  }, [selectedDate, productivityData]);

  // Function to format date in dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Handling null or undefined dates
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
  };

  return (
    <div className="productivity-tracker-container mt-5">
      <Dashboard /> {/* Optional Dashboard inclusion */}

      <div className="card shadow-lg productivity-tracker-card"> {/* Bootstrap Card */}
        <div className="card-header productivity-tracker-card-header d-flex justify-content-between align-items-center">
          <h3>Productivity Tracker</h3>
          <div className="d-flex align-items-center">
            <label htmlFor="date" className="mr-2 font-weight-bold">Date:</label>
            <input
              type="date"
              id="date"
              className="form-control productivity-tracker-date-input"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <button
              className="btn btn-primary ml-2"
              onClick={handleDateChange}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="card-body table-responsive productivity-tracker-card-body"> {/* Card body */}
          {filteredData.length > 0 ? (
            <table className="table table-bordered table-hover table-striped productivity-tracker-table"> {/* Adding table classes for styling */}
              <thead className="thead-dark productivity-tracker-thead"> {/* Bootstrap dark header */}
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
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => (
                  <tr key={entry.id} className="productivity-tracker-row">
                    <td>{index + 1}</td>
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.employeeName || 'N/A'}</td>
                    <td>{entry.company_name || 'N/A'}</td>
                    <td>{entry.position || 'N/A'}</td>
                    <td>{entry.profilesReceived || 0}</td>
                    <td>{entry.profilesReviewed || 0}</td>
                    <td>{entry.timeTaken || 'N/A'}</td>
                    <td>{entry.linkedin || 0}</td>
                    <td>{entry.timeTakenLinkedin || 'N/A'}</td>
                    <td>{entry.candidateInfoUploaded || 0}</td>
                    <td>{entry.timeTakenUpload || 'N/A'}</td>
                    <td>{entry.candidatesScreened || 0}</td>
                    <td>{entry.duration || 'N/A'}</td>
                    <td>{entry.candidatesSL || 0}</td>
                    <td>{entry.profilesSubmitted || 0}</td>
                    <td>{entry.candidatePipeline || 0}</td>
                    <td>{entry.shortlistedByClient || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No productivity data found for the selected date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductivityTracker;
