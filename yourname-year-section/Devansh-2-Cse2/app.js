if(process.env.NODE_ENV != "production"){ // this will check if the environment is not production, then it will load the .env file production is when we have deployed the application and we don't want to expose our environment variables to everyone so we dont use them in production phase
    require('dotenv').config() // this will load the environment variables from the .env file into process.env
}
const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

const app = express();
const port = 4000;

// Express configuration
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());

// Expose flash messages and user to all views
app.use((req, res, next) => {
    // grab first message or null
    const successMsg = (req.flash('success') || [])[0] || null;
    const errorMsg = (req.flash('error') || [])[0] || null;
    res.locals.success = successMsg;
    res.locals.error = errorMsg;
    res.locals.user = req.session.user || null;
    next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
mongoose.connect(process.env.Mongo_URL)
    .then(() => {
        console.log("DATABASE CONNECTED!");
    })
    .catch(err => {
        console.log("OH NO, MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

const User = require('./models/user');
const Message = require('./models/message');
const AiChat = require('./models/aichat');
// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'Please login first');
        res.redirect('/login');
    }
};

// Error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

// Routes
app.get('/', (req, res) => {
    res.render('land', { user: req.session.user });
});

app.get('/login', (req, res) => {
    res.render('login', { messages: req.flash(), user: req.session.user });
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        
        req.session.user = user;
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    res.render('register', { messages: req.flash(), user: req.session.user });
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            req.flash('error', 'Username or email already exists');
            return res.redirect('/register');
        }
        
        const user = new User({ username, email, password });
        await user.save();
        
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred during registration');
        res.redirect('/register');
    }
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/chat', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const selectedUser = req.query.user || null;
        
        // Build the query based on selected user
        let messageQuery = {};
        if (selectedUser) {
            messageQuery = {
                $or: [
                    { sender: userId, receiver: selectedUser },
                    { sender: selectedUser, receiver: userId }
                ]
            };
        } else {
            messageQuery = {
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            };
        }

        // Fetch messages with the query
        const messages = await Message.find(messageQuery)
            .populate('sender receiver')
            .sort({ timestamp: 1 });

        // Mark messages as read where current user is the receiver
        await Message.updateMany(
            { receiver: userId, isRead: false, ...(selectedUser ? { sender: selectedUser } : {}) },
            { isRead: true }
        );

        // Fetch contacts (all users except self)
        const contacts = await User.find({ _id: { $ne: userId } });

        res.render('chat', {
            user: req.session.user,
            messages,
            contacts,
            selectedUser: req.query.user || ''
        });
    } catch (error) {
        console.error(error);
        res.render('chat', {
            user: req.session.user,
            messages: [],
            contacts: [],
            error: 'Failed to load messages.'
        });
    }
});

// Send message route
app.post('/chat/send', isAuthenticated, async (req, res) => {
    try {
        const { receiver, content } = req.body;
        const message = new Message({
            sender: req.session.user._id,
            receiver,
            content,
            isRead: false
        });
        await message.save();
        req.flash('success', 'Message sent successfully');
        res.redirect(`/chat?user=${receiver}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to send message');
        res.redirect('/chat');
    }
});

app.get('/bot', isAuthenticated, (req, res) => {
    // redirect /bot to the AI assistant page
    res.redirect('/ai');
});

// AI chat page
app.get('/ai', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;
        let record = await AiChat.findOne({ user: userId });
        
        // Create new chat record if none exists
        if (!record) {
            record = new AiChat({ 
                user: userId,
                sessions: [{
                    title: 'New Chat',
                    messages: []
                }]
            });
            record.activeSession = record.sessions[0]._id;
            await record.save();
        }

        // Get active session or first session
        const activeSession = record.sessions.id(record.activeSession) || record.sessions[0];
        if (!record.activeSession) {
            record.activeSession = activeSession._id;
            await record.save();
        }

        res.render('ai', { 
            user: req.session.user,
            history: activeSession.messages,
            sessions: record.sessions,
            activeSessionId: activeSession._id
        });
    } catch (err) {
        console.error(err);
        res.render('ai', { 
            user: req.session.user, 
            history: [], 
            sessions: [],
            error: 'Failed to load AI chat.'
        });
    }
});

// Create new chat session
app.post('/ai/new', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;
        let record = await AiChat.findOne({ user: userId });
        
        if (!record) {
            record = new AiChat({ user: userId, sessions: [] });
        }
        
        const newSession = {
            title: 'New Chat',
            messages: []
        };
        record.sessions.push(newSession);
        record.activeSession = record.sessions[record.sessions.length - 1]._id;
        await record.save();
        
        res.redirect('/ai');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to create new chat');
        res.redirect('/ai');
    }
});

// Switch active session
app.get('/ai/session/:sessionId', isAuthenticated, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const record = await AiChat.findOne({ 
            user: req.session.user._id,
            'sessions._id': sessionId
        });
        
        if (!record) {
            req.flash('error', 'Chat session not found');
            return res.redirect('/ai');
        }
        
        record.activeSession = sessionId;
        await record.save();
        res.redirect('/ai');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to switch chat session');
        res.redirect('/ai');
    }
});

// POST route to chat with Gemini (server-side)
app.post('/ai/chat', isAuthenticated, async (req, res) => {
    const userId = req.session.user._id;
    const prompt = req.body.prompt || '';
    if (!prompt.trim()) {
        req.flash('error', 'Please enter a message');
        return res.redirect('/ai');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        req.flash('error', 'GEMINI_API_KEY not set in environment');
        return res.redirect('/ai');
    }

    try {
        // Get or create user's chat record
        let record = await AiChat.findOne({ user: userId });
        if (!record) {
            record = new AiChat({ 
                user: userId,
                sessions: [{
                    title: 'New Chat',
                    messages: []
                }]
            });
            record.activeSession = record.sessions[0]._id;
        }

        // Get active session
        const session = record.sessions.id(record.activeSession);
        if (!session) {
            req.flash('error', 'Chat session not found');
            return res.redirect('/ai');
        }

        // Update session title if it's first message
        if (session.messages.length === 0) {
            session.title = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
        }

        // Save user's message
        session.messages.push({ role: 'user', content: prompt });
        session.lastMessage = new Date();

        // Call Gemini API
        const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const payload = {
            contents: {
                role: "user",
                parts: [{ text: prompt }]
            },
            safetySettings: [{
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(endpoint + '?key=' + encodeURIComponent(apiKey), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const txt = await response.text();
            console.error('Gemini error:', txt);
            req.flash('error', 'AI service error: ' + txt);
            return res.redirect('/ai');
        }

        const data = await response.json();
        let aiText = '';

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            aiText = data.candidates[0].content.parts[0].text;
        } else if (data && data.text) {
            aiText = data.text;
        } else {
            console.error('Unexpected Gemini response:', JSON.stringify(data));
            aiText = 'Sorry, I encountered an error processing your request.';
        }

        // Save AI response
        session.messages.push({ role: 'ai', content: aiText });
        session.lastMessage = new Date();
        await record.save();

        res.redirect('/ai');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to contact AI service');
        res.redirect('/ai');
    }
});

