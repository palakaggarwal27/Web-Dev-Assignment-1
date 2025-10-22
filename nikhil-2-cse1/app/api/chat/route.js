import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import UserHistory from "@/models/UserHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if ((user.credit ?? 0) < 10) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 🚩 FIX HERE: Use the current stable alias, gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const userTurn = { role: "user", parts: [{ text: message }] };
    const chatHistory = Array.isArray(history) ? history : [];

    const result = await model.generateContent({
      contents: [...chatHistory, userTurn],
    });

    const text = result?.response?.text?.() || "";
    // deduct credits atomically
    user.credit = (user.credit ?? 0) - 10;
    await user.save();

    // persist chat history (best-effort; don't fail request on history error)
    try {
      const now = new Date();
      await UserHistory.findOneAndUpdate(
        { user: session.user.email },
        {
          $push: {
            chatHistory: {
              $each: [
                { role: "user", text: message, at: now },
                { role: "bot", text, at: now },
              ],
            },
          },
        },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
    return NextResponse.json({ reply: text, credit: user.credit });
  } catch (err) {
    console.error("/api/chat error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}