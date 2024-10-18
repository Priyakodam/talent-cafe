import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import "./EmployeeScreening.css";

const EmployeeScreening = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const snapshot = await db.collection('applicants').doc(user.uid).get();
                let applicantsData = [];

                if (snapshot.exists) {
                    const data = snapshot.data();
                    if (Array.isArray(data.applicants)) {
                        applicantsData = [...data.applicants];
                    }
                }

                // Reverse the order so that the 0th index comes last
                applicantsData.reverse();

                setApplicants(applicantsData);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchApplicants();
    }, [user.uid]);

    const handleActionChange = async (index, newStatus) => {
        const applicant = applicants[index];

        if ((applicant.status === "Shortlisted" && newStatus === "Rejected") ||
            (applicant.status === "Rejected" && newStatus === "Shortlisted")) {
            alert(`Applicant at index ${index} cannot be changed from ${applicant.status} to ${newStatus}.`);
            return;
        }

        try {
            // Remove the original applicant data from Firestore
            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayRemove(applicant)
            });

            // Update the status of the applicant locally
            const updatedApplicant = { ...applicant, status: newStatus };

            // Update Firestore by adding the updated applicant data
            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayUnion(updatedApplicant)
            });

            // Update the local state
            setApplicants(prevApplicants => {
                const newApplicants = [...prevApplicants];
                newApplicants[index] = updatedApplicant;
                return newApplicants;
            });

            // If the new status is "Shortlisted," add to L1_Candidates collection
            if (newStatus === "Shortlisted") {
                await db.collection('L1_Candidates').doc(user.uid).set({
                    applicants: arrayUnion({
                        ...updatedApplicant,
                        L1Status: 'L1 Interview Scheduled',
                        createdAt: new Date(),
                    })
                }, { merge: true });
                console.log(`Applicant at index ${index} added to L1_Candidates with status "Shortlisted"`);
            }

            console.log(`Applicant at index ${index} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const handleAddProfileClick = () => {
        navigate('/e-applicant');
    };

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
        <div className='e-screening-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-screening-content ${collapsed ? 'collapsed' : ''}`}>
                <div className="header-container">
                    <h2>Applicants Details</h2>
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
                        <button className="add-profile-button" onClick={handleAddProfileClick}>
                            + Add Profile
                        </button>
                       
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
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant, index) => (
                                <tr key={index}>
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
                                    <td>
                                        <select
                                            onChange={(e) => handleActionChange(index, e.target.value)}
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
