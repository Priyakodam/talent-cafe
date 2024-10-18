import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpL1Candidates.css";

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [l1Candidates, setL1Candidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');

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
        const updatedL1Status = e.target.value;
    
        // Update candidate L1Status in the l1Candidates state
        const updatedCandidates = l1Candidates.map(c => 
            c.id === candidate.id ? { ...c, L1Status: updatedL1Status } : c
        );
        setL1Candidates(updatedCandidates);
    
        try {
            // Update the L1Status in Firestore for L1_Candidates
            const candidateRef = db.collection('L1_Candidates').doc(user.uid);
            await candidateRef.update({
                applicants: updatedCandidates,
            });
        } catch (error) {
            console.error('Error updating L1Status in L1_Candidates:', error);
        }
    
        // If "Shortlisted", add the candidate to L2_Candidates collection
        if (updatedL1Status === 'Shortlisted') {
            try {
                const L2CandidatesRef = db.collection('L2_Candidates').doc(user.uid);
                const L2CandidatesSnapshot = await L2CandidatesRef.get();
                let L2CandidatesData = [];
    
                if (L2CandidatesSnapshot.exists) {
                    const L2Data = L2CandidatesSnapshot.data();
                    if (Array.isArray(L2Data.L2_candidates)) {
                        L2CandidatesData = [...L2Data.L2_candidates];
                    }
                }
    
                // Add the new shortlisted candidate to the array with L1Status
                L2CandidatesData.push({
                    ...candidate,
                    L1Status: 'Shortlisted', // Add L1Status as Shortlisted
                    L2Status: 'Scheduled',    // Set L2Status to 'Scheduled'
                });
    
                // Update the L2_Candidates document
                await L2CandidatesRef.set({
                    L2_candidates: L2CandidatesData,
                });
    
            } catch (error) {
                console.error('Error adding candidate to L2:', error);
            }
        }
    };
    
    

    return (
        <div className='e-L1Candidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-L1Candidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>L1 Candidates</h2>
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
                                <th>L1Status</th>
                                <th>Action</th> {/* New Action Column */}
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
                                    {/* <td>{candidate.status}</td> */}
                                    <td>{candidate.L1Status}</td>
                                    <td>
                                        <select 
                                            value={candidate.L1Status} 
                                            onChange={(e) => handleStatusChange(e, candidate)}
                                            disabled={candidate.L1Status === 'Shortlisted'}
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
