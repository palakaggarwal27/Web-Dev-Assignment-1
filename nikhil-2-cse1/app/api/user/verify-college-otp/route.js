import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const { collegeEmail, otp } = await request.json();

    if (!collegeEmail || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if OTP matches and is not expired
    if (!user.otpCode || user.otpCode !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Verify the college ID
    user.collegeId = true;
    user.verificationStatus = "approved";
    user.verifiedAt = new Date();
    
    // Clear OTP data
    user.otpCode = undefined;
    user.otpExpiry = undefined;

    // Give bonus credits for verification
    user.credit = (user.credit || 0) + 50;

    await user.save();

    return NextResponse.json({ 
      message: "College ID verified successfully!",
      credit: user.credit
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
