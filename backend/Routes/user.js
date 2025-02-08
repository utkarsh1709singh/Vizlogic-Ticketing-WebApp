const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const zod = require('zod');
const{authMiddleware} = require('../middleware');
const{JWT_SECRET} = require("../config");
const{getUserModel}= require("../db/user_model")

const signupSchema = zod.object({
    username: zod.string().min(1).max(255),
    email: zod.string().email().min(1).max(255),
    password: zod.string().min(6).max(255),
    role: zod.string().min(1).max(255),
});

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
});

// Signup Route 
router.post("/signup",async(req,res)=>{
    const body = req.body;
    const{success,data}= signupSchema.safeParse(body);
    if(!success){
        return res.status(400).json({message:"Invalid input data"});
    }
    const{username,email,password,role}=data;

    // passing the company id in headers 
    const companyId= req.headers["company-id"];
    if(!companyId){
        return res.status(400).json({message:"Company id is required"})
    };

    try{
        const User = await getUserModel(companyId);
        // check for existing user 
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
})

// Signin Route 

router.post("/signin", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success, data } = signinSchema.safeParse(body);
    
    if (!success) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    const { email, password } = data;
    const companyId = req.headers["company-id"];

    if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
    }

    try {
        const User = await getUserModel(companyId);
        
        // Check for user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role, companyId },
            JWT_SECRET,
            { expiresIn: "12h" }
        );

        // Send response with token and user details
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
});

