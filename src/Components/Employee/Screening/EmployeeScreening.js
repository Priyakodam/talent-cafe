
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from '../../Firebase/FirebaseConfig';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import "./EmployeeScreening.css";

const EmployeeScreening = () => {
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPositionFrom, setSelectedPositionFrom] = useState('');
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [interviewDetails, setInterviewDetails] = useState({
        date: '',
        time: '',
        interviewLink: '',
        clientFeedback: ''
    });

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

                applicantsData.reverse(); // Reverse the order so the latest comes first
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
            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayRemove(applicant)
            });

            const updatedApplicant = { ...applicant, status: newStatus };

            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayUnion(updatedApplicant)
            });

            setApplicants(prevApplicants => {
                const newApplicants = [...prevApplicants];
                newApplicants[index] = updatedApplicant;
                return newApplicants;
            });

            if (newStatus === "Shortlisted") {
                await db.collection('L1_Candidates').doc(user.uid).set({
                    applicants: arrayUnion({
                        ...updatedApplicant,
                        L1Status: 'Scheduled',
                        createdAt: new Date(),
                    })
                }, { merge: true });
            }

            console.log(`Applicant at index ${index} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const handleAddProfileClick = () => {
        navigate('/e-applicant');
    };

    const fetchPositions = async () => {
        try {
            const positionsSnapshot = await db.collection('position')
                .where('createdBy', '==', user.uid) 
                .get();

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
    

    const handleSendEmailClick = (applicant) => {
        setSelectedApplicant(applicant); // Store selected applicant
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
                <p>Your L1 interview has been scheduled for the company ${selectedApplicant.company}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Interview Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
                <p><strong>Client Feedback:</strong> ${clientFeedback}</p>
            `
        };
    
        try {
            // Send the email via API
            await axios.post('https://saikrishnaapi.vercel.app/send-email', emailPayload);
    
            // Update the `emailSent` field in the same applicant array
            const updatedApplicant = { ...selectedApplicant, emailSent: true, L1Status: 'Scheduled', createdAt: new Date() };
    
            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayRemove(selectedApplicant) // Remove the old applicant data
            });
    
            await db.collection('applicants').doc(user.uid).update({
                applicants: arrayUnion(updatedApplicant) // Add the updated applicant with the emailSent flag
            });
    
            // Update the local state
            setApplicants(prevApplicants => {
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
        <div className='e-screening-container'>
            <EmployeeDashboard onToggleSidebar={setCollapsed} />
            <div className= {`e-screening-content ${collapsed ? 'collapsed' : ''}`}>
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

                        <button className="add-profile-button" onClick={handleAddProfileClick}>
                            + Add Profile
                        </button>
                    </div>
                </div>
                <div className='table-responsive'>
    <table className="styled-table screening-custom-table" >

                        <thead>
                            <tr>
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
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((applicant, index) => (
                                <tr key={index}>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.mobile}</td>
                                    {/* <td className="one-line">{applicant.dateOfBirth}</td> */}
                                    <td>{applicant.gender}</td>
                                    <td>{applicant.educationalQualification}</td>
                                    <td>{applicant.yearOfPassing}</td>                                
                                    <td>{applicant.yearsOfExperience}</td>
                                    {/* <td>{applicant.address}</td>
                                    <td>{applicant.city}</td> */}
                                    <td>{applicant.currentCompany}</td>
                                    <td>{applicant.positionInterested}</td>
                                    <td>{applicant.company}</td>
                                    <td>{applicant.designation}</td>
                                    {/* <td>{applicant.preferredArea}</td>   */}
                                    <td>{applicant.skills}</td>
                                    {/* <td>{applicant.source}</td>                               */}
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

                                    {/* Conditionally render the "Send Email" button when the status is "Shortlisted" */}
                                    {applicant.status === "Shortlisted" && !applicant.emailSent && (
    <button 
        className="send-email-button"
        onClick={() => handleSendEmailClick(applicant)}
    >
        Send Email
    </button>
)}
{applicant.emailSent && (
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
                                <Form.Label>Client Feedback</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter feedback"
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

export default EmployeeScreening;
