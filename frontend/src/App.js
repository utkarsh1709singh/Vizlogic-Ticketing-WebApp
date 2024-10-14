// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage'; 
import TicketForm from './components/TicketForm'; 
import TicketList from './components/TicketList'; 

const ServiceRequestPage = ({ onTicketSubmit }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Submit Your Ticket</h1>
      <TicketForm onSubmit={onTicketSubmit} />
    </div>
  );
};

const ViewTicketsPage = ({ tickets }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>View Submitted Tickets</h1>
      <TicketList tickets={tickets} />
    </div>
  );
};

const App = () => {
  const [tickets, setTickets] = useState([]);

  // Handle ticket submission
  const handleTicketSubmit = (newTicket) => {
    const ticketWithStatus = {
      ...newTicket,
      status: "Open" // Default status for now
    };
    setTickets([...tickets, ticketWithStatus]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit-ticket" element={<ServiceRequestPage onTicketSubmit={handleTicketSubmit} />} />
        <Route path="/view-tickets" element={<ViewTicketsPage tickets={tickets} />} />
      </Routes>
    </Router>
  );
};

export default App;




