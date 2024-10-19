import React, { useState, useEffect } from "react";
import { db } from "./../Firebase/FirebaseConfig"; // Ensure you have the Firestore config set up
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmpDailyReport.css"; // Add custom CSS for EmpDailyReport
import Dashboard from "../Dashboard/Dashboard";

const EmpDailyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [reportData, setReportData] = useState([]); // State to hold fetched report data
  const [employeeWorkedHours, setEmployeeWorkedHours] = useState({}); // For displaying total worked hours per employee

  // Function to fetch data from Firestore based on the selected date
  const fetchDailyReport = async (date) => {
    try {
      const snapshot = await db.collection("productivity-tracker").where("date", "==", date).get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportData(data); // Set the fetched data

      if (data.length > 0) {
        calculateTotalWorkedHours(data);
      } else {
        setEmployeeWorkedHours({}); // Reset the worked hours if no data is found
      }
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
  };

  // Calculate total worked hours for each employee
  const calculateTotalWorkedHours = (data) => {
    const employeeHours = {};

    data.forEach((entry) => {
      const employee = entry.employeeName || "Unknown";
      if (!employeeHours[employee]) {
        employeeHours[employee] = 0; // Initialize hours for each employee
      }

      // Calculate total time for each task
      const timeTakenTasks = [entry.timeTaken, entry.timeTakenLinkedin, entry.timeTakenUpload].filter(Boolean);
      timeTakenTasks.forEach((taskTime) => {
        if (taskTime) {
          const time = taskTime.split(" "); // Example: "1 hr 30 min"
          const hours = parseInt(time[0], 10) || 0;
          const minutes = parseInt(time[2], 10) || 0;
          const totalMinutes = hours * 60 + minutes;

          employeeHours[employee] += totalMinutes;
        }
      });
    });

    // Convert total minutes back to hours and minutes for each employee
    const employeeWorkedHours = {};
    Object.keys(employeeHours).forEach((employee) => {
      const totalMinutes = employeeHours[employee];
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      employeeWorkedHours[employee] = `${totalHours} hr ${remainingMinutes} min`;
    });

    setEmployeeWorkedHours(employeeWorkedHours);
  };

  // Function to format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Handle null or undefined dateString
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Update the selected date
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDailyReport(selectedDate); // Fetch data when the submit button is clicked
  };

  return (
    <div className="container-fluid emp-daily-report-container">
      <Dashboard /> {/* Assuming Dashboard is required */}

      {/* Main Card Section for Table */}
      <div className="row">
        <div className="col-md-9">
          <div className="card shadow-lg emp-daily-report-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="daily-report-title">Employee Daily Report</h3>
              <div className="d-flex align-items-center">
                <form onSubmit={handleSubmit} className="d-flex">
                  <label htmlFor="dateInput" className="mr-2 font-weight-bold">Select Date:</label>
                  <input
                    type="date"
                    id="dateInput"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="form-control mr-2"
                  />
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>

            <div className="card-body">
              {reportData.length > 0 ? (
                <table className="table table-bordered table-hover table-striped emp-daily-report-table">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Employee Name</th>
                      <th>Company Name</th>
                      <th>Position</th>
                      <th>Task</th>
                      <th>Quantity</th>
                      <th>Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((entry, index) => (
                      <tr key={entry.id} className="emp-daily-report-row">
                        <td>{index + 1}</td>
                        <td>{formatDate(entry.date)}</td>
                        <td>{entry.employeeName || "N/A"}</td>
                        <td>{entry.company_name || "N/A"}</td>
                        <td>{entry.position || "N/A"}</td>
                        <td>{entry.task || "N/A"}</td>
                        <td>
                          {entry.task === "Profiles Reviewed"
                            ? entry.profilesReviewed
                            : entry.task === "LinkedIn"
                            ? entry.linkedin
                            : entry.task === "Uploaded on ATS"
                            ? entry.candidateInfoUploaded
                            : entry.task === "Candidates Screened"
                            ? entry.candidatesScreened
                            : "N/A"}
                        </td>
                        <td>{entry.timeTaken || entry.timeTakenLinkedin || entry.timeTakenUpload || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No report found for the selected date.</p>
              )}
            </div>
          </div>
        </div>

        {/* Employee Info Cards (Total Worked Hours) */}
        <div className="col-md-3">
          {Object.keys(employeeWorkedHours).length > 0 ? (
            Object.keys(employeeWorkedHours).map((employee) => (
              <div className="card shadow p-3 mb-3 bg-white rounded emp-daily-report-info-card" key={employee}>
                <h6>Employee Name: {employee}</h6>
                <h6>Total Worked Hours: {employeeWorkedHours[employee]}</h6>
              </div>
            ))
          ) : (
            <p className="text-center">No Work Done Data Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpDailyReport;
