const express = require('express');
const router = express.Router();

// In-memory storage for tickets
const tickets = [];

// Create a Ticket
router.post('/create', (req, res) => {
  const { title, description, priority, createdBy } = req.body;

  if (!title || !description || !createdBy) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newTicket = {
    id: tickets.length + 1,
    title,
    description,
    priority: priority || 'low',
    createdBy,
    status: 'open',
    createdAt: new Date(),
  };

  tickets.push(newTicket);
  res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
});

// Get All Tickets
router.get('/all', (req, res) => {
  res.status(200).json(tickets);
});

module.exports = router;


