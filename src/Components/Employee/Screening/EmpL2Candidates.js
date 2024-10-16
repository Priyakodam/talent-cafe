import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpL2Candidates.css";

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [l2Candidates, setL2Candidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');

    useEffect(() => {
        const fetchL2Candidates = async () => {
            
            try {
                const snapshot = await db.collection('L2_Candidates').doc(user.uid).get();
                let candidatesData = [];
  
                if (snapshot.exists) {
                    const data = snapshot.data();
                    if (Array.isArray(data.L2_candidates)) {
                        candidatesData = [...data.L2_candidates];
                    }
                }
  
                // Reverse the order so that the 0th index comes last
                candidatesData.reverse();
  
                setL2Candidates(candidatesData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchL2Candidates();
    }, [user.uid]);

    // Fetch positions from Firestore
    const fetchPositions = async () => {
        try {
            const positionsSnapshot = await db.collection('positionsrequired').get();
            const fetchedPositions = positionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPositions(fetchedPositions);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    useEffect(() => {
        fetchPositions(); // Fetch positions when the component mounts
    }, []);

    const handleStatusChange = async (e, candidate) => {
        const updatedL2Status = e.target.value;
    
        // Update candidate L2Status in the l2Candidates state
        const updatedCandidates = l2Candidates.map(c => 
            c.id === candidate.id ? { ...c, L2Status: updatedL2Status } : c
        );
        setL2Candidates(updatedCandidates);
    
        try {
            // Update the L2Status in Firestore for L2_Candidates
            const candidateRef = db.collection('L2_Candidates').doc(user.uid);
            await candidateRef.update({
              L2_candidates: updatedCandidates,
            });
        } catch (error) {
            console.error('Error updating L2Status in L2_Candidates:', error);
        }
    
        // If "Shortlisted", add the candidate to L2_Candidates collection
        if (updatedL2Status === 'Shortlisted') {
            try {
                const L2CandidatesRef = db.collection('F2F_Candidates').doc(user.uid);
                const L2CandidatesSnapshot = await L2CandidatesRef.get();
                let L2CandidatesData = [];
    
                if (L2CandidatesSnapshot.exists) {
                    const L2Data = L2CandidatesSnapshot.data();
                    if (Array.isArray(L2Data.F2F_Candidates)) {
                        L2CandidatesData = [...L2Data.F2F_Candidates];
                    }
                }
    
                // Add the new shortlisted candidate to the array with L2Status
                L2CandidatesData.push({
                    ...candidate,
                    L2Status: 'Shortlisted', // Add L2Status as Shortlisted
                    F2FStatus: 'Scheduled',    // Set L2Status to 'Scheduled'
                });
    
                // Update the L2_Candidates document
                await L2CandidatesRef.set({
                  F2F_Candidates: L2CandidatesData,
                });
    
            } catch (error) {
                console.error('Error adding candidate to L2:', error);
            }
        }
    };
    
    

    return (
        <div className='e-L2Candidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-L2Candidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>L2 Candidates</h2>
                    <div className="header-actions">
                        {/* Position Dropdown */}
                        <select
                            value={selectedPosition}
                            onChange={(e) => setSelectedPosition(e.target.value)}
                            className="position-dropdown"
                        >
                            <option value="">Select Position</option>
                            {positions.map(position => (
                                <option key={position.id} value={position.positionName}>
                                    {position.positionName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
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
                                {/* <th>Status</th> */}
                                <th>L2Status</th>
                                <th>Action</th> {/* New Action Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {l2Candidates.map(candidate => (
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
                                    {/* <td>{candidate.status}</td> */}
                                    <td>{candidate.L2Status}</td>
                                    <td>
                                        <select 
                                            value={candidate.L2Status} 
                                            onChange={(e) => handleStatusChange(e, candidate)}
                                            disabled={candidate.L2Status === 'Shortlisted'}
                                        >
                                            <option value="">Select Action</option>
                                            <option value="Shortlisted">Shortlist</option>
                                            <option value="Rejected">Reject</option>
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

export default OpenPositions;
