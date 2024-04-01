import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
class RoomService {
  async createRoom(name: string, description: string, email: string) {
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
          description,
        },
      });

      const userRoom = await prisma.userRoom.create({
        data: {
          userEmail: user.email,
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
        include: {
          users: true,
          messages: true,
        },
      });

      if (!room) return null;

      return room;
    } catch (error) {
      console.error(error);
    }
  }

  async getRooms() {
    try {
      const rooms = await prisma.room.findMany({
        include: {
          users: true,
        },
      });

      return rooms;
    } catch (error) {
      console.error(error);
    }
  }

  async userIsIn(roomId: number, email: string) {
    try {
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: true,
        },
      });

      let IsIn = false;
      room?.users.map((value) => {
        if (value.userEmail === email) {
          IsIn = true;
        }
      });
      if (room && room.users.length > 0) {
        return { isIn: IsIn, length: room.users.length };
      }
      return { isIn: IsIn, length: room!.users.length };
    } catch (error) {
      console.error(error);
    }
  }

  async getUserRooms(email: string) {
    try {
      const user = await prisma.user.findUnique({
        include: {
          rooms: true,
        },
        where: {
          email,
        },
      })!;

      return user;
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
      const userRoom = await prisma.userRoom.create({
        data: {
          roomId: room.id,
          userEmail: user.email,
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
          userEmail: user.email,
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
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
      });

      if (!room) return null;

      await prisma.userRoom.deleteMany({
        where: {
          roomId: room.id,
        },
      });
      await prisma.message.deleteMany({
        where: {
          roomId: room.id,
        },
      });
      const deleteRoom = await prisma.room.delete({
        where: {
          id: room.id,
        },
      });

      return deleteRoom;
    } catch (error) {
      console.error(error);
    }
  }
}

export default RoomService;
