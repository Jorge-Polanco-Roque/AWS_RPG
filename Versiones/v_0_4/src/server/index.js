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
      character_name TEXT DEFAULT '',
      character_class TEXT DEFAULT 'architect',
      level INTEGER DEFAULT 1,
      experience INTEGER DEFAULT 0,
      total_score INTEGER DEFAULT 0,
      max_combo INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      levels_completed TEXT DEFAULT '[]',
      achievements TEXT DEFAULT '[]',
      special_abilities TEXT DEFAULT '{"fireball":{"unlocked":true,"level":1},"heal":{"unlocked":true,"level":1},"shield":{"unlocked":false,"level":0}}',
      inventory TEXT DEFAULT '[]',
      settings TEXT DEFAULT '{"sound":true,"music":true,"difficulty":"normal"}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_save DATETIME DEFAULT CURRENT_TIMESTAMP
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
      achievement_description TEXT NOT NULL,
      rarity TEXT DEFAULT 'common',
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_date DATE NOT NULL,
      challenge_type TEXT NOT NULL,
      challenge_data TEXT NOT NULL,
      reward_type TEXT NOT NULL,
      reward_data TEXT NOT NULL,
      active BOOLEAN DEFAULT true
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_daily_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      challenge_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT false,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (challenge_id) REFERENCES daily_challenges (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leaderboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      score INTEGER NOT NULL,
      additional_data TEXT DEFAULT '{}',
      season TEXT DEFAULT 'current',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

app.get('/api/game/question/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { category, difficulty } = req.query;
  
  let filteredQuestions = awsQuestionsExpanded;
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // If no questions found with filters, fall back to all questions
  if (filteredQuestions.length === 0) {
    filteredQuestions = awsQuestionsExpanded;
  }
  
  // Get random question
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const question = filteredQuestions[randomIndex];
  
  if (!question) {
    return res.status(500).json({ success: false, error: 'No questions available' });
  }
  
  // Don't send the correct answer to the client
  const { correct, explanation, ...questionData } = question;
  
  res.json({
    success: true,
    question: questionData,
    cosmicContext: question.cosmicHorrorContext || {}
  });
});

