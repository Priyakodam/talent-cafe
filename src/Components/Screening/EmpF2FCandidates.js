import React, { useState, useEffect } from 'react';
import { db } from './../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpF2fCandidates.css";
import AdminDashboard from '../Dashboard/Dashboard';

const OpenPositions = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [f2FCandidates, setF2FCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
  

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
        fetchPositions();
    }, []);


    

    return (
        <div className='a-F2FCandidates-container'>
            <AdminDashboard onToggleSidebar={setCollapsed} />
            <div className={`a-F2FCandidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>F2F Candidates</h2>
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
                            {f2FCandidates.map(candidate => (
                                <tr key={candidate.id}>
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
