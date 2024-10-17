import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase/FirebaseConfig'; // Import Firestore and Authentication
import Dashboard from '../Dashboard/Dashboard';
import './ManageEmployee.css'; // Import CSS for this component
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for action buttons

const ManageEmploye = () => {
  const [employees, setEmployees] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // Define collapsed state
  const [editEmployee, setEditEmployee] = useState(null); // Store employee being edited
  const [formValues, setFormValues] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
    password: '',
    dateOfJoining: null
  });

  // Fetch employee data from Firestore on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await db.collection('addemployee').get();
        const employeeList = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          slNo: index + 1, // Serial number based on index
          ...doc.data(),
        }));

        // Sort employees by dateOfJoining in descending order (most recent first)
        const sortedEmployees = employeeList.sort(
          (a, b) => b.dateOfJoining.seconds - a.dateOfJoining.seconds
        );

        setEmployees(sortedEmployees); // Store the sorted data in state
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle delete employee functionality
  const handleDelete = async (id, uid) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // Delete the user from Firestore (addemployee table)
        await db.collection('addemployee').doc(id).delete();

        // Delete the user from Firebase Authentication
        const user = auth.currentUser;
        if (user && user.uid === uid) {
          await user.delete();
        }

        // Update the employees state after deletion
        setEmployees(employees.filter(employee => employee.id !== id));

        alert('Employee deleted successfully from Firestore and Authentication.');
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Handle update employee functionality
  const handleUpdate = (employee) => {
    setEditEmployee(employee.id); // Set the employee being edited
    setFormValues({
      name: employee.name,
      mobile: employee.mobile,
      email: employee.email,
      designation: employee.designation,
      password: employee.password,
      dateOfJoining: new Date(employee.dateOfJoining.seconds * 1000),
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Submit the updated employee details
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update employee in Firestore
      await db.collection('addemployee').doc(editEmployee).update({
        name: formValues.name,
        mobile: formValues.mobile,
        email: formValues.email,
        designation: formValues.designation,
        password: formValues.password,
        dateOfJoining: formValues.dateOfJoining,
      });

      // If email is changed, update in Firebase Authentication
      const user = auth.currentUser;
      if (user && user.uid === editEmployee && formValues.email !== user.email) {
        await user.updateEmail(formValues.email);
      }

      // Update the employee in state
      setEmployees(employees.map(emp => (emp.id === editEmployee ? { ...emp, ...formValues } : emp)));
      
      setEditEmployee(null); // Reset editing state
      setFormValues({
        name: '',
        mobile: '',
        email: '',
        designation: '',
        password: '',
        dateOfJoining: null
      });

      alert('Employee updated successfully.');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Helper function to format the date in dd-mm-yyyy format
  const formatDate = (dateObj) => {
    const date = new Date(dateObj.seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="manage-employe-container">
      {/* Pass the setCollapsed function to Dashboard */}
      <Dashboard onToggleSidebar={setCollapsed} />
      
      <div className={`manage-employe-content ${collapsed ? 'collapsed' : ''}`}>
        <h3>Manage Employees</h3>

        {editEmployee ? (
          <form onSubmit={handleFormSubmit} className="updateemployee">
  <h2 className="updateemployee-heading">Edit Employee</h2>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        placeholder="Enter Name"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="mobile">Mobile</label>
      <input
        type="text"
        name="mobile"
        value={formValues.mobile}
        onChange={handleChange}
        placeholder="Enter Mobile"
        required
      />
    </div>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        placeholder="Enter Email"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="designation">Designation</label>
      <input
        type="text"
        name="designation"
        value={formValues.designation}
        onChange={handleChange}
        placeholder="Enter Designation"
        required
      />
    </div>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        value={formValues.password}
        onChange={handleChange}
        placeholder="Enter Password"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="dateOfJoining">Date of Joining</label>
      <input
        type="date"
        name="dateOfJoining"
        value={formValues.dateOfJoining ? formValues.dateOfJoining.toISOString().split("T")[0] : ""}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <button type="submit" className="updateemployee-submit-btn">Update Employee</button>
</form>

   
        ) : (
          <div className="table-wrapper">
            <table className="manage-employe-table">
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Password</th>
                  <th>DOJ</th> 
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td>{index + 1}</td> {/* Serial Number */}
                      <td>{employee.name}</td>
                      <td>{employee.mobile}</td>
                      <td>{employee.email}</td>
                      <td>{employee.designation}</td>
                      <td>{employee.password}</td> {/* Assuming password is stored in the data */}
                      <td>{formatDate(employee.dateOfJoining)}</td> {/* Date of Joining (DOJ) */}
                      <td>{formatDate(employee.createdAt)}</td> {/* Created Date */}
                      <td>
                        <FaEdit
                          className="action-icon"
                          onClick={() => handleUpdate(employee)}
                        /> {/* Update Icon */}
                        <FaTrash
                          className="action-icon"
                          onClick={() => handleDelete(employee.id, employee.uid)} // Pass the user UID
                        /> {/* Delete Icon */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEmploye;
