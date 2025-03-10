const io = require("socket.io-client"); 

const socket = io("http://localhost:3000");

// Solicitar datos de la parada "1139"
socket.emit("solicitarParada", "1139");

socket.on("actualizarTiempos", (data) => console.log("🚍 Datos recibidos:", data));
