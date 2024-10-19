import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from './../../Firebase/FirebaseConfig';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import './EditProductivityTracker.css'; // Import the custom CSS file for styles

const EditProductivityTracker = () => {
  const location = useLocation(); // Get the passed state (data)
  const navigate = useNavigate();
  const entry = location.state?.entry || {}; // Fallback to empty object

  // Correctly setting the date format for the input field (dd-mm-yyyy)
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = formattedDate.getFullYear();
    return `${year}-${month}-${day}`; // For input type="date" format
  };

  const [formData, setFormData] = useState({
    date: formatDate(entry.date),
    profilesReceived: entry.profilesReceived || "",
    profilesReviewed: entry.profilesReviewed || "",
    timeTaken: entry.timeTaken || "",
    linkedin: entry.linkedin || "",
    timeTakenLinkedin: entry.timeTakenLinkedin || "",
    candidateInfoUploaded: entry.candidateInfoUploaded || "",
    timeTakenUpload: entry.timeTakenUpload || "",
    candidatesScreened: entry.candidatesScreened || "",
    duration: entry.duration || "",
    candidatesSL: entry.candidatesSL || "",
    profilesSubmitted: entry.profilesSubmitted || "",
    candidatePipeline: entry.candidatePipeline || "",
    shortlistedByClient: entry.shortlistedByClient || "",
    company_name: entry.company_name || "",
    position: entry.position || "",
    task: entry.task || "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Call calculation functions based on the field being changed
    if (name === "profilesReviewed") {
      calculateTimeTaken(value);
    } else if (name === "linkedin") {
      calculateTimeTakenLinkedin(value);
    } else if (name === "candidateInfoUploaded") {
      calculateTimeTakenUpload(value);
    } else if (name === "candidatesScreened") {
      calculateDuration(value);
    }
  };

  // Function to calculate time taken for profiles reviewed
  const calculateTimeTaken = (profilesReviewed) => {
    const timeTakenInHours = ((profilesReviewed * 40) / 60) / 60;
    const hours = Math.floor(timeTakenInHours);
    const minutes = Math.round((timeTakenInHours - hours) * 60);
    const timeTakenFormatted = `${hours} hr ${minutes} min`;
    setFormData((prevData) => ({ ...prevData, timeTaken: timeTakenFormatted }));
  };

  // Function to calculate time taken for LinkedIn
  const calculateTimeTakenLinkedin = (linkedin) => {
    const timeTakenLinkedinInMinutes = linkedin * 2;
    const hours = Math.floor(timeTakenLinkedinInMinutes / 60);
    const minutes = timeTakenLinkedinInMinutes % 60;
    const timeTakenLinkedinFormatted = `${hours} hr ${minutes} min`;
    setFormData((prevData) => ({ ...prevData, timeTakenLinkedin: timeTakenLinkedinFormatted }));
  };

  // Function to calculate time taken for uploading candidate info
  const calculateTimeTakenUpload = (candidateInfoUploaded) => {
    const timeTakenUploadInMinutes = candidateInfoUploaded * 2;
    const hours = Math.floor(timeTakenUploadInMinutes / 60);
    const minutes = timeTakenUploadInMinutes % 60;
    const timeTakenUploadFormatted = `${hours} hr ${minutes} min`;
    setFormData((prevData) => ({ ...prevData, timeTakenUpload: timeTakenUploadFormatted }));
  };

  // Function to calculate duration for candidates screened
  const calculateDuration = (candidatesScreened) => {
    const durationInMinutes = candidatesScreened * 10;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const durationFormatted = `${hours} hr ${minutes} min`;
    setFormData((prevData) => ({ ...prevData, duration: durationFormatted }));
  };

  // Submit the updated form data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection("productivity-tracker").doc(entry.id).update({
        ...formData,
      });

      alert("Productivity tracker updated successfully!");
      navigate("/manage-productivity-tracker"); // Navigate back after successful update
    } catch (error) {
      console.error("Error updating productivity tracker:", error);
    }
  };

  return (
    <div>
      <EmployeeDashboard /> {/* Add the Employee Dashboard */}
      <div className="edit-productivity-tracker-container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
        <div className="card shadow-lg p-4 edit-productivity-tracker-card"> {/* Custom class for styling */}
          <h3 className="edit-productivity-tracker-title text-center">Edit Productivity Tracker</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="input-width form-control"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Task</label>
                <input
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Profiles Received</label>
                <input
                  type="text"
                  name="profilesReceived"
                  value={formData.profilesReceived}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Profiles Reviewed</label>
                <input
                  type="text"
                  name="profilesReviewed"
                  value={formData.profilesReviewed}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Time Taken</label>
                <input
                  type="text"
                  name="timeTaken"
                  value={formData.timeTaken}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Time Taken (LinkedIn)</label>
                <input
                  type="text"
                  name="timeTakenLinkedin"
                  value={formData.timeTakenLinkedin}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Candidate Info Uploaded</label>
                <input
                  type="text"
                  name="candidateInfoUploaded"
                  value={formData.candidateInfoUploaded}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Time Taken (Upload)</label>
                <input
                  type="text"
                  name="timeTakenUpload"
                  value={formData.timeTakenUpload}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Candidates Screened</label>
                <input
                  type="text"
                  name="candidatesScreened"
                  value={formData.candidatesScreened}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Candidates Selected</label>
                <input
                  type="text"
                  name="candidatesSL"
                  value={formData.candidatesSL}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Profiles Submitted</label>
                <input
                  type="text"
                  name="profilesSubmitted"
                  value={formData.profilesSubmitted}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Candidate Pipeline</label>
                <input
                  type="text"
                  name="candidatePipeline"
                  value={formData.candidatePipeline}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 edit-productivity-tracker-group">
                <label>Shortlisted by Client</label>
                <input
                  type="text"
                  name="shortlistedByClient"
                  value={formData.shortlistedByClient}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" className="btn edit-productivity-tracker-btn w-100 mt-3">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductivityTracker;

