import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Patch,
  Post,
  Put,
  QueryParam,
  QueryParams,
  Res,
} from "routing-controllers";
import { Service } from "typedi";
import RoomService from "../service/RoomService";
import { Response } from "express";

@JsonController("/room")
@Service()
class RoomController {
  constructor(private roomService: RoomService) {}

  @Post("/create")
  @HttpCode(201)
  async createRoom(
    @Body() body: { name: string; description: string; email: string },
    @Res() res: Response
  ) {
    try {
      const room = await this.roomService.createRoom(
        body.name,
        body.description,
        body.email
      );

      if (!room)
        return res
          .status(404)
          .json({ error: "방의 이름 또는 유저의 이메일이 잘못되었습니다." });

      return res.status(201).json({ data: room });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/get")
  @HttpCode(200)
  async getRoom(@QueryParam("id") id: number, @Res() res: Response) {
    try {
      const room = await this.roomService.getRoom(id);

      if (!room)
        return res
          .status(404)
          .json({ error: "해당 id를 가지는 방은 존재하지 않습니다." });

      return res.status(200).json({ data: room });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/getAll")
  @HttpCode(200)
  async getRooms(@Res() res: Response) {
    try {
      const rooms = await this.roomService.getRooms()!;

      return res.status(200).json({ data: rooms });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/getUserRooms")
  @HttpCode(200)
  async getUserRooms(@QueryParam("email") email: string, @Res() res: Response) {
    try {
      const user = await this.roomService.getUserRooms(email);

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/getIsIn")
  @HttpCode(200)
  async userIsIn(
    @QueryParam("id") id: number,
    @QueryParam("email") email: string,
    @Res() res: Response
  ) {
    try {
      const response = await this.roomService.userIsIn(id, email);

      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Put("/join")
  @HttpCode(200)
  async joinRoom(
    @Body() body: { roomId: number; email: string },
    @Res() res: Response
  ) {
    try {
      const room = await this.roomService.joinRoom(body.roomId, body.email);

      if (!room)
        return res
          .status(404)
          .json({ error: "방의 id또는 유저의 email이 잘못되었습니다." });

      return res.status(200).json({ data: room });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Patch("/leave")
  @HttpCode(200)
  async leaveRoom(
    @Body() body: { roomId: number; email: string },
    @Res() res: Response
  ) {
    try {
      const room = await this.roomService.leaveRoom(body.roomId, body.email);

      if (!room)
        return res
          .status(404)
          .json({ error: "방의 id또는 유저의 email이 잘못되었습니다." });

      return res.status(200).json({ data: room });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Delete("/delete")
  @HttpCode(200)
  async deleteRoom(@QueryParam("id") roomId: number, @Res() res: Response) {
    try {
      const room = await this.roomService.deleteRoom(roomId);

      if (!room)
        return res
          .status(404)
          .json({ error: "해당 id를 가지는 방은 존재하지 않습니다." });

      return res.status(200).json({ data: room });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default RoomController;
