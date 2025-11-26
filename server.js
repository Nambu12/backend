const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Render PORT
const PORT = process.env.PORT || 3000;

// CORRECT CORS (Your Frontend URL)
app.use(cors({
    origin: "https://form1-bice.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// EMAIL TRANSPORTER (Uses correct ENV names)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// ***** Correct PDF folder absolute path *****
const pdfFolder = path.join(__dirname, 'pdfs');

// ***** Correct Course–PDF Mapping *****
const coursePDFs = {
    "Computer Science Engineering": path.join(pdfFolder, "CSE_Course.pdf"),
    "Mechanical Engineering": path.join(pdfFolder, "Mechanical_Course.pdf"),
    "Electrical Engineering": path.join(pdfFolder, "Electrical_Course.pdf"),
    "Civil Engineering": path.join(pdfFolder, "Civil_Course.pdf"),
    "Electronics and Communication": path.join(pdfFolder, "ECE_Course.pdf"),
    "Information Technology": path.join(pdfFolder, "IT_Course.pdf"),
    "Chemical Engineering": path.join(pdfFolder, "Chemical_Course.pdf"),

    "English Literature": path.join(pdfFolder, "English_Course.pdf"),
    "History": path.join(pdfFolder, "History_Course.pdf"),
    "Political Science": path.join(pdfFolder, "Political_Science_Course.pdf"),
    "Psychology": path.join(pdfFolder, "Psychology_Course.pdf"),
    "Sociology": path.join(pdfFolder, "Sociology_Course.pdf"),
    "Economics": path.join(pdfFolder, "Economics_Course.pdf"),
    "Fine Arts": path.join(pdfFolder, "Fine_Arts_Course.pdf"),
};

// *********** Registration API ***********
app.post('/register', async (req, res) => {
    const { name, email, specialization } = req.body;

    try {
        const pdfPath = coursePDFs[specialization];

        // PDF missing check
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            console.log("PDF NOT FOUND:", pdfPath);
            return res.status(404).json({
                success: false,
                message: `PDF for ${specialization} not found on server.`
            });
        }

        // SEND EMAIL
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Course Information - ${specialization}`,
            html: `
                <h2>🎓 Registration Successful!</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>Your course information PDF is attached below.</p>
                <p>Thank You!<br>Phone: 9361531764<br>Name: Vijay</p>
            `,
            attachments: [
                {
                    filename: `${specialization.replace(/\s+/g, '_')}.pdf`,
                    path: pdfPath
                }
            ]
        });

        return res.json({ success: true, message: "Email sent successfully!" });

    } catch (err) {
        console.error("MAIL ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Email send failed. Server error."
        });
    }
});

// TEST ROUTE
app.get('/', (req, res) => {
    res.send("Course Registration API is Running ✔");
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