app.post('/api/game/answer', (req, res) => {
  const { sessionId, questionId, selectedAnswer, timeTaken } = req.body;
  
  // Find the question in expanded database
  const question = awsQuestionsExpanded.find(q => q.id === parseInt(questionId));
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  const isCorrect = selectedAnswer === question.correct;
  
  // Check if user is authenticated
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let userId = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cosmic_horror_secret');
      userId = decoded.userId;
    } catch (err) {
      // Invalid token, continue as guest
    }
  }
  
  // Only record progress for authenticated users
  if (userId) {
    db.run(
      'INSERT INTO user_progress (user_id, question_id, is_correct, time_taken) VALUES (?, ?, ?, ?)',
      [userId, questionId, isCorrect, timeTaken],
      function(err) {
        if (err) {
          logger.error('Answer recording error:', err);
        }
      }
    );
    
    // Update user stats
    const sanityChange = isCorrect ? 5 : -10;
    const shardsChange = isCorrect ? 1 : 0;
    
    db.run(
      'UPDATE users SET sanity_level = sanity_level + ?, knowledge_shards = knowledge_shards + ? WHERE id = ?',
      [sanityChange, shardsChange, userId],
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
  }
  
  res.json({
    success: true,
    correct: isCorrect,
    explanation: question.explanation,
    cosmicResponse: isCorrect 
      ? `Great! Your AWS knowledge grows stronger.`
      : `Not quite right. Keep learning!`
  });
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

// Enhanced Game Endpoints
app.post('/api/game/save-progress', authenticateToken, (req, res) => {
  const { 
    level, experience, totalScore, maxCombo, gamesPlayed, 
    totalQuestions, correctAnswers, levelsCompleted, achievements, 
    specialAbilities, inventory, settings 
  } = req.body;

  const saveData = {
    level: level || 1,
    experience: experience || 0,
    total_score: totalScore || 0,
    max_combo: maxCombo || 0,
    games_played: gamesPlayed || 0,
    total_questions: totalQuestions || 0,
    correct_answers: correctAnswers || 0,
    levels_completed: JSON.stringify(levelsCompleted || []),
    achievements: JSON.stringify(achievements || []),
    special_abilities: JSON.stringify(specialAbilities || {}),
    inventory: JSON.stringify(inventory || []),
    settings: JSON.stringify(settings || {}),
    last_save: new Date().toISOString()
  };

  const updateQuery = `
    UPDATE users SET 
      level = ?, experience = ?, total_score = ?, max_combo = ?,
      games_played = ?, total_questions = ?, correct_answers = ?,
      levels_completed = ?, achievements = ?, special_abilities = ?,
      inventory = ?, settings = ?, last_save = ?
    WHERE id = ?
  `;

  const values = [
    saveData.level, saveData.experience, saveData.total_score, saveData.max_combo,
    saveData.games_played, saveData.total_questions, saveData.correct_answers,
    saveData.levels_completed, saveData.achievements, saveData.special_abilities,
    saveData.inventory, saveData.settings, saveData.last_save, req.user.userId
  ];

  db.run(updateQuery, values, function(err) {
    if (err) {
      logger.error('Save progress error:', err);
      return res.status(500).json({ error: 'Failed to save progress' });
    }

    res.json({
      success: true,
      message: 'Progress saved successfully'
    });
  });
});

app.get('/api/game/load-progress', authenticateToken, (req, res) => {
  db.get(
    `SELECT level, experience, total_score, max_combo, games_played,
     total_questions, correct_answers, levels_completed, achievements,
     special_abilities, inventory, settings, last_save FROM users WHERE id = ?`,
    [req.user.userId],
    (err, user) => {
      if (err) {
        logger.error('Load progress error:', err);
        return res.status(500).json({ error: 'Failed to load progress' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      try {
        const progress = {
          level: user.level,
          experience: user.experience,
          totalScore: user.total_score,
          maxCombo: user.max_combo,
          gamesPlayed: user.games_played,
          totalQuestions: user.total_questions,
          correctAnswers: user.correct_answers,
          levelsCompleted: JSON.parse(user.levels_completed || '[]'),
          achievements: JSON.parse(user.achievements || '[]'),
          specialAbilities: JSON.parse(user.special_abilities || '{}'),
          inventory: JSON.parse(user.inventory || '[]'),
          settings: JSON.parse(user.settings || '{}'),
          lastSave: user.last_save
        };

        res.json({
          success: true,
          progress: progress
        });
      } catch (parseError) {
        logger.error('Parse progress error:', parseError);
        res.status(500).json({ error: 'Failed to parse saved data' });
      }
    }
  );
});

app.post('/api/game/unlock-achievement', authenticateToken, (req, res) => {
  const { type, name, description, rarity } = req.body;

  db.run(
    'INSERT INTO achievements (user_id, achievement_type, achievement_name, achievement_description, rarity) VALUES (?, ?, ?, ?, ?)',
    [req.user.userId, type, name, description, rarity || 'common'],
    function(err) {
      if (err) {
        logger.error('Achievement unlock error:', err);
        return res.status(500).json({ error: 'Failed to unlock achievement' });
      }

      res.json({
        success: true,
        achievementId: this.lastID
      });
    }
  );
});

app.get('/api/game/daily-challenges', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  db.all(
    'SELECT * FROM daily_challenges WHERE challenge_date = ? AND active = true',
    [today],
    (err, challenges) => {
      if (err) {
        logger.error('Daily challenges error:', err);
        return res.status(500).json({ error: 'Failed to get daily challenges' });
      }

      res.json({
        success: true,
        challenges: challenges
      });
    }
  );
});

app.get('/api/game/leaderboard/:category', (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  db.all(
    `SELECT u.username, l.score, l.additional_data, l.updated_at 
     FROM leaderboards l 
     JOIN users u ON l.user_id = u.id 
     WHERE l.category = ? AND l.season = 'current'
     ORDER BY l.score DESC LIMIT ?`,
    [category, limit],
    (err, results) => {
      if (err) {
        logger.error('Leaderboard error:', err);
        return res.status(500).json({ error: 'Failed to get leaderboard' });
      }

      res.json({
        success: true,
        leaderboard: results
      });
    }
  );
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