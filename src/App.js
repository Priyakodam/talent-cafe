import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./Components/Login/Login";
import { AuthProvider } from "./Components/Context/AuthContext";
import OpenPositions from "./Components/OpenPositions/OpenPositions";
import ClientList from "./Components/Clients/ClientList";
import Screening from "./Components/Screening/Screening";
import TotalData from "./Components/TotalData/TotalData";
import AddEmployee from "./Components/AddEmployee/AddEmployee";
import EmployeeTotalData from "./Components/Employee/EmployeeTotalData/EmployeeTotalData";
import EmployeeOpenPositions from "./Components/Employee/OpenPositions/EmployeeOpenPositions";
import EmployeeClient from "./Components/Employee/Client/EmployeeClient";
import EmployeeScreening from "./Components/Employee/Screening/EmployeeScreening";
import ManageEmployee from "./Components/ManageEmploye/ManageEmployee";
import EmployeeApplicant from "./Components/Employee/Applicants/EmployeeApplicants";
import EmployeeViewClients from "./Components/Employee/Client/EmployeeViewClients";
import EmpL1Candidates from './Components/Employee/Screening/EmpL1Candidates';
import EmpL2Candidates from './Components/Employee/Screening/EmpL2Candidates';
import ViewOpenPositions from "./Components/Employee/OpenPositions/ViewOpenPositions";
import EmployeeProductivityTracker from "./Components/Employee/ProductivityTracker/EmployeeProductivityTracker";
import ManageProductivityTracker from "./Components/Employee/ProductivityTracker/ManageProductivityTracker";
import EditProductivityTracker from "./Components/Employee/ProductivityTracker/EditProductivityTracker"; // Import Edit Component
import ProductivityTracker from "./Components/ProductivityTracker/ProductivityTracker";
import EmpF2FCandidates from './Components/Employee/Screening/EmpF2FCandidates';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/openpositions" element={<OpenPositions />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/dashboard" element={<TotalData />} />
            <Route path="/addemployee" element={<AddEmployee />} />
            <Route path="/manageemployee" element={<ManageEmployee />} />
            <Route path="/e-dashboard" element={<EmployeeTotalData />} />
            <Route path="/e-openpositions" element={<EmployeeOpenPositions />} />
            <Route path="/e-clients" element={<EmployeeClient />} />
            <Route path="/e-view-clients" element={<EmployeeViewClients />} />
            <Route path="/e-screening" element={<EmployeeScreening />} />
            <Route path="/e-applicant" element={<EmployeeApplicant />} />
            <Route path="/e-L1candidates" element={<EmpL1Candidates />} />
            <Route path="/e-L2candidates" element={<EmpL2Candidates />} />
            <Route path="/e-F2Fcandidates" element={<EmpF2FCandidates />} />
            <Route path="/e-viewopenpositions" element={<ViewOpenPositions />} />
            <Route path="/productivity-tracker" element={<EmployeeProductivityTracker />} />
            <Route path="/manage-productivity-tracker" element={<ManageProductivityTracker />} />
            <Route path="/edit-productivity-tracker" element={<EditProductivityTracker />} /> 
            <Route path="/productivity-all-tracker" element={<ProductivityTracker />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
