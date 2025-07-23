require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ENV variables
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer

const upload = multer(); 

// MongoDB Model
const Program = mongoose.model("Program", new mongoose.Schema({
  date: String,
  time: String,
  title: String,
  description: String,
  imageUrl: String
}));

// 🔐 Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// 🔐 Example protected
app.get("/api/admin-data", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    res.json({ message: "Welcome to admin panel!", secretData: "🎉" });
  });
});

app.post("/api/programs", upload.single("image"), async (req, res) => {
  try {
    const { date, time, title, description = "" } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: "festival_programs",
          resource_type: "image"
        },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Cloudinary upload failed" });
          }
          
          const program = new Program({
            date,
            time,
            title,
            description,
            imageUrl: result.secure_url
          });
          await program.save();
          res.json({ program });
        }
      );

      result.end(req.file.buffer);
    } else {
       
      const program = new Program({
        date,
        time,
        title,
        description,
        imageUrl: null
      });
      await program.save();
      res.json({ program });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.delete("/api/programs/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    
    if (program.imageUrl) {
      
      const parts = program.imageUrl.split('/');
      const fileName = parts[parts.length - 1];      
      const publicId = `festival_programs/${fileName.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    }

    await Program.findByIdAndDelete(req.params.id);

    res.json({ message: "✅ Program deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get("/api/programs", async (req, res) => {
  try {
    const programs = await Program.find().sort({ date: 1, time: 1 });
    res.json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});


const frontendPath = path.join(__dirname, 'frontend', 'dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Backend & frontend running on port ${PORT}`));