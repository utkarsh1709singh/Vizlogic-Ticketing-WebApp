const mongoose = require("mongoose");

const connections = {

}; // Cache for database connections

const getDatabaseConnection = async (companyId) => {
    if (connections[companyId]) {
        return connections[companyId];
    }

    const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/ticketingdb";

    const connectDB = async () => {
        try {
            await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("MongoDB connected successfully");
        } catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }

    connections[companyId] = connections;
    return connections;
    }
};

module.exports = { getDatabaseConnection };