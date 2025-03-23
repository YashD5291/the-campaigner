const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Set up Multer to handle file uploads
const upload = multer({
    dest: 'uploads/', // Destination folder for uploaded files
    limits: { fileSize: 50 * 1024 * 1024 }, // Optional: Set file size limit (50MB)
});

app.use(express.json());

// POST route for uploading file and sending email
app.post('/uploads', upload.single('resumeFile'), async (req, res) => {
    let { fromEmail, fromPassword, fromName, toEmail, subject, body } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        fromEmail = "juan.flores.engineer@gmail.com";
        fromPassword = "mmwf eaxn egpb yerb";
        fromName = "Juan Flores";
        // Create reusable transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like Outlook, SendGrid, etc.
            auth: {
                user: fromEmail,
                pass: fromPassword
            }
        });

        // Set up email data with file attachment
        const mailOptions = {
            from: `${fromName} <${fromEmail}>`,
            to: toEmail,
            subject: subject,
            text: body,
            attachments: [
                {
                    filename: req.file.originalname,
                    path: path.join(__dirname, req.file.path)  // Path to the uploaded file
                }
            ]
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Optionally, remove the file after sending the email
        // fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `Email sent successfully to ${toEmail}`,
            info
        });
    } catch (error) {
        console.log(error,"error");
        res.status(500).json({
            success: false,
            message: `Failed to send email: ${error.message}`
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
