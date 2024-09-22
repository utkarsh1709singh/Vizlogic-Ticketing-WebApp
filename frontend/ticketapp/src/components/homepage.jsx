// src/components/homepage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Ticketing App</h1>
      <div style={{ marginTop: '40px' }}>
        <Link to="/service-request">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            Service Request
          </button>
        </Link>
        <Link to="/problem-management">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            Problem Management
          </button>
        </Link>
        <Link to="/incident-management">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            Incident Management
          </button>
        </Link>
        <Link to="/change-management">
          <button style={{ padding: '15px 30px', fontSize: '16px', margin: '10px' }}>
            Change Management
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
