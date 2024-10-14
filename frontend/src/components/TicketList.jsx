// src/components/TicketList.jsx
import React from "react";

const TicketList = ({ tickets }) => {
  return (
    <div>
      <h2>Your Submitted Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets submitted yet.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              {ticket.file && <p>Attached file: {ticket.file.name}</p>}
              <p>Status: <strong>{ticket.status}</strong></p> {/* Display the status */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;


