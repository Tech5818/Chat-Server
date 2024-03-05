import { Server, Socket } from "socket.io";
import http from "http";
import RoomService from "../service/RoomService";
import UserService from "../service/UserService";

export const setSocketServer = (
  server: http.Server,
  roomService: RoomService,
  userService: UserService
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

    socket.on("join", async (data: { email: string }) => {
      const user = await userService.getUser(data.email);

      const userInRooms = await userService.getInRooms(user?.email!);

      const room = userInRooms?.map((value) => value.roomId);
      room?.map((id) => {
        socket.join(JSON.stringify(id));
      });
      console.log(user, userInRooms, data.email, room);
    });

    socket.on(
      "message",
      (data: { email: string; roomId: number; message: string }) => {
        socket.to(JSON.stringify(data.roomId)).emit("message", data.message);
        console.log("emitdata", data);
      }
    );
  });

  const room = io.of("/room");

  room.on("connection", async (socket: Socket) => {});
};
