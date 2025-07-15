const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { awsQuestions, questionsByCategory, cosmicEntities } = require('./data/questions');
const { awsQuestionsExpanded, getRandomQuestion, getQuestionsByDifficulty } = require('./data/questions_expanded');

const app = express();
const PORT = process.env.PORT || 3030;

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});

// Database initialization
const db = new sqlite3.Database('./cosmic_codex.db');

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      sanity_level INTEGER DEFAULT 100,
      knowledge_shards INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_id TEXT UNIQUE NOT NULL,
      questions_answered INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      current_domain TEXT,
      sanity_level INTEGER DEFAULT 100,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_taken INTEGER,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_type TEXT NOT NULL,
      achievement_name TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/build')));

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'cosmic_horror_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.constraint === 'UNIQUE') {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          logger.error('Registration error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        const token = jwt.sign(
          { userId: this.lastID, username },
          process.env.JWT_SECRET || 'cosmic_horror_secret',
          { expiresIn: '24h' }
        );
        
        res.json({
          success: true,
          token,
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username],
      async (err, user) => {
        if (err) {
          logger.error('Login error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }
        
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
        
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET || 'cosmic_horror_secret',
          { expiresIn: '24h' }
        );
        
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            sanityLevel: user.sanity_level,
            knowledgeShards: user.knowledge_shards,
            currentLevel: user.current_level
          }
        });
      }
    );
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Game routes
app.post('/api/game/start-session', authenticateToken, (req, res) => {
  const sessionId = uuidv4();
  const { domain } = req.body;
  
  db.run(
    'INSERT INTO game_sessions (user_id, session_id, current_domain) VALUES (?, ?, ?)',
    [req.user.userId, sessionId, domain],
    function(err) {
      if (err) {
        logger.error('Session creation error:', err);
        return res.status(500).json({ error: 'Failed to start session' });
      }
      
      res.json({
        success: true,
        sessionId,
        message: 'The ritual begins... May your sanity endure the cosmic knowledge.'
      });
    }
  );
});

app.get('/api/game/question/:sessionId', authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const { category, difficulty } = req.query;
  
  let filteredQuestions = awsQuestionsExpanded;
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Get random question
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const question = filteredQuestions[randomIndex];
  
  // Don't send the correct answer to the client
  const { correct, explanation, ...questionData } = question;
  
  res.json({
    success: true,
    question: questionData,
    cosmicContext: question.cosmicHorrorContext
  });
});

app.post('/api/game/answer', authenticateToken, (req, res) => {
  const { sessionId, questionId, selectedAnswer, timeTaken } = req.body;
  
  // Find the question
  const question = awsQuestions.find(q => q.id === parseInt(questionId));
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  const isCorrect = selectedAnswer === question.correct;
  
  // Record the answer
  db.run(
    'INSERT INTO user_progress (user_id, question_id, is_correct, time_taken) VALUES (?, ?, ?, ?)',
    [req.user.userId, questionId, isCorrect, timeTaken],
    function(err) {
      if (err) {
        logger.error('Answer recording error:', err);
        return res.status(500).json({ error: 'Failed to record answer' });
      }
      
      // Update user stats
      const sanityChange = isCorrect ? 5 : -10;
      const shardsChange = isCorrect ? 1 : 0;
      
      db.run(
        'UPDATE users SET sanity_level = sanity_level + ?, knowledge_shards = knowledge_shards + ? WHERE id = ?',
        [sanityChange, shardsChange, req.user.userId],
        (err) => {
          if (err) {
            logger.error('User stats update error:', err);
          }
        }
      );
      
      // Update session stats
      db.run(
        'UPDATE game_sessions SET questions_answered = questions_answered + 1, correct_answers = correct_answers + ? WHERE session_id = ?',
        [isCorrect ? 1 : 0, sessionId]
      );
      
      res.json({
        success: true,
        correct: isCorrect,
        explanation: question.explanation,
        sanityChange,
        shardsChange,
        cosmicResponse: isCorrect 
          ? `${question.cosmicHorrorContext.entityName} approves... Your understanding grows stronger.`
          : `${question.cosmicHorrorContext.entityName} writhes in displeasure... Your sanity weakens.`
      });
    }
  );
});

app.get('/api/game/stats', authenticateToken, (req, res) => {
  db.get(
    'SELECT sanity_level, knowledge_shards, current_level FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        logger.error('Stats retrieval error:', err);
        return res.status(500).json({ error: 'Failed to retrieve stats' });
      }
      
      db.all(
        'SELECT COUNT(*) as total, SUM(is_correct) as correct FROM user_progress WHERE user_id = ?',
        [req.user.userId],
        (err, progress) => {
          if (err) {
            logger.error('Progress retrieval error:', err);
            return res.status(500).json({ error: 'Failed to retrieve progress' });
          }
          
          const stats = progress[0];
          const accuracy = stats.total > 0 ? (stats.correct / stats.total * 100).toFixed(1) : 0;
          
          res.json({
            success: true,
            stats: {
              sanityLevel: user.sanity_level,
              knowledgeShards: user.knowledge_shards,
              currentLevel: user.current_level,
              totalQuestions: stats.total,
              correctAnswers: stats.correct,
              accuracy: accuracy
            }
          });
        }
      );
    }
  );
});

app.get('/api/game/leaderboard', (req, res) => {
  db.all(
    'SELECT username, knowledge_shards, sanity_level, current_level FROM users ORDER BY knowledge_shards DESC, sanity_level DESC LIMIT 10',
    (err, users) => {
      if (err) {
        logger.error('Leaderboard retrieval error:', err);
        return res.status(500).json({ error: 'Failed to retrieve leaderboard' });
      }
      
      res.json({
        success: true,
        leaderboard: users.map((user, index) => ({
          rank: index + 1,
          username: user.username,
          knowledgeShards: user.knowledge_shards,
          sanityLevel: user.sanity_level,
          level: user.current_level
        }))
      });
    }
  );
});

app.get('/api/game/cosmic-entities', (req, res) => {
  res.json({
    success: true,
    entities: cosmicEntities
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong in the cosmic void...' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Cosmic Codex server awakens on port ${PORT}`);
  console.log(`🌌 The Architect's Codex server is running on port ${PORT}`);
  console.log(`🔮 The cosmic horror AWS study experience awaits...`);
});

module.exports = app;