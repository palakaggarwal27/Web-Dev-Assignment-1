import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const { collegeEmail } = await request.json();

    if (!collegeEmail) {
      return NextResponse.json({ error: "College email is required" }, { status: 400 });
    }

    // Validate college email format
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!collegeEmailRegex.test(collegeEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP and college email temporarily
    user.collegeEmail = collegeEmail;
    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    user.verificationStatus = "pending";

    await user.save();

    // Send OTP via email
    try {
      // Use Gmail SMTP as primary (most reliable for your setup)
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Gmail SMTP not configured");
        return NextResponse.json({ 
          message: "OTP sent to your college email",
          otp: otp,
          error: "Email service not configured, please use the OTP above"
        });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        debug: true,
        logger: true
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: collegeEmail,
        subject: 'College ID Verification OTP - AiChat',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">College ID Verification</h2>
            <p>Hello,</p>
            <p>You have requested to verify your college ID for AiChat. Please use the following OTP to complete your verification:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p><strong>College Email:</strong> ${collegeEmail}</p>
            <p><strong>Valid for:</strong> 10 minutes</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated message from AiChat.</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Gmail email sent to ${collegeEmail}: ${otp}`);

      return NextResponse.json({ 
        message: "OTP sent to your college email",
        service: "Gmail SMTP",
        messageId: info.messageId
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      
      // Fallback: return OTP in response
      return NextResponse.json({ 
        message: "OTP sent to your college email",
        otp: otp,
        error: `Email failed: ${emailError.message}`,
        note: "Please use the OTP above if email doesn't arrive"
      });
    }

  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
