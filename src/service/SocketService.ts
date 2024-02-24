import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
class SocketService {
  async getUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async createRoom(name: string, email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) return null;
      const room = await prisma.room.create({
        data: {
          name,
        },
      });

      const userRoom = await prisma.userRoom.create({
        data: {
          userId: user.id,
          roomId: room.id,
        },
      });

      const data = {
        user,
        room,
        userRoom,
      };

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getRoom(id: number) {
    try {
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
      });

      if (!room) return null;

      return room;
    } catch (error) {
      console.error(error);
    }
  }

  async joinRoom(roomId: number, email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) return null;

      const joinRoom = await prisma.room.create({
        data: {
          id: room.id,
          name: room.name,
        },
      });

      const userRoom = await prisma.userRoom.create({
        data: {
          userId: user.id,
          roomId: joinRoom.id,
        },
      });

      return userRoom;
    } catch (error) {
      console.error(error);
    }
  }
  async leaveRoom(roomId: number, email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) return null;

      const userRoom = await prisma.userRoom.findFirst({
        where: {
          userId: user.id,
          roomId: room.id,
        },
      });
      const leaveUserRoom = await prisma.userRoom.delete({
        where: {
          id: userRoom?.id,
        },
      });

      return leaveUserRoom;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteRoom(id: number) {
    try {
      const room = await prisma.room.delete({
        where: {
          id,
        },
      });

      const userRooms = await prisma.userRoom.deleteMany({
        where: {
          roomId: room.id,
        },
      });

      return userRooms;
    } catch (error) {
      console.error(error);
    }
  }
}

export default SocketService;