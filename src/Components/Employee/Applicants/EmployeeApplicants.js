
import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { arrayUnion } from 'firebase/firestore';
import { db, storage } from '../../Firebase/FirebaseConfig'; // Make sure to import db and storage
import "./EmployeeApplicants.css";

const EmployeeApplicants = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    address: '',
    educationalQualification: '',
    city: '',
    yearOfPassing: '',
    yearsOfExperience: '',
    currentCompany: '',
    positionInterested: '',
    positionFrom: '', // Add this line
    designation: '',
    preferredArea: '',
    skills: '',
    availability: '',
    resume: null,
    source: '',
  });
  
  const [positions, setPositions] = useState([]); // To store positions from Firestore
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [companyOptions, setCompanyOptions] = useState([]); // To hold 'positionFrom' values


  // Fetch positions from Firestore
  // const fetchPositions = async () => {
  //   try {
  //     const positionsSnapshot = await db.collection('positionsrequired').get();
  //     const fetchedPositions = positionsSnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setPositions(fetchedPositions);
  //   } catch (error) {
  //     console.error("Error fetching positions:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchPositions(); 
  // }, []);


  const fetchPositions = async () => {
    try {
        const positionsSnapshot = await db.collection('position')
            .where('createdBy', '==', user.uid) // Add filter here
            .get();

        const fetchedPositions = positionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setPositions(fetchedPositions);

        // Create a unique list of PositionFrom
        const uniquePositionFrom = [...new Set(fetchedPositions.map(pos => pos.positionTitle))];
        setFilteredPositions(uniquePositionFrom);
    } catch (error) {
        console.error("Error fetching positions:", error);
    }
};

useEffect(() => {
  fetchPositions(); // Fetch positions when the component mounts
}, []);




const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'positionInterested') {
    // Filter documents by selected positionTitle
    const selectedPositions = positions.filter(pos => pos.positionTitle === value);

    // Extract positionFrom values
    const positionFromValues = selectedPositions.map(pos => pos.positionFrom);

    // Update the formData and set the available company options
    setFormData({ 
      ...formData, 
      [name]: value 
    });

    // Update company dropdown options with unique positionFrom values
    setCompanyOptions([...new Set(positionFromValues)]);
  } else {
    setFormData({ ...formData, [name]: value });
  }
};



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if the file is a PDF
    if (file && file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      setFormData({ ...formData, resume: null });
    } else {
      setFormData({ ...formData, resume: file });
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`; // Format to dd-mm-yyyy
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Format the date of birth before saving
    const formattedDateOfBirth = formatDateToDDMMYYYY(formData.dateOfBirth);
  
    // Upload resume to Firebase Storage
    try {
      if (!formData.resume) {
        alert("Please upload a resume.");
        setLoading(false);
        return;
      }
  
      const resumeRef = storage.ref(`resumes/${formData.resume.name}`);
      await resumeRef.put(formData.resume);
      const resumeURL = await resumeRef.getDownloadURL();
  
      // Prepare data for the new applicant, including the company name
      const applicantData = {
        ...formData,
        company: formData.positionFrom, // Store the selected company here
        userName: user.name,
        userId: user.uid,
        status: "Applied",
        resume: resumeURL, // Store the download URL of the resume
        dateOfBirth: formattedDateOfBirth, // Store the formatted date of birth
        createdAt: new Date(),
      };
  
      // Remove any fields that are undefined
      Object.keys(applicantData).forEach(
        (key) => applicantData[key] === undefined && delete applicantData[key]
      );
  
      // Reference the document with userId as the document ID
      const applicantDocRef = db.collection("applicants").doc(user.uid);
  
      // Fetch the existing applicant data
      const doc = await applicantDocRef.get();
  
      if (doc.exists) {
        // Document exists, update the applicants array
        await applicantDocRef.update({
          applicants: arrayUnion(applicantData), // Use arrayUnion here
        });
      } else {
        // Document does not exist, create a new one with the applicants array
        await applicantDocRef.set({
          applicants: [applicantData], // Initialize with the first applicant
        });
      }
  
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error uploading resume or saving data:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handlebackclick = () => {
    navigate('/e-screening'); // Change this path to your actual route for adding clients
  };

  return (
    <div className='e-applicant-container'>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`e-applicant-content ${collapsed ? 'collapsed' : ''}`}>
        <h2 className="mb-4">Upload Application</h2>
        <Card className="border p-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile (Whatsapp)</Form.Label>
                    <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Educational Qualification</Form.Label>
                    <Form.Control type="text" name="educationalQualification" value={formData.educationalQualification} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Year of Passing</Form.Label>
                    <Form.Control type="number" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Years of Experience</Form.Label>
                    <Form.Control type="text" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current / Last Company Name</Form.Label>
                    <Form.Control type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} />
                  </Form.Group>
                </Col>
                {/* <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position Interested For</Form.Label>
                    <Form.Select
                      name="positionInterested"
                      value={formData.positionInterested}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Position</option>
                      {positions.map(position => (
                        <option key={position.id} value={position.positionName}>
                          {position.positionName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col> */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position Interested For</Form.Label>
                    <Form.Select
                      name="positionInterested"
                      value={formData.positionInterested}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select Position</option>
                      {filteredPositions.map((positionTitle, index) => (
                                <option key={index} value={positionTitle}>
                                    {positionTitle}
                                </option>
                            ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
  <Form.Group className="mb-3">
    <Form.Label>Select Company</Form.Label>
    <Form.Select
      name="positionFrom"
      value={formData.positionFrom}
      onChange={handleChange}
    >
      <option value="" disabled>Select Company</option>
      {companyOptions.map((company, index) => (
        <option key={index} value={company}>
          {company}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
</Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control type="text" name="designation" value={formData.designation} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Area for Working</Form.Label>
                    <Form.Control type="text" name="preferredArea" value={formData.preferredArea} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control type="text" name="skills" value={formData.skills} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Source</Form.Label>
                    <Form.Select name="source" value={formData.source} onChange={handleChange}>
                      <option value="" disabled>Select Source</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Company Website">Company Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Job Fair">Job Fair</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Resume</Form.Label>
                    <Form.Control type="file" name="resume" onChange={handleFileChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Button onClick={handlebackclick} variant="btn btn-secondary" style={{marginRight:'10px'}}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeApplicants;
