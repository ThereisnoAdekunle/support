const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from src/

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('Transporter verification error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { from, to, subject, text } = req.body;
        console.log('Received email request:', { from, to, subject });

        // Send email
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text
        });

        console.log('Email sent successfully:', info);
        res.json({ success: true, message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Detailed error sending email:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

// Handle all other HTML routes
app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', req.path));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('\n=== Server Started ===');
        console.log(`🌐 Website URL: http://localhost:${PORT}`);
        console.log(`📧 Email sending ready`);
        console.log('=====================\n');
    });
}

// Export the Express API
module.exports = app; 