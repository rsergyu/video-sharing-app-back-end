import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comments.js'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();


const connect = () => {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then( ()=>{
            console.log("Connected to DB!");
        })
        .catch((err) => {
            console.log("error");
            throw err;
        })
}

app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials: true, exposedHeaders: ["set-cookie"], origin: ['http://localhost:3000', 'https://video-sharing-app-front-end.vercel.app']}));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/videos', videoRoutes);


app.use((err, req, res, next )=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        succes:false,
        status,
        message
    })
})

app.listen(8800, () =>{
    connect();
    console.log("Connected to server!");
})