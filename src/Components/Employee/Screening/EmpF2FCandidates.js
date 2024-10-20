import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpF2fCandidates.css";

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [f2FCandidates, setF2FCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');

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


    
    

    return (
        <div className='e-F2FCandidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-F2FCandidates-content ${collapsed ? 'collapsed' : ''}`}>
                
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
                            {f2FCandidates.map((candidate, index) => (
                                <tr key={candidate.id}>
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
