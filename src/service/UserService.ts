import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { IUser, IUpdateUser } from "../types/UserType";

const prisma = new PrismaClient();

@Service()
class UserService {
  async createUser({ username, password, email }: IUser) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return false;
      }

      return await prisma.user.create({
        data: {
          username,
          password,
          email,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          rooms: true,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async getUsers() {
    try {
      const users = await prisma.user.findMany({ include: { rooms: true } });

      return users;
    } catch (error) {
      console.error(error);
    }
  }

  async getInRooms(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          rooms: true,
        },
      });

      if (!user) return null;

      const userInRooms = user.rooms;

      return userInRooms;
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(email: string, editData: IUpdateUser) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      const existingUser = await prisma.user.findUnique({
        where: {
          email: editData.email,
        },
      });

      if (existingUser) return false;

      const newData = { ...user };
      delete newData.id;

      for (const key in editData) {
        newData[key as keyof Partial<IUpdateUser>] =
          editData[key as keyof Partial<IUpdateUser>];
      }

      const updateUser = await prisma.user.update({
        where: {
          email,
        },
        data: newData,
      });

      return updateUser;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(email: string) {
    try {
      const deleteUser = await prisma.user.delete({
        where: {
          email,
        },
      });

      if (!deleteUser) {
        return false;
      }

      return deleteUser;
    } catch (error) {
      console.error(error);
    }
  }
}

export default UserService;
