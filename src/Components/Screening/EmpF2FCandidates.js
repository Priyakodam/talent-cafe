import React, { useState, useEffect } from 'react';
import { db } from './../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpF2fCandidates.css";
import AdminDashboard from '../Dashboard/Dashboard';

const OpenPositions = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [f2FCandidates, setF2FCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
  

    // Fetch F2F candidates from Firestore
    useEffect(() => {
        const fetchF2FCandidates = async () => {
            try {
                const snapshot = await db.collection('F2F_Candidates').get();
                let candidatesData = [];

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (Array.isArray(data.F2F_Candidates)) {
                        candidatesData = [...candidatesData, ...data.F2F_Candidates];
                    }
                });

                candidatesData.reverse(); // Reverse the order so that the 0th index comes last
                setF2FCandidates(candidatesData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchF2FCandidates();
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

    const filteredApplicants = f2FCandidates.filter(candidate =>
        (!selectedPositionFrom || candidate.company === selectedPositionFrom) && // Match company
        (!selectedPosition || candidate.positionInterested === selectedPosition) // Match position title
    );


    

    return (
        <div className='a-F2FCandidates-container'>
            <AdminDashboard onToggleSidebar={setCollapsed} />
            <div className={`a-F2FCandidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>F2F Candidates</h2>
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
                                <th>F2FStatus</th>
                              
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
                                    <td>{candidate.F2FStatus}</td>
                                   
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
