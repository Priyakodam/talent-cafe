import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Import the Firestore database
import "./EmployeeScreening.css";

const EmployeeScreening = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const snapshot = await db.collection('applicants').get();
                const applicantsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplicants(applicantsData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchApplicants();
    }, []);

    const handleActionChange = async (applicantId, newStatus) => {
      const applicant = applicants.find(app => app.id === applicantId);
      
      // Check for invalid status change
      if ((applicant.status === "Shortlisted" && newStatus === "Rejected") || 
          (applicant.status === "Rejected" && newStatus === "Shortlisted")) {
          alert(`Applicant ID ${applicantId} cannot be changed from ${applicant.status} to ${newStatus}.`);
          return;
      }
  
      // Update the applicant's status in Firestore
      try {
          await db.collection('applicants').doc(applicantId).update({
              status: newStatus
          });
  
          // Update local state with the new status
          setApplicants(prevApplicants => 
              prevApplicants.map(app => 
                  app.id === applicantId ? { ...app, status: newStatus } : app
              )
          );
  
          // If the new status is "Shortlisted," add to L1_Candidates collection
          if (newStatus === "Shortlisted") {
              // Set the status explicitly to "Shortlisted" in L1_Candidates
              await db.collection('L1_Candidates').doc(applicantId).set({
                  ...applicant,  // Preserve existing applicant data
                  status: "Shortlisted"  // Add status as "Shortlisted"
              });
              console.log(`Applicant ID ${applicantId} added to L1_Candidates with status "Shortlisted"`);
          }
  
          console.log(`Applicant ID ${applicantId} status updated to ${newStatus}`);
      } catch (error) {
          console.error("Error updating status: ", error);
      }
  };
  

    return (
        <div className='e-screening-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-screening-content ${collapsed ? 'collapsed' : ''}`}>
                <h2>Applicants Details</h2>
                <div className='table-responsive'>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>DOB</th>
                                <th>Gender</th>
                                <th>Educational Qualification</th>
                                <th>Year of Passing</th>
                                <th>Years of Experience</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Current/Last Company</th>                            
                                <th>Position Interested</th>
                                <th>Designation</th>
                                <th>Preferred Area</th>
                                <th>Skills</th>
                                <th>Source</th>
                                <th>Resume</th>
                                <th>Status</th>
                                <th>Action</th> {/* New Action Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant) => (
                                <tr key={applicant.id}>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.mobile}</td>
                                    <td className="one-line">{applicant.dateOfBirth}</td>
                                    <td>{applicant.gender}</td>
                                    <td>{applicant.educationalQualification}</td>
                                    <td>{applicant.yearOfPassing}</td>                                
                                    <td>{applicant.yearsOfExperience}</td>
                                    <td>{applicant.address}</td>
                                    <td>{applicant.city}</td>
                                    <td>{applicant.currentCompany}</td>
                                    <td>{applicant.positionInterested}</td>
                                    <td>{applicant.designation}</td>
                                    <td>{applicant.preferredArea}</td>  
                                    <td>{applicant.skills}</td>
                                    <td>{applicant.source}</td>                              
                                    <td> 
                                        <a 
                                            href={applicant.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="view-resume-link"
                                        >
                                            View
                                        </a>
                                    </td>
                                    <td>{applicant.status}</td>
                                    <td> {/* Action Dropdown */}
                                        <select 
                                            onChange={(e) => handleActionChange(applicant.id, e.target.value)} 
                                            disabled={applicant.status === "Shortlisted" || applicant.status === "Rejected"}
                                        >
                                            <option value="">Select</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EmployeeScreening;
