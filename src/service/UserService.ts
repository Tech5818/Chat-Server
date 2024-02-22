import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
class UserService {
  async createUser(username: string, password: string, email: string) {
    try {
      const existingUser = await prisma.user.findMany({
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
}

export default UserService;
