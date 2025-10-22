# Chat Application

A modern web-based chat application built with Node.js, Express, and MongoDB that supports both user-to-user messaging and AI-powered conversations using Google's Gemini API.

## Features

- 🔐 User authentication (register/login)
- 💬 Real-time user-to-user messaging
- 🤖 AI chat assistant powered by Google's Gemini API
- 📱 Responsive design
- ✨ Multiple chat sessions with AI
- 📨 Message read status tracking
- 🚨 Flash messages for user feedback

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS templates, CSS
- **Database**: MongoDB
- **Authentication**: Session-based with bcrypt
- **AI Integration**: Google Gemini API

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher) installed
- MongoDB Atlas account or local MongoDB instance
- Google Gemini API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_PASSWORD=your_mongodb_password
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

## Installation and Setup

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set your Gemini API key:
   ```powershell
   # Windows (PowerShell)
   $env:GEMINI_API_KEY = "your_key_here"
   ```

4. Start the server:
   ```bash
   node app.js
   ```

The application will be available at `http://localhost:4000`

## Project Structure

```
chat-app/
├── app.js              # Main application file
├── models/             # Database models
│   ├── aichat.js      # AI chat model
│   ├── message.js     # Message model
│   └── user.js        # User model
├── public/            
│   └── style.css      # Application styles
├── views/             # EJS templates
│   ├── ai.ejs         # AI chat interface
│   ├── chat.ejs      # User chat interface
│   ├── home.ejs      # Home page
│   ├── land.ejs      # Landing page
│   ├── login.ejs     # Login page
│   ├── register.ejs  # Registration page
│   ├── includes/     # Reusable components
│   └── layout/       # Page layouts
└── package.json       # Project dependencies
```

## Features Breakdown

### User Authentication
- Secure registration and login system
- Password hashing using bcrypt
- Session-based authentication

### Messaging System
- User-to-user private messaging
- Message read status tracking
- Contact list management
- Real-time message updates

### AI Chat Integration
- Integration with Google's Gemini API
- Multiple chat sessions support
- Session management and history
- Smart conversation context handling

Notes about AI Integration:
- The server requires Node.js v18+ for the global `fetch` API
- AI chat history is stored in MongoDB's `aichats` collection (keeps up to 20 items)
- The UI displays the last 5 chat interactions
- If you see "AI service error", check the logs and verify your API key and model endpoint

## Available Routes
- `/` - Landing page
- `/register` - User registration
- `/login` - User login
- `/home` - User dashboard
- `/chat` - User-to-user chat interface
- `/ai` - AI chat interface (requires login)

## Security Features

- Password hashing
- Session management
- HTTP-only cookies
- Input validation
- Environment variable protection
- Authentication middleware

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
