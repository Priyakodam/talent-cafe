import React, { useState } from 'react';
import './AddEmployee.css'; // Custom styles for the AddEmployee form
import Dashboard from '../Dashboard/Dashboard';
import { db, auth } from '../Firebase/FirebaseConfig'; // Import Firebase Firestore and Auth
import firebase from 'firebase/compat/app'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
    password: '',
    dateOfJoining: ''
  });

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        employeeData.email,
        employeeData.password
      );
      const user = userCredential.user;

      await db.collection('addemployee').doc(user.uid).set({
        uid: user.uid,
        name: employeeData.name,
        mobile: employeeData.mobile,
        email: employeeData.email,
        role: "employee",
        designation: employeeData.designation,
        password: employeeData.password,
        dateOfJoining: new Date(employeeData.dateOfJoining),
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
      });

      alert('Employee added successfully');
      setEmployeeData({
        name: '',
        mobile: '',
        email: '',
        designation: '',
        password: '',
        dateOfJoining: ''
      });
    } catch (error) {
      console.error('Error adding employee: ', error);
      alert('Failed to add employee, please try again.');
    }
  };

  // Handle close button click to navigate to manageemployee page
  const handleClose = () => {
    navigate('/manageemployee'); // Redirect to the manageemployee route
  };

  return (
    <div className="clientlist-container">
      <Dashboard onToggleSidebar={setCollapsed} />

      <div className="add-employee-container mt-4">
        <div className="add-employee-card">
          <div className="add-employee-card-header">
            <h3>Employee Details</h3>
          </div>
          <div className="add-employee-card-body">
            <form onSubmit={handleSubmit}>
              <div className="add-employee-form-row">
                <div className="add-employee-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={employeeData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div className="add-employee-form-group">
                  <label htmlFor="mobile">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    value={employeeData.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile"
                    required
                  />
                </div>
              </div>
              <div className="add-employee-form-row">
                <div className="add-employee-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={employeeData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="add-employee-form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    value={employeeData.designation}
                    onChange={handleChange}
                    placeholder="Enter Designation"
                    required
                  />
                </div>
              </div>
              <div className="add-employee-form-row">
                <div className="add-employee-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={employeeData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />
                </div>
                <div className="add-employee-form-group">
                  <label htmlFor="dateOfJoining">Date of Joining</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfJoining"
                    value={employeeData.dateOfJoining}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="add-employee-buttons">
                <button type="submit" className="btn btn-primary add-employee-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary close-employee-btn"
                  onClick={handleClose} 
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
