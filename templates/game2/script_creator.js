const messagesDiv = document.getElementById("messages");
const chatInput = document.getElementById("chat-input");
const statusP = document.getElementById("status");

let secret = null;

function confirmNumber() {
  const num = parseInt(document.getElementById("secret-number").value);
  if (num >= -1000 && num <= 1000) {
	secret = num;
	statusP.textContent = `Вы загадали: ${secret}`;
  } else {
	alert("Введите число в диапазоне -1000 до 1000");
  }
}

// --- ЧАТ С SOCKET.IO ---
const socket = io();
const sessionId = "{{ session['session_id'] }}";
const room = "{{ room }}";

// После socket = io();
socket.emit("join_game_room", {
  room: room,
  session_id: sessionId
});

function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  // Отправляем на сервер
  socket.emit("chat_message", {
	room: room,
	session_id: sessionId,
	message: msg
  });

  addMessage("Вы", msg);
  chatInput.value = "";
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

socket.on("chat_message", function (data) {
  if (data.sender !== "Вы") {
	addMessage(data.sender, data.message);
  }
});

chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});