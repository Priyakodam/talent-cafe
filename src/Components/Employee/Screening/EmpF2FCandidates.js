import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpF2fCandidates.css";
import { FaTimes } from 'react-icons/fa';

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [f2FCandidates, setF2FCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchF2FCandidates = async () => {
            try {
                const snapshot = await db.collection('F2F_Candidates').doc(user.uid).get();
                let candidatesData = [];
        
                if (snapshot.exists) {
                    const data = snapshot.data();
                    // Check if the expected field exists and is an array
                    if (Array.isArray(data.F2F_Candidates)) {
                        candidatesData = [...data.F2F_Candidates];
                    } else {
                        console.error("F2F_Candidates is not an array or doesn't exist");
                    }
                } else {
                    console.error("No document found for the user.");
                }
        
                // Reverse the order so that the 0th index comes last
                candidatesData.reverse();
                setF2FCandidates(candidatesData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };
        

        fetchF2FCandidates();
    }, [user.uid]);

    // Fetch positions from Firestore
    const fetchPositions = async () => {
        try {
            const positionsSnapshot = await db.collection('position')
                // .where('employeeUid', '==', user.uid) 
                .get();

            const fetchedPositions = positionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPositions(fetchedPositions);
            console.log("Positions=",fetchedPositions)
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
        setSearchTerm('');
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const relevantPositions = positions.filter(position => position.positionFrom === selectedPositionFrom);

    // const filteredApplicants = l2Candidates.filter(candidate =>
    //     (!selectedPositionFrom || candidate.company === selectedPositionFrom) && // Match company
    //     (!selectedPosition || candidate.positionInterested === selectedPosition) // Match position title
    // );

    const filteredApplicants = f2FCandidates.filter(candidate => {
        const matchesPositionFrom = !selectedPositionFrom || candidate.company === selectedPositionFrom;
        const matchesPosition = !selectedPosition || candidate.positionInterested === selectedPosition;
        const matchesSearchTerm = !searchTerm || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesPositionFrom && matchesPosition && matchesSearchTerm;
    });


    
    

    return (
        <div className='e-F2FCandidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-F2FCandidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="header-container">
                    <h2>F2F Candidates</h2>
                    <div className="header-actions">
                        {/* Position Dropdown */}
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
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
                    <table className="table table-striped table-bordered custom-table">
                        <thead>
                            <tr>
                            <th>S No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                {/* <th>DOB</th> */}
                                <th>Gender</th>
                                <th>Educational Qualification</th>
                                <th>Year of Passing</th>
                                <th>Years of Experience</th>
                                {/* <th>Address</th>
                                <th>City</th> */}
                                <th>Current/Last Company</th>
                                <th>Position Interested</th>
                                <th>Company</th>
                                <th>Designation</th>
                                {/* <th>Preferred Area</th> */}
                                <th>Skills</th>
                                {/* <th>Source</th> */}
                                <th>Resume</th>
                                {/* <th>Status</th> */}
                                <th>F2FStatus</th>
                                {/* <th>Action</th>  */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((candidate, index) => (
                                <tr key={candidate.id}>
                                     <td>{index + 1}</td>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.email}</td>
                                    <td>{candidate.mobile}</td>
                                    {/* <td className="one-line">{candidate.dateOfBirth}</td> */}
                                    <td>{candidate.gender}</td>
                                    <td>{candidate.educationalQualification}</td>
                                    <td>{candidate.yearOfPassing}</td>
                                    <td>{candidate.yearsOfExperience}</td>
                                    {/* <td>{candidate.address}</td>
                                    <td>{candidate.city}</td> */}
                                    <td>{candidate.currentCompany}</td>
                                    <td>{candidate.positionInterested}</td>
                                    <td>{candidate.company}</td>
                                    <td>{candidate.designation}</td>
                                    {/* <td>{candidate.preferredArea}</td>   */}
                                    <td>{candidate.skills}</td>
                                    {/* <td>{candidate.source}</td>                               */}
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
                                    <td>{candidate.F2FStatus}</td>
                                    
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
