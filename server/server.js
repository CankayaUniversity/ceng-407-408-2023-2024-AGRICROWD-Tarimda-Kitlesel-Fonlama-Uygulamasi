const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerOptions');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const allowedOrigins = ['https://agricrowd-1709931956899.oa.r.appspot.com','http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }

  next();
});


mongoose.connect(process.env.MONGODB_URI, {
})
  .then(() => {
    console.log('MongoDB connection established');
    require('./scripts/createInitialAdmin');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const recaptchaRoutes = require('./routes/verifyRecaptcha');
app.use('/api/recaptcha', recaptchaRoutes);

const authRoutes = require('./routes/verifyAuth');
app.use('/api/auth', authRoutes);

const registerRoutes = require('./routes/register');
app.use('/api/register', registerRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

const categoriesRoutes = require('./routes/CategoryRoutes');
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

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const projectCron = require('./cronJobs/projectCron.js');
server.on('listening', () => {
  cron.schedule('*/5 * * * *', () => { // every 15 min check the projects
    projectCron();
  });
});

