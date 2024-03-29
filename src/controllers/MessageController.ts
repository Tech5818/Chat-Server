import { Get, JsonController, QueryParam, Res } from "routing-controllers";
import { Service } from "typedi";
import MessageService from "../service/MessageService";
import { Response } from "express";

@JsonController("/message")
@Service()
class MessageController {
  constructor(private messageService: MessageService) {}

  @Get("/getAll")
  async getAllMessage(@QueryParam("id") id: string, @Res() res: Response) {
    try {
      const messages = await this.messageService.getAllMessage(parseInt(id));

      return res.status(200).json({ data: messages });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  @Get("/getRecentMessage")
  async getRecentMessage(@QueryParam("id") id: number, @Res() res: Response) {
    try {
      const message = await this.messageService.getRecentMessage(id);

      return res.status(200).json({ data: message });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
export default MessageController;
