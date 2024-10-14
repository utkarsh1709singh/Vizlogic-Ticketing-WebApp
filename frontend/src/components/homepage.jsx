// src/components/homepage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Ticketing App</h1>
      <div style={{ marginTop: '40px' }}>
        <Link to="/submit-ticket">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            Submit Ticket
          </button>
        </Link>
        <Link to="/view-tickets">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            View Tickets
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

