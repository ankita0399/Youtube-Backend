import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
)); //can set origin optionScuss to restrict the origin of the client

app.use(express.json({ limit: '16kb' })); //parse incoming request with JSON payloads and limit the size of the payload to 16kb
app.use(express.urlencoded({ extended: true, limit: '16kb' })); //parse incoming request with urlencoded payloads and extended option set to true to allow for rich objects and arrays to be encoded into the URL-encoded format
app.use(express.static('public')); //serve static files from the public directory using express.static middleware
app.use(cookieParser()); //parse Cookie header and populate req.cookies with an object keyed by the cookie names

// cookies 2 way access hoti hai client se server aur server se client
// client se server cookie ko access karne ke liye cookie-parser use hota hai

//routes
import userRouter from './routes/user.routes.js';
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// routes declaration
app.use('/api/v1/users', userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app };