const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

require('dotenv').config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI, {
})
  .then(() => {
    console.log('MongoDB connection established');
    require('./scripts/createInitialAdmin');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const recaptchaRoutes = require('./routes/verifyRecaptcha');
app.use('/api/recaptcha', recaptchaRoutes);

const authRoutes = require('./routes/verifyAuth');
app.use('/api/auth', authRoutes);

const registerRoutes = require('./routes/register');
app.use('/api/register', registerRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

const categoriesRoutes = require('./routes/categories');
app.use('/api/categories', categoriesRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const getUserInfoRoutes = require('./routes/getUserInfo');
app.use('/api/info', getUserInfoRoutes);

const photosRoutes = require('./routes/PhotoRoutes.js');
app.use('/api/photos', photosRoutes);

const projectsRoutes = require('./routes/ProjectRoutes.js');
app.use('/api/projects', projectsRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('listening', () => {
  cron.schedule('*/15 * * * *', () => { // every 15 min check the projects
    require('./cronJobs/projectCron.js');
  });
});

