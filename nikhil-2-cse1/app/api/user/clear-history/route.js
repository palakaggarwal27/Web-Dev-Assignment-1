import { dbConnect } from "@/lib/mongodb";
import UserHistory from "@/models/UserHistory";


export async function POST(req){
    try{
    await dbConnect();
    const {email} = await req.json();
    const userChat = await UserHistory.findOne({user: email});
    if(!userChat){
        return new Response(JSON.stringify({error: "User chat history not found"}),{status: 404});
    }
    await UserHistory.updateOne(
        {user:email},
    {$set: {chatHistory: []}}
);
    return new Response(JSON.stringify({message: "Chat history cleared successfully"}), { status: 200 });
   

    }catch(err){
          console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}