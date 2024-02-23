import { Server, Socket } from "socket.io";
import http from "http";
import SocketService from "../service/SocketService";

export const setSocketServer = (
  server: http.Server,
  service: SocketService
) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", async (socket: Socket) => {
    console.log(`connect ID: ${socket.id}`);
    socket.on("join", (id: string) => {
      socket.data.id = id;
    });

    socket.on("message", (data: { id: string; message: string }) => {
      const { id, message } = data;
      const sockets = Array.from(io.sockets.sockets.values()).filter(
        (socket: Socket) => socket.data.id === id
      );
      sockets.forEach((socket) => {
        socket.emit(message);
      });
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  });
};
