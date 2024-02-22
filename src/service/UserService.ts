import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { ICreateUser, IUpdateUser } from "../types/UserType";

const prisma = new PrismaClient();

@Service()
class UserService {
  async createUser({ username, password, email }: ICreateUser) {
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
      });

      if (!user) {
        return false;
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async getUsers() {
    try {
      const users = await prisma.user.findMany();

      return users;
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

      console.log(existingUser);

      if (existingUser) return false;

      const newData = { ...user };
      delete newData.id;
      console.log(newData);

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
