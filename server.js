const express = require('express');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

require('./config/passport');

const app = express();

// Безпека
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ОБОВ'ЯЗКОВО
app.use(cookieParser());

// Сесії
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// CSRF через cookies
const csrfProtection = csrf({ cookie: true });

// Роут для токена
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', csrfProtection, require('./routes/api'));

app.listen(3000, () => console.log('NEW VERSION WORKS'));