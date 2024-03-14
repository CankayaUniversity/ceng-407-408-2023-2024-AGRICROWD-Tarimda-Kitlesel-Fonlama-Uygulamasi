const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI);

const recaptchaRoutes = require('./routes/verifyRecaptcha');
app.use('/api/recaptcha', recaptchaRoutes);

const authRoutes = require('./routes/verifyAuth');
app.use('/api/auth', authRoutes);

const registerRoutes = require('./routes/register');
app.use('/api/register', registerRoutes);

const loginRoutes = require('./routes/login');
app.use('/api/login', loginRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
