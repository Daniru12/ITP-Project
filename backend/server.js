import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Token validation middleware
// app.use((req, res, next) => {
//   const token = req.headers.authorization?.replace(/^Bearer\s/, '');
//   if (!token) {
//     return res.status(401).send({ message: 'Token is required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'Invalid Token' });
//     }
//     req.user = decoded;  // Add the decoded token to the request object
//     next();
//   });
// });

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error('Mongo URL not set in .env file');
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
