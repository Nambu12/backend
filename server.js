const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration - IMPORTANT: Replace with your email credentials
const transporter = nodemailer.createTransport({

    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: 'expo7590@gmail.com', // Your email
        pass: 'ljvb tcgk yasj bjrf'      // Your app password (not regular password)
    }
});

// Course PDF mapping - Store your PDFs in a 'pdfs' folder
const coursePDFs = {
    'Computer Science Engineering': 'pdfs/CSE_Course.pdf',
    'Mechanical Engineering': 'pdfs/Mechanical_Course.pdf',
    'Electrical Engineering': 'pdfs/Electrical_Course.pdf',
    'Civil Engineering': 'pdfs/Civil_Course.pdf',
    'Electronics and Communication': 'pdfs/ECE_Course.pdf',
    'Information Technology': 'pdfs/IT_Course.pdf',
    'Chemical Engineering': 'pdfs/Chemical_Course.pdf',
    'English Literature': 'pdfs/English_Course.pdf',
    'History': 'pdfs/History_Course.pdf',
    'Political Science': 'pdfs/Political_Science_Course.pdf',
    'Psychology': 'pdfs/Psychology_Course.pdf',
    'Sociology': 'pdfs/Sociology_Course.pdf',
    'Economics': 'pdfs/Economics_Course.pdf',
    'Fine Arts': 'pdfs/Fine_Arts_Course.pdf'
};

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, mobile, degree, specialization } = req.body;

    try {
        // Get PDF path for the specialization
        const pdfPath = coursePDFs[specialization];

        // Check if PDF exists
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            return res.status(400).json({ 
                success: false, 
                message: `PDF for ${specialization} not found. Please contact admin.` 
            });
        }

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: `Course Information - ${specialization}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">🎓 Registration Successful!</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    
                    <p>Thank you for registering for <strong>${specialization}</strong> under <strong>${degree}</strong>.</p>
                    
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Your Registration Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Mobile:</strong> ${mobile}</p>
                        <p><strong>Degree:</strong> ${degree}</p>
                        <p><strong>Specialization:</strong> ${specialization}</p>
                    </div>
                    
                    <p>Please find the attached course brochure PDF for detailed information about the curriculum, faculty, and career opportunities.</p>
                    
                    <p>If you have any questions, feel free to contact us.-> Ph:9361531764,Name:Vijay</p> 
                    
                    <p>Best regards,<br>
                    <strong>Admissions Team</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                </div>
            `,
            attachments: [
                {
                    filename: `${specialization.replace(/\s+/g, '_')}_Course_Details.pdf`,
                    path: pdfPath
                }
            ]
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent successfully to ${email} for ${specialization}`);

        res.json({
            success: true,
            message: 'Registration successful! Email sent with course PDF.'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending email. Please try again later.'
        });
    }
});

// Test endpoint
app.get('/', (req, res) => {
    res.send('Course Registration API is running! ✅');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured and ready!`);
});