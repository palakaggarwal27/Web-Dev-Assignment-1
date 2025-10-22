import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, userId } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), { status: 400 });
    }

    // Check if username exists **excluding current user**
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });

    return new Response(
      JSON.stringify({ available: !existingUser }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
