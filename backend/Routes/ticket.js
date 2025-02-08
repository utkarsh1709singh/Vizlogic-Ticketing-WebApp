const express = require('express');
const router = express.Router();
const{getTicketModel} = require('../db/ticket_model');
const jwt = require('jsonwebtoken');
const{authMiddleware} = require('../middleware');
const{JWT_SECRET} = require("../config");
const zod = require('zod');

const ticketRaiseSchema = zod.object({
    title: zod.string().min(1, "Title is required"),
    description: zod.string().min(1, "Description is required"),
    category: zod.enum(["Incident Request", "Service Request"])
});

router.post('/raise_ticket', authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const { success, data } = ticketRaiseSchema.safeParse(body);

        if (!success) {
            return res.status(400).json({ message: "Invalid inputs" });
        }

        const { title, description, category } = data;
        const companyId = req.user.companyId; // Extracted from authMiddleware
        const createdBy = req.user.userId; // Extracted from authMiddleware

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        // Get the ticket model dynamically for the company
        const Ticket = await getTicketModel(companyId);

        // Create a new ticket
        const newTicket = new Ticket({
            title,
            description,
            category,
            createdBy,
            status: "Open",
            priority: "Medium", // Default priority
            slaDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // SLA due in 3 days
            companyId, 
        });

        // Save the ticket in the company's database
        await newTicket.save();

        res.status(201).json({ message: "Ticket raised successfully", ticket: newTicket });
    } catch (error) {
        console.error("Error raising ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// this ticket would follow the auto assigning logic
//Admin/Support agent would assign ticket 
// previous route mein ticket has been raised and it is present in the database 
// now the admin/support agent would fetch this ticket ,
// then they would assign it based on these title description and category parameters ? 


// Now that the ticket has been created the admin or support agent would fectch the ticket 
router.get('/tickets',authMiddleware,async(req,res)=>{
    try{
        const companyId = req.user.companyId;
        const Ticket = await getTicketModel(companyId); // Get ticket model for the company 
        const openTickets= await Ticket.find({
            status:"Open",
            assignedTo:null
        })
        res.status(200).json({ tickets: openTickets });
    }catch(error){
        res.status(500).json({ message: "Error fetching open tickets" });
    }
})

// Now we have with us our open tickets , so now we have to assign these tickets as well 
// manual assignments 

router.put("/tickets/:ticketId/assign",authMiddleware,async(req,res)=>{
    try{
        const companyId = req.user.companyId; 
        const Ticket = await getTicketModel(companyId); // Get the ticket model for the company
        const {ticketId} = req.params;
        const{assignedTo} = req.body ;

        if (!assignedTo) {
            return res.status(400).json({ message: "AssignedTo field is required" });
        }
        // find the ticket 
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        // Assign the ticket
        ticket.assignedTo = assignedTo;
        ticket.status = "In Progress"; // Once assigned, the ticket moves to 'In Progress'
        await ticket.save();
        res.status(200).json({ message: "Ticket assigned successfully", ticket });
        
    } catch(error){
        res.status(500).json({ message: "Error assigning ticket" });
    }
})

/*
A ticket typically moves through these statuses:
	1.	Open → When a ticket is created.
	2.	In Progress → When an agent starts working on it.
	3.	Resolved → When a solution is provided but awaiting confirmation.
	4.	Closed → When the issue is confirmed as resolved.
*/

router.put("/tickets/:ticketId/status", authMiddleware, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        const companyId = req.user.companyId;
        const userId = req.user.userId; // Authenticated user making the request

        const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }

        const Ticket = await getTicketModel(companyId);
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Only assigned agent or admin can change the ticket status
        if (ticket.assignedTo.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update status" });
        }

        // Enforce status transitions
        const currentStatus = ticket.status;
        if (
            (currentStatus === "Open" && status !== "In Progress") ||
            (currentStatus === "In Progress" && !["Resolved", "Closed"].includes(status)) ||
            (currentStatus === "Resolved" && status !== "Closed") ||
            currentStatus === "Closed"
        ) {
            return res.status(400).json({ message: `Invalid transition from ${currentStatus} to ${status}` });
        }

        // Update status and timestamp
        ticket.status = status;
        ticket.updatedAt = new Date();
        await ticket.save();

        res.status(200).json({ message: "Ticket status updated successfully", ticket });
    } catch (error) {
        console.error("Error updating ticket status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// admins/ support agents can only update the ticket status 

router.patch('//tickets/:ticketId/status',authMiddleware,async(req,res)=>{
    const { ticketId } = req.params;
    const { status } = req.body;
    const { companyId, userId, role } = req.user; 
    // getting this from the authMiddleware
   
    try {
        const Ticket = await getTicketModel(companyId);
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Ensure only assigned agents or admins can update the status
        if (role !== "admin" && ticket.assignedTo !== userId) {
            return res.status(403).json({ message: "Not authorized to update this ticket" });
        }

        // Define allowed status transitions
        const validTransitions = {
            "Open": ["In Progress"],
            "In Progress": ["Resolved"],
            "Resolved": ["Closed"],
        };

        if (!validTransitions[ticket.status]?.includes(status)) {
            return res.status(400).json({ message: `Invalid status transition from ${ticket.status} to ${status}` });
        }

        // Update status & timestamp
        ticket.status = status;
        ticket.updatedAt = new Date();
        await ticket.save();

        return res.json({ message: "Ticket status updated successfully", ticket });
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// Manual SLA enforcement 

// getting tickets approaching sla expiry 
router.get('/tickets/approaching-sla', authMiddleware, async (req, res) => {
    try {
        const { companyId } = req.user; // Extract company ID from auth
        const Ticket = await getTicketModel(companyId);

        const now = new Date();
        const threshold = new Date();
        threshold.setHours(threshold.getHours() + 2); // SLA expires in the next 2 hours

        const tickets = await Ticket.find({
            status: { $in: ["Open", "In Progress"] },
            slaDueDate: { $lte: threshold, $gte: now }
        });

        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ message: "Error fetching SLA tickets", error });
    }
});

// Manaully marking tickets as SLA breached 
router.put('/tickets/:ticketId/sla-breached', authMiddleware, async (req, res) => {
    try {
        const { companyId } = req.user;
        const { ticketId } = req.params;
        const Ticket = await getTicketModel(companyId);

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (new Date() > ticket.slaDueDate) {
            ticket.status = "SLA Breached";
            await ticket.save();
            return res.json({ message: "Ticket marked as SLA breached", ticket });
        }

        res.json({ message: "SLA still valid", ticket });
    } catch (error) {
        res.status(500).json({ message: "Error updating SLA", error });
    }
});

// Closing a ticket and connecting a feedback 
router.put('/tickets/:ticketId/close', authMiddleware, async (req, res) => {
    try {
        const { companyId, userId } = req.user;
        const { ticketId } = req.params;
        const { rating, comments } = req.body;
        const Ticket = await getTicketModel(companyId);

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.status !== "Resolved") {
            return res.status(400).json({ message: "Ticket must be resolved before closing" });
        }

        ticket.status = "Closed";
        ticket.feedback = { rating, comments };
        await ticket.save();

        // Log the closure
        await addTicketLog(ticket, "Ticket Closed", userId, `Ticket closed with rating: ${rating}`);

        res.json({ message: "Ticket closed and feedback recorded", ticket });
    } catch (error) {
        res.status(500).json({ message: "Error closing ticket", error });
    }
});
    
module.exports = router ;
