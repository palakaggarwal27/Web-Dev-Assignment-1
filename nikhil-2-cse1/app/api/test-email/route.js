import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export async function GET() {
  try {
    // Check Gmail SMTP (primary for your setup)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        error: "Gmail SMTP not configured",
        EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Not set",
        EMAIL_PASS: process.env.EMAIL_PASS ? "Set" : "Not set",
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "Set" : "Not set",
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "Set" : "Not set"
      });
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true
    });

    // Test Gmail configuration
    await transporter.verify();
    
    return NextResponse.json({ 
      success: true,
      message: "Gmail SMTP configuration is valid",
      service: "Gmail SMTP",
      from: process.env.EMAIL_USER
    });

  } catch (error) {
    console.error("Email test failed:", error);
    return NextResponse.json({ 
      error: "Email configuration failed",
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        message: error.message
      }
    });
  }
}
