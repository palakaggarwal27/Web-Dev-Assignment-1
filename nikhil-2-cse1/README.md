# 🤖 AiChat - AI-Powered Chat Application

A modern, responsive AI chat application built with Next.js, featuring Google's Gemini AI integration, user authentication, and college verification system.

## ✨ Features

- **🤖 AI Chat**: Powered by Google's Gemini AI
- **🔐 Authentication**: Google & GitHub OAuth integration
- **💎 Credit System**: 10 credits per request with user management
- **📚 Chat History**: Persistent conversation storage
- **🎓 College Verification**: OTP-based student verification
- **📱 Responsive Design**: Modern UI with glassmorphism effects
- **⚡ Real-time**: Instant AI responses with typing indicators

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **Email**: Gmail SMTP / Twilio SendGrid
- **Deployment**: Vercel


2. **Environment Variables for Production**
   ```env
   MONGODB_URI=your-production-mongodb-uri
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```


## 📁 Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── profile/
│   │   ├── profileSetting/
│   │   ├── signin/
│   │   └── verify-college-id/
│   ├── api/
│   │   ├── auth/
│   │   ├── chat/
│   │   └── user/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── component/
│   ├── Footer/
│   ├── Header/
│   └── UserHistory/
├── features/
├── lib/
├── models/
├── providers/
└── public/
```

## 🔧 Configuration

### OAuth Setup

1. **Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **GitHub OAuth**
   - Go to GitHub Settings > Developer settings
   - Create OAuth App
   - Set Authorization callback URL

### Email Configuration

1. **Gmail SMTP**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use 16-character password (no spaces)

2. **Twilio SendGrid (Optional)**
   - Sign up for Twilio SendGrid
   - Get API key starting with "SG."
   - Add to environment variables


## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interactions
- Optimized for all screen sizes
- Progressive Web App ready

## 🔒 Security

- Secure authentication with NextAuth.js
- Environment variable protection
- CORS configuration
- Input validation and sanitization


