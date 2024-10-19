import React, { useState, useEffect } from 'react';
import './EmployeeProductivityTracker.css'; // Ensure the correct path to the CSS file
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Import your Firebase Firestore config

const EmployeeProductivityTracker = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [companies, setCompanies] = useState([]); // State to hold all company names
  const [designations, setDesignations] = useState([]); // State to hold designations for selected company
  const [formData, setFormData] = useState({
    profilesReceived: '',
    profilesReviewed: '',
    timeTaken: '',
    linkedin: '',
    timeTakenLinkedin: '',
    candidateInfoUploaded: '',
    timeTakenUpload: '',
    candidatesScreened: '',
    duration: '',
    profilesShortlisted: '',
    candidatesSL: '',
    profilesSubmitted: '',
    candidatePipeline: '',
    shortlistedByClient: '',
    position: '', 
    task: '', 
    company_name: '', // Store selected company name
    date: new Date().toISOString().split('T')[0], // Initialize with current date
    employeeName: user ? user.name : '', // Employee name from Auth context
  });

  // Fetch all company names from Firestore
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const snapshot = await db.collection('clients').get(); // Fetch all documents from 'clients'
        const companyList = snapshot.docs.map(doc => doc.data().companyName); // Extract companyName from each document
        setCompanies(companyList); // Store company names in state
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch designations based on selected company
  useEffect(() => {
    if (formData.company_name) {
      const fetchDesignations = async () => {
        try {
          const snapshot = await db.collection('clients')
            .where('companyName', '==', formData.company_name)
            .get();

          if (!snapshot.empty) {
            const designationList = snapshot.docs.map(doc => doc.data().designation);
            setDesignations(designationList); // Store designations for the selected company
          }
        } catch (error) {
          console.error('Error fetching designation data:', error);
        }
      };

      fetchDesignations();
    } else {
      setDesignations([]); // Reset designations if no company is selected
    }
  }, [formData.company_name]);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add formData to Firestore under the new collection 'productivity-tracker'
      await db.collection('productivity-tracker').add({
        ...formData,
        timestamp: new Date(), // Store the current timestamp for tracking
      });

      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Failed to submit data. Please try again.');
    }

    // Reset form data after submission
    setFormData({
      profilesReceived: '',
      profilesReviewed: '',
      timeTaken: '',
      linkedin: '',
      timeTakenLinkedin: '',
      candidateInfoUploaded: '',
      timeTakenUpload: '',
      candidatesScreened: '',
      duration: '',
      profilesShortlisted: '',
      candidatesSL: '',
      profilesSubmitted: '',
      candidatePipeline: '',
      shortlistedByClient: '',
      position: '',
      task: '',
      company_name: '',
      date: new Date().toISOString().split('T')[0], // Reset to current date
      employeeName: user ? user.name : '', // Reset employee name from context
    });
  };

  return (
    <div className="employee-productivity-container">
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className="employee-productivity-card">
        <div className="employee-productivity-card-header text-center">
          <h3>Employee Productivity Tracker</h3>
        </div>
        <div className="employee-productivity-card-body">
          <form onSubmit={handleSubmit} className="employee-productivity-form">
            {/* Date field */}
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="input-width"
                value={formData.date}
                readOnly
              />
            </div>

            <div className="form-row">
              {/* Employee Name from Auth Context */}
              <div className="form-group">
                <label htmlFor="name" className="font-weight-bold">Employee Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.employeeName}
                  readOnly
                />
              </div>

              {/* Company Name from Firestore */}
              <div className="form-group">
                <label htmlFor="company_name" className="font-weight-bold">Company</label>
                <select
                  className="form-control"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                >
                  <option value="">Select a Company</option>
                  {companies.map((company, index) => (
                    <option key={index} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Position (Dynamically populated based on selected company) */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position" className="font-weight-bold">Position</label>
                <select
                  className="form-control"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                >
                  <option value="">Select a Position</option>
                  {designations.map((designation, index) => (
                    <option key={index} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task */}
              <div className="form-group">
                <label htmlFor="task" className="font-weight-bold">Task</label>
                <select className="form-control" id="task" name="task" onChange={handleChange}>
                  <option value="">Select a Task</option>
                  <option value="Profiles Reviewed">Profiles Reviewed</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Uploaded on ATS">Uploaded on ATS</option>
                  <option value="Candidates Screened">Candidates Screened</option>
                </select>
              </div>
            </div>

            {/* Profiles Received and Reviewed */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profilesReceived">Profiles received</label>
                <input
                  type="text"
                  className="form-control"
                  id="profilesReceived"
                  name="profilesReceived"
                  value={formData.profilesReceived}
                  onChange={handleChange}
                  placeholder="No. of Profiles received"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profilesReviewed">Profiles reviewed</label>
                <input
                  type="text"
                  className="form-control"
                  id="profilesReviewed"
                  name="profilesReviewed"
                  value={formData.profilesReviewed}
                  onChange={handleChange}
                  placeholder="No. of Profiles reviewed"
                />
              </div>
            </div>

            {/* Time Taken for Profiles Reviewed */}
            <div className="form-group">
              <label htmlFor="timeTaken">Time Taken</label>
              <input
                type="text"
                className="form-control input-width"
                id="timeTaken"
                name="timeTaken"
                value={formData.timeTaken}
                readOnly
              />
            </div>

            {/* LinkedIn & Time Taken */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="text"
                  className="form-control"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn (Headhunt)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="timeTakenLinkedin">Time Taken (LinkedIn)</label>
                <input
                  type="text"
                  className="form-control"
                  id="timeTakenLinkedin"
                  name="timeTakenLinkedin"
                  value={formData.timeTakenLinkedin}
                  readOnly
                />
              </div>
            </div>

            {/* Candidate Info Uploaded & Time Taken */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="candidateInfoUploaded">Candidate info uploaded on ATS</label>
                <input
                  type="text"
                  className="form-control"
                  id="candidateInfoUploaded"
                  name="candidateInfoUploaded"
                  value={formData.candidateInfoUploaded}
                  onChange={handleChange}
                  placeholder="No. of Candidate info uploaded"
                />
              </div>
              <div className="form-group">
                <label htmlFor="timeTakenUpload">Time Taken (Upload)</label>
                <input
                  type="text"
                  className="form-control"
                  id="timeTakenUpload"
                  name="timeTakenUpload"
                  value={formData.timeTakenUpload}
                  readOnly
                />
              </div>
            </div>

            {/* Candidates Screened & Duration */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="candidatesScreened">Candidates Screened/Interviewed</label>
                <input
                  type="text"
                  className="form-control"
                  id="candidatesScreened"
                  name="candidatesScreened"
                  value={formData.candidatesScreened}
                  onChange={handleChange}
                  placeholder="No. of Candidates Screened/Interviewed"
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  readOnly
                />
              </div>
            </div>

            {/* Candidates Selected and Pipeline */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="candidatesSL">Candidates Selected</label>
                <input
                  type="text"
                  className="form-control"
                  id="candidatesSL"
                  name="candidatesSL"
                  value={formData.candidatesSL}
                  onChange={handleChange}
                  placeholder="No. of Candidates Selected"
                />
              </div>

              <div className="form-group">
                <label htmlFor="candidatePipeline">Candidate Pipeline</label>
                <input
                  type="text"
                  className="form-control"
                  id="candidatePipeline"
                  name="candidatePipeline"
                  value={formData.candidatePipeline}
                  onChange={handleChange}
                  placeholder="No. of Candidate Pipeline"
                />
              </div>
            </div>

            {/* Shortlisted by Client */}
            <div className="form-group">
              <label htmlFor="shortlistedByClient">Shortlisted by Client</label>
              <input
                type="text"
                className="form-control input-width"
                id="shortlistedByClient"
                name="shortlistedByClient"
                value={formData.shortlistedByClient}
                onChange={handleChange}
                placeholder="No. of Shortlisted by Client"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="employee-productivity-submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProductivityTracker;
