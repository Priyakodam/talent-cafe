import React, { useState } from 'react';
import './AddEmployee.css'; // Custom styles for the AddEmployee form
import Dashboard from '../Dashboard/Dashboard';
import { db, auth } from '../Firebase/FirebaseConfig'; // Import Firebase Firestore and Auth

const AddEmployee = () => {
  // State to capture form input
  const [employeeData, setEmployeeData] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
    password: '',
    dateOfJoining: ''
  });

  const [collapsed, setCollapsed] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        employeeData.email,
        employeeData.password
      );
      const user = userCredential.user;

      // Add employee data to Firestore, using uid as the document ID
      await db.collection('addemployee').doc(user.uid).set({
        uid: user.uid, // Store the uid in the Firestore document
        name: employeeData.name,
        mobile: employeeData.mobile,
        email: employeeData.email,
        designation: employeeData.designation,
        dateOfJoining: new Date(employeeData.dateOfJoining)
      });

      alert('Employee added successfully');

      // Clear the form after successful submission
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
              <button type="submit" className="btn btn-primary add-employee-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
