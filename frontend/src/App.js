// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage'; // lowercase 'h'

// Placeholder components for the other pages
const ServiceRequestPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Service Request Page</h1>;
const ProblemManagementPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Problem Management Page</h1>;
const IncidentManagementPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Incident Management Page</h1>;
const ChangeManagementPage = () => <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Change Management Page</h1>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/service-request" element={<ServiceRequestPage />} />
        <Route path="/problem-management" element={<ProblemManagementPage />} />
        <Route path="/incident-management" element={<IncidentManagementPage />} />
        <Route path="/change-management" element={<ChangeManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
