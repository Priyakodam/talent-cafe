import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpL1Candidates.css";

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [l1Candidates, setL1Candidates] = useState([]);

    useEffect(() => {
        const fetchL1Candidates = async () => {
            
            try {
                const snapshot = await db.collection('L1_Candidates').doc(user.uid).get();
                let candidatesData = [];
  
                if (snapshot.exists) {
                    const data = snapshot.data();
                    if (Array.isArray(data.applicants)) {
                        candidatesData = [...data.applicants];
                    }
                }
  
                // Reverse the order so that the 0th index comes last
                candidatesData.reverse();
  
                setL1Candidates(candidatesData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchL1Candidates();
    }, []);

    return (
        <div className='e-L1Candidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-L1Candidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <h3>L1 Candidates</h3>
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
                            </tr>
                        </thead>
                        <tbody>
                            {l1Candidates.map(candidate => (
                                <tr key={candidate.id}>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.email}</td>
                                    <td>{candidate.mobile}</td>
                                    <td className="one-line">{candidate.dateOfBirth}</td>
                                    <td>{candidate.gender}</td>
                                    <td>{candidate.educationalQualification}</td>
                                    <td>{candidate.yearOfPassing}</td>                                
                                    <td>{candidate.yearsOfExperience}</td>
                                    <td>{candidate.address}</td>
                                    <td>{candidate.city}</td>
                                    <td>{candidate.currentCompany}</td>
                                    <td>{candidate.positionInterested}</td>
                                    <td>{candidate.designation}</td>
                                    <td>{candidate.preferredArea}</td>  
                                    <td>{candidate.skills}</td>
                                    <td>{candidate.source}</td>                              
                                    <td> 
                                        <a 
                                            href={candidate.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="view-resume-link"
                                        >
                                            View
                                        </a>
                                    </td>
                                    <td>{candidate.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OpenPositions;
