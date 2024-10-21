import React, { useState, useEffect } from 'react';
import { db } from './../Firebase/FirebaseConfig'; // Import Firestore config
import "./EmpL2Candidates.css";

import AdminDashboard from '../Dashboard/Dashboard';


const OpenPositions = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [l2Candidates, setL2Candidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
 

    // Fetch L2 candidates from Firestore
    useEffect(() => {
        const fetchL2Candidates = async () => {
            try {
                const snapshot = await db.collection('L2_Candidates').get();
                let candidatesData = [];
  
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (Array.isArray(data.L2_candidates)) {
                        candidatesData = [...candidatesData, ...data.L2_candidates];
                    }
                });
  
                // Reverse the order so that the 0th index comes last
                candidatesData.reverse();
                setL2Candidates(candidatesData);
            } catch (error) {
                console.error("Error fetching candidates: ", error);
            }
        };

        fetchL2Candidates();
    }, []);

    // Fetch positions from Firestore
    const fetchPositions = async () => {
        try {
            const positionsSnapshot = await db.collection('position').get();
            const fetchedPositions = positionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPositions(fetchedPositions);
            const uniquePositionFrom = [...new Set(fetchedPositions.map(pos => pos.positionFrom))];
            setFilteredPositions(uniquePositionFrom);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const handlePositionFromChange = (event) => {
        const selected = event.target.value;
        setSelectedPositionFrom(selected);
    };

    const handleClearSelection = () => {
        setSelectedPositionFrom('');
        setSelectedPosition('');
    };

    const relevantPositions = positions.filter(position => position.positionFrom === selectedPositionFrom);

    const filteredApplicants = l2Candidates.filter(candidate =>
        (!selectedPositionFrom || candidate.company === selectedPositionFrom) && // Match company
        (!selectedPosition || candidate.positionInterested === selectedPosition) // Match position title
    );




    return (
        <div className='a-L2Candidates-container'>
            <AdminDashboard onToggleSidebar={setCollapsed} />
            <div className={`a-L2Candidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>L2 Candidates</h2>
                    <div className="header-actions">
                        {/* Position Dropdown */}
                        <select
                            value={selectedPositionFrom}
                            onChange={handlePositionFromChange}
                            className="position-dropdown"
                        >
                            <option value="" disabled>Select Company</option>
                            {filteredPositions.map((positionFrom, index) => (
                                <option key={index} value={positionFrom}>
                                    {positionFrom}
                                </option>
                            ))}
                        </select>

                        {/* Position Dropdown */}
                        <select
                            value={selectedPosition}
                            onChange={(e) => setSelectedPosition(e.target.value)}
                            className="position-dropdown"
                            disabled={!selectedPositionFrom} // Disable if no PositionFrom is selected
                        >
                            <option value="" disabled>Select Position</option>
                            {relevantPositions.map(position => (
                                <option key={position.id} value={position.positionTitle}>
                                    {position.positionTitle}
                                </option>
                            ))}
                        </select>

                        {selectedPositionFrom && (
                            <button
                                className="clear-selection-icon"
                                onClick={handleClearSelection}
                                style={{ cursor: 'pointer', color: 'red' }}
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                </div>
                
                <div className='table-responsive'>
                    <table className="styled-table">
                        <thead>
                            <tr>
                            <th>S No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Gender</th>
                                <th>Educational Qualification</th>
                                <th>Year of Passing</th>
                                <th>Years of Experience</th>
                                <th>Current/Last Company</th>
                                <th>Position Interested</th>
                                <th>Company</th>
                                <th>Designation</th>
                                <th>Skills</th>
                                <th>Resume</th>
                                <th>L2Status</th>
                              
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((candidate, index) => (
                                <tr key={candidate.id}>
                                    <td>{index + 1}</td>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.email}</td>
                                    <td>{candidate.mobile}</td>
                                    <td>{candidate.gender}</td>
                                    <td>{candidate.educationalQualification}</td>
                                    <td>{candidate.yearOfPassing}</td>
                                    <td>{candidate.yearsOfExperience}</td>
                                    <td>{candidate.currentCompany}</td>
                                    <td>{candidate.positionInterested}</td>
                                    <td>{candidate.company}</td>
                                    <td>{candidate.designation}</td>
                                    <td>{candidate.skills}</td>
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
                                    <td>{candidate.L2Status}</td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             
            </div>
        </div>
    );
};

export default OpenPositions;
