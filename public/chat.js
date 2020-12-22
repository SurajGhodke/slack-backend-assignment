const socket = io.connect("http://localhost:3000");
const formEl = document.getElementById("chatForm");
const textInputEl = document.getElementById("txt");
const messagesEl = document.getElementById("messages");

formEl.addEventListener("submit", e => {
    e.preventDefault();
    socket.emit("chat_message", textInputEl.value);
    textInputEl.value = "";
    return false;
});

// append the chat text message
socket.on("chat_message", function(msg) {
    let child = document.createElement("li");
    child.innerHTML = msg;
    messagesEl.appendChild(child);
});

// append text if someone is online
socket.on("is_online", function(username) {
    let child = document.createElement("li");
    child.innerHTML = username;
    messagesEl.appendChild(child);
});

// ask username
const username = prompt("Please tell me your name");
socket.emit("username", username);