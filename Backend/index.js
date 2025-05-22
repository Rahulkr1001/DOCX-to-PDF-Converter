const express = require("express");
const multer = require("multer");
const docxToPDF = require("docx-pdf");
const path = require("path");
const cors = require("cors")
const app = express();
const port = 3000;

app.use(cors());

// File storage setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads"); // File upload ka folder set kiya gaya hai
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // File ka original naam use hoga
    },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), (req, res) => {
    try {
      // Agar file upload nahi hui hai toh error message
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded", 
            });
        }

        // Output file ka path define kiya gaya hai
        let outputPath = path.join(
            __dirname, // Current directory ka path
            "files",   // 'files' folder mein save hoga
            `${req.file.originalname}.pdf` // File ka PDF format mein output
        );

        // DOCX se PDF conversion function ko call kiya gaya hai
        docxToPDF(req.file.path, outputPath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf", // Agar conversion mein error aaye
                });
            }

            // File download karne ke liye response bheja gaya hai
            res.download(outputPath, () => {
                console.log("File downloaded successfully");
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error", // Agar koi unexpected error aaye
        });
    }
});

app.listen(port, () => {
  // Server ka status console par dikhaya gaya
    console.log(`Server is listening on port ${port}`); 
});

