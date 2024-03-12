import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
class SocketService {}

export default SocketService;
