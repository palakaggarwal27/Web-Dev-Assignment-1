import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import UserHistory from "@/models/UserHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(){
  try{
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session?.user?.email){
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const [userDoc, userHistory] = await Promise.all([
      User.findOne({ email: session.user.email }).select("credit email"),
      UserHistory.findOne({ user: session.user.email })
    ]);
    if(!userDoc){
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(
      JSON.stringify({
        email: session.user.email,
        credit: userDoc.credit ?? 0,
        chatHistory: userHistory?.chatHistory ?? []
      }),
      { status: 200 }
    );
  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function POST(req){
  try{
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session?.user?.email){
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { userId } = await req.json();
    let email = session.user.email;

    if (userId) {
      const user = await User.findById(userId).select("email");
      if(!user){
        return new Response(JSON.stringify({error: "User not found"}),{status: 404});
      }
      if (String(user._id) !== String(session.user.id)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }
      email = user.email;
    }

    const [userDoc, userHistory] = await Promise.all([
      User.findOne({ email }).select("credit email"),
      UserHistory.findOne({ user: email })
    ]);

    if(!userDoc){
      return new Response(JSON.stringify({error: "User not found"}),{status: 404});
    }

    return new Response(
      JSON.stringify({
        email,
        credit: userDoc.credit ?? 0,
        chatHistory: userHistory?.chatHistory ?? []
      }),
      { status: 200 }
    );

  }catch(err){
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


