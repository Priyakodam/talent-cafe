import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Replace Redirect with Navigate
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./Components/Login/Login"
import { AuthProvider }  from "./Components/Context/AuthContext";
import OpenPositions from "./Components/OpenPositions/OpenPositions";
import ClientList from "./Components/Clients/ClientList";
import Screening from "./Components/Screening/Screening";
import TotalData from "./Components/TotalData/TotalData";
import AddEmployee from "./Components/AddEmployee/AddEmployee";
import EmployeeTotalData from "./Components/Employee/EmployeeTotalData/EmployeeTotalData";
import EmployeeOpenPositions from "./Components/Employee/OpenPositions/EmployeeOpenPositions";
import EmployeeClient from "./Components/Employee/Client/EmployeeClient";
import EmployeeScreening from "./Components/Employee/Screening/EmployeeScreening";
import EmployeeApplicant from "./Components/Employee/Applicants/EmployeeApplicants";

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
      <Route path="/dashboard" element={<TotalData/>} />
      <Route path="/addemployee" element={<AddEmployee/>} />
      <Route path="/e-dashboard" element={<EmployeeTotalData/>} />
      <Route path="/e-openpositions" element={<EmployeeOpenPositions/>} />
      <Route path="/e-clients" element={<EmployeeClient/>} />
      <Route path="/e-screening" element={<EmployeeScreening/>} />
      <Route path="/e-applicant" element={<EmployeeApplicant/>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>


   

    </QueryClientProvider>
  );
}

export default App;

