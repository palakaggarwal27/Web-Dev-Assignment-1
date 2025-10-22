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
    
    const formData = await request.formData();
    const collegeEmail = formData.get("collegeEmail");
    const collegeName = formData.get("collegeName");
    const studentId = formData.get("studentId");
    const verificationDoc = formData.get("verificationDoc");

    if (!collegeEmail || !collegeName || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Update user with college verification data
    user.collegeEmail = collegeEmail;
    user.collegeName = collegeName;
    user.studentId = studentId;
    user.collegeId = false; // Will be set to true after manual verification
    user.verificationStatus = "pending";
    user.verificationSubmittedAt = new Date();

    // Handle file upload if provided
    if (verificationDoc && verificationDoc.size > 0) {
      // In a real app, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
      // For now, we'll just store the filename
      user.verificationDocName = verificationDoc.name;
      user.verificationDocSize = verificationDoc.size;
    }

    await user.save();

    // TODO: Send email notification to admin for manual verification
    // TODO: Send confirmation email to user

    return NextResponse.json({ 
      message: "Verification request submitted successfully",
      status: "pending"
    });

  } catch (error) {
    console.error("College verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      collegeId: user.collegeId,
      collegeEmail: user.collegeEmail,
      collegeName: user.collegeName,
      verificationStatus: user.verificationStatus,
      verificationSubmittedAt: user.verificationSubmittedAt
    });

  } catch (error) {
    console.error("Get verification status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
