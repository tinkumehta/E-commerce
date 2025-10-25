import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import connectDB from './config/database.js'


import userRoutes from './routes/user.routes.js'

config();
connectDB();
const app = express();

// security middleware
app.use(helmet());
app.use(cors ({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials : true
}));

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 100 , // 15 minutes
    max : 100 // limity each Ip ot 100 requests per window ms
});

app.use(limiter);

// body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// routes
app.use("/", (req, res) => {
    res.status(201).json({message : "Server is running!"})
});

app.use("/api/auth", userRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
});

export default app;