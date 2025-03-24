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
    const fromEmail = "juan.flores.engineer@gmail.com";
    const fromPassword = "mmwf eaxn egpb yerb";
    const fromName = "Juan Flores";
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
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Clean up: remove the temporary file
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Failed to clean up temporary file:", cleanupError);
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${toEmail}`,
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
