require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { obtenerTiemposAutobuses } = require("./src/services/busService");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Guardar la relación de sockets con sus paradas
const clientesParadas = {};

io.on("connection", (socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    // Manejar solicitud de una parada específica
    socket.on("solicitarParada", async (paradaId) => {
        console.log(`🚌 Cliente ${socket.id} solicitó parada ${paradaId}`);

        // Guardar la parada solicitada por este cliente
        clientesParadas[socket.id] = paradaId;

        // Obtener y enviar los datos iniciales
        const data = await obtenerTiemposAutobuses(paradaId);
        socket.emit("actualizarTiempos", data);
    });

    // Enviar actualizaciones periódicas
    const interval = setInterval(async () => {
        for (const [socketId, paradaId] of Object.entries(clientesParadas)) {
            const data = await obtenerTiemposAutobuses(paradaId);
            io.to(socketId).emit("actualizarTiempos", data);
        }
    }, 10000);

    // Manejar desconexión del cliente
    socket.on("disconnect", () => {
        console.log(`🔴 Cliente desconectado: ${socket.id}`);
        delete clientesParadas[socket.id]; // Eliminar de la lista
        clearInterval(interval);
    });
});

app.get("/", (req, res) => {
    res.send("🚍 Bienvenido a VitoriaBusLive API!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
