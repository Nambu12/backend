const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// ****** IMPORTANT (Render PORT FIX) ******
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// *********** Email Transporter ***********
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'expo7590@gmail.com', 
        pass: 'ljvb tcgk yasj bjrf'  // Gmail App Password only
    }
});

// *********** PDF Folder Correct Path ***********
const pdfFolder = path.join(__dirname, 'pdfs');

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

// *********** Registration Endpoint ***********
app.post('/register', async (req, res) => {
    const { name, email, mobile, degree, specialization } = req.body;

    try {
        const pdfPath = coursePDFs[specialization];

        if (!pdfPath || !fs.existsSync(pdfPath)) {
            return res.status(400).json({
                success: false,
                message: `PDF for ${specialization} not found on server.`
            });
        }

        const mailOptions = {
            from: 'expo7590@gmail.com',
            to: email,
            subject: `Course Information - ${specialization}`,
            html: `
                <h2>🎓 Registration Successful!</h2>
                <p>Hello <b>${name}</b>,</p>
                <p>Your course details PDF is attached below.</p>
                <p>Thank you.<br>Ph: 9361531764<br>Name: Vijay</p>
            `,
            attachments: [
                {
                    filename: `${specialization.replace(/\s+/g, '_')}.pdf`,
                    path: pdfPath
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent → ${email}`);

        res.json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ success: false, message: 'Email failed to send.' });
    }
});

// *********** Test Endpoint ***********
app.get('/', (req, res) => {
    res.send("Course Registration API is Running ✔");
});

// *********** Start Server ***********
app.listen(PORT, () => {
    console.log(`Server Live on PORT ${PORT}`);
});
