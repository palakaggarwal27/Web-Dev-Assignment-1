"use client";
import {useSession} from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react"
import { Send, User, Plus, Home, Info, Settings } from "lucide-react"
import Navbar from "@/component/Header/Navbar"
import Sidebar from "@/component/Header/Sidebar"


export default function Page() { 
  const { data: session } = useSession();
  const router = useRouter();

   const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [credit, setCredit] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (session === null) {
      router.push('/signin');
    } else if (session !== undefined) {
      setIsLoading(false);
      // Update credit when session loads
      if (session?.user?.credit !== undefined) {
        setCredit(session.user.credit);
      }
    }
  }, [session, router]);

  useEffect(() => {
    const el = document.getElementById("chat-scroll")
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async () => {
    if (credit < 10) {
      setMessages((prev) => [...prev, { from: "bot", text: "Insufficient credits. Please top up." }])
      return
    }
    const userText = input.trim()
    if (!userText) return
    const nextMessages = [...messages, { from: "user", text: userText }]
    setMessages(nextMessages)
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Request failed")
      }
      const data = await res.json()
      const reply = data?.reply || ""
      setMessages((prev) => [...prev, { from: "bot", text: reply }])
      if (typeof data?.credit === "number") {
        setCredit(data.credit)
      }
      // Trigger sidebar refresh
      setRefreshTrigger(prev => prev + 1)
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: e.message === "Insufficient credits" ? "You have 0 credits left." : "Sorry, something went wrong. Please try again." },
      ])
    }
    setIsTyping(false)
  }

  const startNewChat = () => {
    setMessages([{ from: "bot", text: "New chat started. How can I help?" }])
    setInput("")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if(session){
    return (
      <>
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
      
      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <Sidebar 
        email={session?.user?.email} 
        refreshTrigger={refreshTrigger}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <Navbar 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        {/* Chat Space */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3 lg:space-y-4" id="chat-scroll">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex animate-fade-in-up ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[90%] sm:max-w-[85%] lg:max-w-md shadow-lg chat-bubble text-sm sm:text-base ${
                  msg.from === "user"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none"
                    : "bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-slide-in-right">
              <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[90%] sm:max-w-[85%] lg:max-w-md bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900 rounded-bl-none shadow-lg text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Input Box */}
        <footer className="border-t border-white/20 bg-white/80 backdrop-blur-sm p-2 sm:p-3 lg:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={startNewChat}
              className="px-2 sm:px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-gray-700 hover:bg-white/30 transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              title="New Chat"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <div className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
              credit < 10 
                ? "bg-red-100 text-red-700 border border-red-200" 
                : "bg-green-100 text-green-700 border border-green-200"
            }`}>
              💎 {credit}
            </div>
          </div>
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-500"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={credit < 10 || !input.trim()}
            className={`p-2 sm:p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-1 sm:gap-2 ${
              credit < 10 || !input.trim()
                ? "bg-gray-400 cursor-not-allowed" 
                : "btn-primary"
            }`}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </footer>
      </div>
    </div>
      </>
    )

  } else {
    return null; 
  }

}
