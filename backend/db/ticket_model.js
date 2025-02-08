const mongoose = require('mongoose');
const { getDatabaseConnection } = require('./db');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {  
        type: String,
        required: true,
        enum: ["Incident Request", "Service Request"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open" // Default status when a ticket is created
    },
    priority: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    slaDueDate: {
        type: Date,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company", // References the Company model
        required: true
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 }, // Rating from 1 to 5
        comments: { type: String }
    }
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

// Function to dynamically get Ticket model per company
const getTicketModel = async (companyId) => {
    const connection = await getDatabaseConnection(companyId);

    if (!connection.models.Ticket) {
        return connection.model("Ticket", ticketSchema);
    }
    return connection.models.Ticket;
};

module.exports = { getTicketModel };