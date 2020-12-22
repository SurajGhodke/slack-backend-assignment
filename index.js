require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const path = require("path");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

  //middlewares
//app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("public"));

//message sending part

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

io.sockets.on("connection", function(socket) {
    socket.on("username", function(username) {
        socket.username = username;

        io.emit(
            "is_online",
            "🔵 <i>" + socket.username + " join the chat..</i>"
        );
    });

    socket.on("disconnect", function(username) {
        io.emit(
            "is_online",
            "🔴 <i>" + socket.username + " left the chat..</i>"
        );
    });

    socket.on("chat_message", function(message) {
        io.emit(
            "chat_message",
            "<strong>" + socket.username + "</strong>: " + message
        );
    });
});

//my routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);

//port
const port = process.env.PORT || 3000;


http.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});