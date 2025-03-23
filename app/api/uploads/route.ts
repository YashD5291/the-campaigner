import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get("resumeFile") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Get other form fields
    const fromEmail = process.env.EMAIL_USER || "chintanthakkar.work@gmail.com";
    const fromPassword = process.env.EMAIL_PASSWORD || "flen fetj ofsf txph";
    const fromName = process.env.EMAIL_SENDER_NAME || "Juan Flores";
    const toEmail = formData.get("toEmail") as string;
    const toName = (formData.get("toName") as string) || "";
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

    if (!toEmail) {
      return NextResponse.json(
        { success: false, message: "Recipient email is required" },
        { status: 400 }
      );
    }

    // Create a temporary directory to store the file
    const tempDir = path.join(os.tmpdir(), "uploads");
    await fs.mkdir(tempDir, { recursive: true });

    // Generate a unique filename
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(tempDir, fileName);

    // Write the file to the temp directory
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: fromEmail,
        pass: fromPassword,
      },
    });

    // Generate a unique tracking ID for this email
    const trackingId = uuidv4();
    
    // Create the tracking pixel URL
    // Use absolute URL with the correct protocol (http/https)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const trackingPixelUrl = `${baseUrl}/api/pixel-tracking?id=${trackingId}`;

    // Personalize greeting if toName is provided
    let personalizedBody = body;
    if (toName) {
      // For HTML content, add personalized greeting in HTML format
      if (body.includes('<')) {
        // It's likely HTML, so wrap the greeting in HTML
        personalizedBody = `<p>Hello ${toName},</p>${body}`;
      } else {
        // Plain text
        personalizedBody = `Hello ${toName},\n\n${body}`;
      }
    }

    // Check if the body contains HTML
    let isHtml = body.includes('<');

    // Add tracking pixel to HTML emails
    if (isHtml) {
      // Add the tracking pixel at the end of the email body
      personalizedBody = `${personalizedBody}<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`;
    } else {
      // For plain text emails, we can't add a tracking pixel directly
      // Convert to HTML if it's not already HTML
      personalizedBody = `<div>${personalizedBody.replace(/\n/g, '<br/>')}</div><img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />`;
      // Force HTML mode
      isHtml = true;
    }

    // Set up email data with file attachment
    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: subject,
      ...(isHtml 
        ? { html: personalizedBody } 
        : { text: personalizedBody }),
      attachments: [
        {
          filename: file.name,
          path: filePath,
        },
      ],
      headers: {
        'X-Tracking-ID': trackingId, // Add tracking ID to email headers
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Store initial tracking information
    // In a real application, you'd store this in a database
    // This is simplified for demonstration purposes
    const trackingData = {
      emailId: trackingId,
      recipientEmail: toEmail,
      recipientName: toName,
      subject,
      sentAt: new Date(),
      status: 'sent',
    };

    // Clean up: remove the temporary file
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Failed to clean up temporary file:", cleanupError);
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${toEmail}`,
      tracking: {
        emailId: trackingId,
      },
      info,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send email: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
}
