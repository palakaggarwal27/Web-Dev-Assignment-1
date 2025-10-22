import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";


export async function POST(req){
    try{
    await dbConnect();
    const {userId} = await req.json();
    if(!userId){
        return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }
    const user = await User.findById(userId).select("-__v -chatHistory");

    if(!user){
        return new Response(JSON.stringify({error: "User not found"}),{status: 404});
    }
    console.log(user);
    return new Response(JSON.stringify(user), { status: 200 });

    }catch(err){
          console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}