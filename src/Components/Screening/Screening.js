import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Screening.css";
import Dashboard from "../Dashboard/Dashboard";
import { db } from './../Firebase/FirebaseConfig';
import { FaTimes } from 'react-icons/fa';


const Screening = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);

    const navigate = useNavigate();

    // Fetch all applicants without filtering by user.uid
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const snapshot = await db.collection('applicants').get();
                let applicantsData = [];

                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (Array.isArray(data.applicants)) {
                        applicantsData = [...applicantsData, ...data.applicants];
                    }
                });

                applicantsData.reverse(); // Reverse the order so the latest comes first
                setApplicants(applicantsData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchApplicants();
    }, []);

  

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

    const filteredApplicants = applicants.filter(applicant =>
        (!selectedPositionFrom || applicant.company === selectedPositionFrom) && // Match company
        (!selectedPosition || applicant.positionInterested === selectedPosition) // Match position title
    );

 


    return (
        <div className='screening-container'>
            <Dashboard onToggleSidebar={setCollapsed} />
            <div className={`screening-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="header-container">
                    <h2>Applicants Details</h2>
                    <div className="header-actions">
                        {/* Position From Dropdown */}
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
                            <FaTimes
                                className="clear-selection-icon"
                                onClick={handleClearSelection}
                                style={{ cursor: 'pointer',  color:'red' }}
                            />
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
                                <th>Recruiter Name</th>
                                <th>Resume</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((applicant, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.mobile}</td>
                                    <td>{applicant.gender}</td>
                                    <td>{applicant.educationalQualification}</td>
                                    <td>{applicant.yearOfPassing}</td>
                                    <td>{applicant.yearsOfExperience}</td>
                                    <td>{applicant.currentCompany}</td>
                                    <td>{applicant.positionInterested}</td>
                                    <td>{applicant.company}</td>
                                    <td>{applicant.designation}</td>
                                    <td>{applicant.skills}</td>
                                    <td>{applicant.userName}</td>
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
                                    <td>
                                    <td>{applicant.status}</td>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

              
            </div>
        </div>
    );
};

export default Screening;
