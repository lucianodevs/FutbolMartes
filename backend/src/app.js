const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);


const allowedOrigins = [
  'http://localhost:5173',
  'https://zingy-sunflower-69fad8.netlify.app'
];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


module.exports = app;
