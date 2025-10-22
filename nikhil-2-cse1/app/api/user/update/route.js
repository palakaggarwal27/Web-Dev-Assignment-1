// pages/api/user/update.js
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req) {
  try {
    await dbConnect();
    const { userId, username, name, contact } = await req.json();
    if (!userId) return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, contact },
      { new: true } // ✅ return the updated document
    );

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
