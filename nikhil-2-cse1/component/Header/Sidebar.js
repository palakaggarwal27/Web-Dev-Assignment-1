"use client";
import { useEffect, useState } from "react"
import { Send, User, Plus, Home, Info, Settings, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from 'next/image'

const Sidebar = ({email, refreshTrigger, isCollapsed, onToggle}) => {
    const { data: session } = useSession();
    const [historyData,setHistoryData] = useState(null);
    
    const fetchHistoryData = async() => {
        if(!session?.user?.id) return;
        try{
            const res = await fetch("/api/user/user-history", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ userId: session.user.id }),
           });
           const data = await res.json();
           setHistoryData(data);
        }catch(err){
            console.error(err);
        }
    };
    
    useEffect(()=>{
        fetchHistoryData();
    },[session?.user?.id, refreshTrigger]);
  return (
      <aside className={`flex flex-col justify-between bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isCollapsed ? 'hidden md:flex' : 'fixed md:relative z-[60] md:z-auto h-full left-0 top-0 md:left-auto md:top-auto'
      }`}>
        <div>
          {/* Header with Toggle and New Chat */}
          <div className="p-4 border-b border-white/20 space-y-3">
            {/* Collapse Toggle Button */}
            <button 
              onClick={onToggle}
              className={`flex items-center justify-center w-full bg-white/50 backdrop-blur-sm border border-white/30 text-gray-700 rounded-lg px-3 py-2 hover:bg-white/70 transition-all duration-300 transform hover:scale-105 ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <span className="text-sm font-medium">Collapse</span>
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>

            {/* New Chat Button */}
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg px-3 py-2 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4" /> 
              {!isCollapsed && <span>New Chat</span>}
            </button>
          </div>

          {/* Chat History */}
          <div className={`overflow-y-auto h-[calc(100vh-180px)] p-2 sm:p-4 space-y-2 transition-all duration-300 ${
            isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            {historyData?.chatHistory && historyData.chatHistory.length > 0 ? (
              historyData.chatHistory.map((msg, index) => (
                <div key={index} className="text-xs sm:text-sm text-gray-700 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg p-2 sm:p-3 hover:bg-white/70 transition-all duration-300">
                  <p className="font-semibold capitalize text-blue-600 text-xs sm:text-sm">{msg.role}</p>
                  <p className="truncate text-xs sm:text-sm">{msg.text}</p>
                  <small className="text-gray-400 text-xs">{new Date(msg.at).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">No chat history yet.</p>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20 flex justify-center">
          {session?.user ? (
            <a 
              href="/profile" 
              className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="relative">
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="User Image" 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white/20 object-cover" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    unoptimized={true}
                  />
                ) : null}
                <div 
                  className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 ${session.user?.image ? 'hidden' : 'flex'}`}
                  style={{ display: session.user?.image ? 'none' : 'flex' }}
                >
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              {!isCollapsed && (
                <span className="truncate">{session.user?.name || "Profile"}</span>
              )}
            </a>
          ) : (
            <a 
              href="/api/auth/signin" 
              className={`text-gray-600 hover:text-blue-600 transition-all duration-300 ${
                isCollapsed ? 'text-center' : ''
              }`}
            >
              {isCollapsed ? 'Sign In' : 'Sign In'}
            </a>
          )}
        </div>
      </aside>
  )
}

export default Sidebar