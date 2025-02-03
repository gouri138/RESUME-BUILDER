const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json()); // For parsing application/json

// Replace with your MongoDB Atlas URI
// const mongoose = require("mongoose");

// Replace with your MongoDB Atlas URI
const mongoURI = "mongodb+srv://gouri:gouri123@cluster0.1l86c.mongodb.net/";

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas", err));


// Define Resume Schema
const resumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    skills: [String],
    education: [{
        school: String,
        degree: String,
        year: String,
    }],
    workExperience: [{
        company: String,
        position: String,
        startDate: String,
        endDate: String,
    }],
    createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);

// GET endpoint to fetch resumes
app.get("/resumes", async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resumes", error });
    }
});

// POST endpoint to create a new resume
app.post("/resumes", async (req, res) => {
    console.log("request coming");
    const { name, email, phone, skills, education, workExperience } = req.body;

    const newResume = new Resume({
        name,
        email,
        phone,
        skills,
        education,
        workExperience,
    });

    try {
        await newResume.save();
        res.status(201).json({ message: "Resume created successfully", newResume });
    } catch (error) {
        res.status(500).json({ message: "Error creating resume", error });
    }
});

// PUT endpoint to update an existing resume
app.put("/resumes/:id", async (req, res) => {
    const resumeId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedResume = await Resume.findByIdAndUpdate(resumeId, updatedData, { new: true });
        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({ message: "Resume updated successfully", updatedResume });
    } catch (error) {
        res.status(500).json({ message: "Error updating resume", error });
    }
});

// DELETE endpoint to delete a resume
app.delete("/resumes/:id", async (req, res) => {
    const resumeId = req.params.id;

    try {
        const deletedResume = await Resume.findByIdAndDelete(resumeId);
        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting resume", error });
    }
});



// //SERVERLESS FUCNTIONSS
// // GET function to retrieve all resumes
// export async function getResumes(req, res) {
//     await connectToDB(); // Ensure DB connection is established
  
//     try {
//       const resumes = await Resume.find();
//       return res.status(200).json(resumes);
//     } catch (error) {
//       return res.status(500).json({ message: "Error fetching resumes", error });
//     }
//   }
  
//   // POST function to create a new resume
//   export async function postResume(req, res) {
//     await connectToDB(); // Ensure DB connection is established
  
//     const { name, email, phone, skills, education, workExperience } = req.body;
  
//     const newResume = new Resume({
//       name,
//       email,
//       phone,
//       skills,
//       education,
//       workExperience,
//     });
  
//     try {
//       await newResume.save();
//       return res.status(201).json({ message: "Resume created successfully", newResume });
//     } catch (error) {
//       return res.status(500).json({ message: "Error creating resume", error });
//     }
//   }
  
//   // PUT function to update a resume
//   export async function putResume(req, res) {
//     await connectToDB(); // Ensure DB connection is established
  
//     const resumeId = req.query.id;
//     const updatedData = req.body;
  
//     try {
//       const updatedResume = await Resume.findByIdAndUpdate(resumeId, updatedData, { new: true });
//       if (!updatedResume) {
//         return res.status(404).json({ message: "Resume not found" });
//       }
//       return res.status(200).json({ message: "Resume updated successfully", updatedResume });
//     } catch (error) {
//       return res.status(500).json({ message: "Error updating resume", error });
//     }
//   }
  
//   // DELETE function to delete a resume
//   export async function deleteResume(req, res) {
//     await connectToDB(); // Ensure DB connection is established
  
//     const resumeId = req.query.id;
  
//     try {
//       const deletedResume = await Resume.findByIdAndDelete(resumeId);
//       if (!deletedResume) {
//         return res.status(404).json({ message: "Resume not found" });
//       }
//       return res.status(200).json({ message: "Resume deleted successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: "Error deleting resume", error });
//     }
//   }












// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



