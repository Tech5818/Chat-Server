import { Server, Socket } from "socket.io";
import http from "http";
import RoomService from "../service/RoomService";
import UserService from "../service/UserService";
import MessageService from "../service/MessageService";

export const setSocketServer = (
  server: http.Server,
  roomService: RoomService,
  userService: UserService,
  messageService: MessageService
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

    socket.on("join", async (data: { roomId: string }) => {
      socket.join(data.roomId);
      console.log("join room", data.roomId);
    });

    socket.on(
      "message",
      async (data: { email: string; roomId: number; message: string }) => {
        try {
          const message = await messageService.createMessage(
            data.message,
            data.roomId,
            data.email
          );
          socket.to(data.roomId.toString()).emit("message", message);
          console.log("emitdata", data);
        } catch (error) {
          socket.emit("error", error);
          console.error(error);
        }
      }
    );
  });

  const room = io.of("/room");

  room.on("connection", async (socket: Socket) => {});
};
