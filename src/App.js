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

import Clients from "./Components/Clients";

import AddEmployee from "./Components/AddEmployee/AddEmployee";


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

      <Route path="/client-form" element={<Clients/>} />

      <Route path="/addemployee" element={<AddEmployee/>} />

      </Routes>
    </BrowserRouter>
    </AuthProvider>


   

    </QueryClientProvider>
  );
}

export default App;

