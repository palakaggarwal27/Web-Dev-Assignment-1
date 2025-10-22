"use client";
import { Brain, MessageSquare, Sparkles, Users, Shield, Zap, ArrowRight, Github, Mail, Instagram, Linkedin, Briefcase } from "lucide-react";
import Link from "next/link";
import Navbar from "@/component/Header/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
        <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 sm:mb-6">
              About AiChat
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the future of AI conversation. Our intelligent chat assistant 
              powered by Google's Gemini AI is designed to assist, learn, and grow with 
              every conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Powered by Gemini AI</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Advanced AI language models that understand context, provide accurate answers, 
              and engage in natural, human-like conversations in real-time.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Seamless Experience</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Intuitive chat interface with persistent history, instant responses, 
              and personalized sessions that remember your conversation context.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Built for Everyone</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Perfect for students, developers, and curious learners. Get help with 
              brainstorming, coding, learning new skills, and much more.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Always Evolving</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Continuously updated with new AI features, enhanced understanding, 
              and improved user experience with each release.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leveraging the latest web technologies and AI advancements to deliver 
            an exceptional user experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Next.js 14</h3>
            </div>
            <p className="text-gray-600">
              Modern React framework with server-side rendering, API routes, 
              and optimized performance for the best user experience.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Secure Authentication</h3>
            </div>
            <p className="text-gray-600">
              NextAuth.js integration with Google and GitHub OAuth for 
              secure, seamless user authentication.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Google Gemini AI</h3>
            </div>
            <p className="text-gray-600">
              Powered by Google's advanced Gemini AI for intelligent, 
              context-aware conversations and responses.
            </p>
          </div>
        </div>
      </section>
      {/* Creator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About the Creator
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hi, I'm <span className="text-blue-600 font-semibold">Nikhil</span> — an AI-powered full-stack MERN developer 
              specializing in <span className="font-semibold text-gray-900">Next.js</span>. I'm passionate about building 
              intelligent and interactive web applications that combine the power of modern frameworks 
              with real-world artificial intelligence integration.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <a 
              href="https://github.com/nikhil-dex" 
              className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">GitHub</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <a 
              href="https://www.instagram.com/krishna.jsx?igsh=MTV3MnMzcHE2NGpybw%3D%3D&utm_source=qr" 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">Instagram</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <a 
              href="mailto:info.noyau@gmail.com" 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="https://nikhil-dex.github.io/nikhil-desk" 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/nikhil-b203a2242?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Linkedin className="w-5 h-5" />
              <span className="font-medium">LinkedIn</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-gray-600 mb-2">
              Made by{" "}
              <span className="text-blue-600 font-semibold">Nikhil</span>
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AiChat. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
