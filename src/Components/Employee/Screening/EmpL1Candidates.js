import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig'; // Make sure to import your Firestore config
import "./EmpL1Candidates.css";
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const OpenPositions = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [l1Candidates, setL1Candidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [interviewDetails, setInterviewDetails] = useState({
        date: '',
        time: '',
        interviewLink: '',
        clientFeedback: ''
    });

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

    // const filteredApplicants = l1Candidates.filter(candidate =>
    //     (!selectedPositionFrom || candidate.company === selectedPositionFrom) && // Match company
    //     (!selectedPosition || candidate.positionInterested === selectedPosition) // Match position title
    // );

    const filteredApplicants = l1Candidates.filter(candidate => {
        const matchesPositionFrom = !selectedPositionFrom || candidate.company === selectedPositionFrom;
        const matchesPosition = !selectedPosition || candidate.positionInterested === selectedPosition;
        const matchesSearchTerm = !searchTerm || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesPositionFrom && matchesPosition && matchesSearchTerm;
    });

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

    const handleSendEmailClick = (candidate) => {
        setSelectedApplicant(candidate); // Store selected applicant
        setShowModal(true); // Show the modal
    };

    const handleModalClose = () => {
        setShowModal(false);
        setInterviewDetails({
            date: '',
            time: '',
            interviewLink: '',
            clientFeedback: ''
        });
    };

    const handleModalSubmit = async () => {
        const { date, time, interviewLink, clientFeedback } = interviewDetails;
        if (!date || !time || !interviewLink || !clientFeedback) {
            alert("Please fill all fields before sending the email.");
            return;
        }
    
        const emailPayload = {
            to_email: [selectedApplicant.email],
            subject: "Interview Scheduling",
            message: `
                <p>Dear ${selectedApplicant.name},</p>
                <p>Your L2 interview has been scheduled for the company ${selectedApplicant.company}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Interview Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
                <p><strong>Interview Description:</strong> ${clientFeedback}</p>
            `
        };
    
        try {
            // Send the email via API
            await axios.post('https://saikrishnaapi.vercel.app/send-email', emailPayload);
    
            // Update the `emailSent` field in the same applicant array
            const updatedApplicant = { ...selectedApplicant, emailSent: true, L2Status: 'Scheduled', createdAt: new Date() };
    
            await db.collection('L1_Candidates').doc(user.uid).update({
                applicants: arrayRemove(selectedApplicant) // Remove the old applicant data
            });
    
            await db.collection('L1_Candidates').doc(user.uid).update({
                applicants: arrayUnion(updatedApplicant) // Add the updated applicant with the emailSent flag
            });
    
            // Update the local state
            setL1Candidates(prevApplicants => {
                return prevApplicants.map(applicant =>
                    applicant.email === selectedApplicant.email ? { ...applicant, emailSent: true } : applicant
                );
            });
    
            alert('Email sent successfully!');
            handleModalClose(); // Close the modal
        } catch (error) {
            console.error("Error sending email or updating Firestore:", error);
            alert('Failed to send email.');
        }
    };
    
    

    return (
        <div className='e-L1Candidates-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className={`e-L1Candidates-content ${collapsed ? 'collapsed' : ''}`}>
                
                <div className="L1-header-container">
                    <h2>L1 Candidates</h2>
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
                                <th>L1Status</th>
                                <th>Action</th> {/* New Action Column */}
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
                                    <td>{candidate.L1Status}</td>
                                    <td>
                                        <select 
                                            value={candidate.L1Status} 
                                            onChange={(e) => handleStatusChange(e, candidate)}
                                            disabled={candidate.L1Status === 'Shortlisted' || candidate.L1Status === 'Rejected'}
                                        >
                                            <option value="">Select Action</option>
                                            <option value="Shortlisted">Shortlist</option>
                                            <option value="Rejected">Reject</option>
                                        </select>
                                        {candidate.L1Status === "Shortlisted" && !candidate.emailSent && (
    <button 
        className="send-email-button"
        onClick={() => handleSendEmailClick(candidate)}
    >
        Send Email
    </button>
)}
{candidate.emailSent && (
    <button className="send-email-button" disabled>
        Email Sent
    </button>
)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule Interview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formDate">
                                <Form.Label>Interview Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={interviewDetails.date}
                                    onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formTime">
                                <Form.Label>Interview Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={interviewDetails.time}
                                    onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLink">
                                <Form.Label>Interview Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Enter interview link"
                                    value={interviewDetails.interviewLink}
                                    onChange={(e) => setInterviewDetails({ ...interviewDetails, interviewLink: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formFeedback">
                                <Form.Label>Interview Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter Description"
                                    value={interviewDetails.clientFeedback}
                                    onChange={(e) => setInterviewDetails({ ...interviewDetails, clientFeedback: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleModalSubmit}>
                            Send Email
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default OpenPositions;
