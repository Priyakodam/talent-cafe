import React, { useState, useEffect } from 'react';
import EmployeeDashboard from '../EmployeeDashboard/EmployeeDashboard';
import { useAuth } from "../../Context/AuthContext";
import { db } from './../../Firebase/FirebaseConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import "./EmployeeOpenPositions.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddPositionModal from './PositionRequired'; // Import the modal for position titles
import AddCompanyModal from './Client'; // Import the modal for companies
import AddDepartmentModal from './AddDepartment'; // Import the modal for departments

const OpenPositions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEditMode = queryParams.get('edit') === 'true';
  const positionId = queryParams.get('id');

  const [collapsed, setCollapsed] = useState(false);
  const [department, setDepartment] = useState(''); // New state for department
  const [departmentDescription, setDepartmentDescription] = useState(''); // Department description
  const [departments, setDepartments] = useState([]); // State to store departments
  const [positionTitle, setPositionTitle] = useState('');
  const [positionFrom, setPositionFrom] = useState('');
  const [budget, setBudget] = useState('');
  const [experience, setExperience] = useState('');
  const [numOfOpenPositions, setNumOfOpenPositions] = useState('');
  const [status, setStatus] = useState('active');
  const [priority, setPriority] = useState('');
  const [priorityDescription, setPriorityDescription] = useState('');
  const [positions, setPositions] = useState([]);
  const [companies, setCompanies] = useState([]); // State to store companies
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false); // Modal state for companies
  const [showDepartmentModal, setShowDepartmentModal] = useState(false); // Modal state for department

  const handlePositionModalClose = () => setShowPositionModal(false);
  const handleCompanyModalClose = () => setShowCompanyModal(false);
  const handleDepartmentModalClose = () => setShowDepartmentModal(false); // Handle department modal close

  // Fetch departments from Firestore
  const fetchDepartments = async () => {
    try {
      const snapshot = await db.collection('departments').get(); // Assuming the department data is stored in 'departments'
      const departmentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch positions from Firestore
  const fetchPositions = async () => {
    try {
      const snapshot = await db.collection('positionsrequired').get();
      const positionList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPositions(positionList);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Fetch companies from Firestore
  const fetchCompanies = async () => {
    try {
      const snapshot = await db.collection('clients').get(); // Assuming the company data is stored in 'clients'
      const companyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(companyList);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchCompanies();
    fetchDepartments(); // Fetch departments on mount
  }, []);

  useEffect(() => {
    if (isEditMode && positionId) {
      const fetchPositionForEdit = async () => {
        try {
          const doc = await db.collection('position').doc(positionId).get();
          if (doc.exists) {
            const positionData = doc.data();
            setPositionTitle(positionData.positionTitle);
            setPositionFrom(positionData.positionFrom);
            setBudget(positionData.budget);
            setExperience(positionData.experience);
            setNumOfOpenPositions(positionData.numOfOpenPositions);
            setStatus(positionData.status);
            setPriority(positionData.priority);
            setPriorityDescription(positionData.priorityDescription);
            setDepartment(positionData.department); // Set department
          }
        } catch (error) {
          console.error("Error fetching position for edit:", error);
        }
      };
      fetchPositionForEdit();
    }
  }, [isEditMode, positionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        department, // Include department in data
        positionTitle,
        positionFrom,
        budget,
        experience,
        numOfOpenPositions,
        status,
        priority,
        priorityDescription,
        createdBy: user.uid,
        createdAt: new Date(),
      };

      if (isEditMode) {
        await db.collection('position').doc(positionId).update(data);
        console.log("Position updated successfully");
      } else {
        await db.collection('position').add(data);
        console.log("Position added successfully");
      }

      setDepartment('');
      setPositionTitle('');
      setPositionFrom('');
      setBudget('');
      setExperience('');
      setNumOfOpenPositions('');
      setStatus('active');
      setPriority('');
      setPriorityDescription('');
      navigate('/e-viewopenpositions');
    } catch (error) {
      console.error("Error saving position:", error);
    }
  };

  return (
    <div className='e-openpositions-container'>
      <EmployeeDashboard onToggleSidebar={setCollapsed} />
      <div className={`e-openpositions-content ${collapsed ? 'collapsed' : ''}`}>
       
        <h3 className='text-center'>{isEditMode ? 'Edit Position' : 'Open Positions'}</h3>

        <form onSubmit={handleSubmit}>
          {/* Department Dropdown */}
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Position From:</label>
                <div className="input-group">
                  <select
                    className="form-control"
                    value={positionFrom}
                    onChange={(e) => setPositionFrom(e.target.value)}
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.companyName}>{company.companyName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCompanyModal(true)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Department:</label>
                <div className="input-group">
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.departmentName}>{dept.departmentName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDepartmentModal(true)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
        
           
            
          </div>

          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Position Title:</label>
                <div className="input-group">
                  <select
                    className="form-control"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(position => (
                      <option key={position.id} value={position.positionName}>{position.positionName}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPositionModal(true)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Budget:</label>
                <input
                  type="number"
                  className="form-control"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>
            </div>

            
          </div>

          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Experience (years):</label>
                <input
                  type="number"
                  className="form-control"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Number of Open Positions:</label>
                <input
                  type="number"
                  className="form-control"
                  value={numOfOpenPositions}
                  onChange={(e) => setNumOfOpenPositions(e.target.value)}
                  required
                />
              </div>
            </div>

           
          </div>

          {/* Priority Section */}
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Status:</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Priority:</label>
                <select
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Priority Description:</label>
                <input
                  type="text"
                  className="form-control"
                  value={priorityDescription}
                  onChange={(e) => setPriorityDescription(e.target.value)}
                  placeholder="E.g., High and urgent, High and within 15 days"
                  required
                />
              </div>
            </div>
          </div>

          

          {/* Submit Button */}
          <div className="text-center">
  <button type="submit" className="btn btn-primary mt-3">
    {isEditMode ? 'Update Position' : 'Save Position'}
  </button>
</div>

        </form>

        {/* Modals */}
        <AddPositionModal show={showPositionModal} handleClose={handlePositionModalClose} fetchPositions={fetchPositions} />
        <AddCompanyModal show={showCompanyModal} handleClose={handleCompanyModalClose} fetchCompanies={fetchCompanies} />
        <AddDepartmentModal show={showDepartmentModal} handleClose={handleDepartmentModalClose} fetchDepartments={fetchDepartments} />
      </div>
    </div>
  );
};

export default OpenPositions;
