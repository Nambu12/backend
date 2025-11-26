const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

// CORS for Vercel
app.use(cors({
    origin: "https://backend-x16q.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Static PDFs folder
const pdfFolder = path.join(__dirname, 'pdfs');

// All course PDFs
const coursePDFs = {
    'Computer Science Engineering': `${pdfFolder}/CSE_Course.pdf`,
    'Mechanical Engineering': `${pdfFolder}/Mechanical_Course.pdf`,
    'Electrical Engineering': `${pdfFolder}/Electrical_Course.pdf`,
    'Civil Engineering': `${pdfFolder}/Civil_Course.pdf`,
    'Electronics and Communication': `${pdfFolder}/ECE_Course.pdf`,
    'Information Technology': `${pdfFolder}/IT_Course.pdf`,
    'Chemical Engineering': `${pdfFolder}/Chemical_Course.pdf`,
    'English Literature': `${pdfFolder}/English_Course.pdf`,
    'History': `${pdfFolder}/History_Course.pdf`,
    'Political Science': `${pdfFolder}/Political_Science_Course.pdf`,
    'Psychology': `${pdfFolder}/Psychology_Course.pdf`,
    'Sociology': `${pdfFolder}/Sociology_Course.pdf`,
    'Economics': `${pdfFolder}/Economics_Course.pdf`,
    'Fine Arts': `${pdfFolder}/Fine_Arts_Course.pdf`
};

// Registration API
app.post('/register', async (req, res) => {
    const { name, email, mobile, degree, specialization } = req.body;

    try {
        const pdfPath = coursePDFs[specialization];

        if (!pdfPath || !fs.existsSync(pdfPath)) {
            return res.status(404).json({
                success: false,
                message: `PDF for ${specialization} not found.`
            });
        }

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Course Information - ${specialization}`,
            html: `
                <h2>🎓 Registration Successful!</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>Your course details PDF is attached.</p>
                <p>Thank You!<br>Phone: 9361531764<br>Name: Vijay</p>
            `,
            attachments: [{
                filename: `${specialization.replace(/\s+/g, '_')}.pdf`,
                path: pdfPath
            }]
        });

        res.json({ success: true, message: 'Email sent successfully!' });

    } catch (err) {
        console.error("Mail Error:", err);
        res.status(500).json({ success: false, message: 'Email send failed.' });
    }
});

// Test Route
app.get('/', (req, res) => {
    res.send("API Running ✔");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

