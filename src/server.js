import  express  from "express";
import bodyParser from "body-parser";
import viewEngine from"./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from './config/connectDB'
import cors from 'cors'
import db from "./models/index";
import chatboxServices from './Services/chatboxServices'
const axios = require('axios');
// const express = require("express");
const passport = require("passport");
const session = require("express-session");
// const cookieSession = require("cookie-session");
require("./auth");

require('dotenv').config();


let app = express();
// Cho phép tất cả các nguồn
// const PORT = 3000;
app.use(cors({ credentials: true, origin: true}));
// app.use(cors({ credentials: true, origin: true }));

app.use(express.json());

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });



//config app
app.use(bodyParser.json({limit:"500mb"}));
app.use(bodyParser.urlencoded({ extended: true}))

viewEngine(app);
initWebRoutes(app);

connectDB();


let port = process.env.PORT || 6969;
//nếu chưa gán port ở file env thì gán bằng 6969

// app.listen(port, ()=>{
//     //callback
//     console.log("Backend Nodejs is running on the port : "+port )
// })



const fetch = require("node-fetch"); // hoặc dùng axios

// const app = express();
app.use(cors());
app.use(bodyParser.json());


//Chat box

import http from 'http';
import { Server } from 'socket.io';


const allowedOrigins = [
  'http://localhost:3000',
  'https://schedule-frontend-five.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);

  socket.on('join_room', (chatRoomId) => {
    socket.join(`room_${chatRoomId}`);
    console.log(`Client joined room_${chatRoomId}`);
  });

  socket.on('send_message', (data) => {
    console.log('send_message: ',data)
    console.log('Message received:', data.message);
    io.to(`room_${data.chat_room_id}`).emit('new_message', data);
  });



  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected');
  });
});


app.use(cors({
  origin: '*',
}));
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// app.listen(5000, () => console.log("Server đang chạy tại http://localhost:5000"));
