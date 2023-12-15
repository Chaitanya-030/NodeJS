const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoutes)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected successfully");
}).catch((err) => {
    console.log(err.message);
})

const server = app.listen(process.env.PORT, () => {
    console.log('Listening...', process.env.PORT);
})