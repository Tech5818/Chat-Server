import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
class MessageService {
  async createMessage(message: string, roomId: number, email: string) {
    try {
      const sender = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      const newMessage = await prisma.message.create({
        data: {
          content: message,
          roomId,
          senderEmail: sender!.email,
        },
      });

      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  async getRecentMessage(roomId: number) {
    try {
      const message = await prisma.message.findFirst({
        where: {
          roomId,
        },
      });

      if (!message) return false;

      return message;
    } catch (error) {
      throw error;
    }
  }

  async getAllMessage(roomId: number) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          roomId,
        },
      });

      if (!messages) return false;

      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageService;
