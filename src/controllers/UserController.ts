import {
  Body,
  JsonController,
  HttpCode,
  Post,
  Res,
  Get,
  QueryParam,
  Put,
  Delete,
} from "routing-controllers";
import { Service } from "typedi";
import UserService from "../service/UserService";
import { Response } from "express";
import { IUser, IUpdateUser } from "../types/UserType";
import { JwtUtil } from "../util/JWT";

@JsonController("/user")
@Service()
class UserController {
  constructor(private userService: UserService) {}

  @Post("/login")
  @HttpCode(200)
  async loginUser(
    @Body() body: { email: string; password: string },
    @Res() res: Response
  ) {
    try {
      const user = await this.userService.getUser(body.email);
      const token = JwtUtil.generateToken({
        username: user!.username,
        email: user!.email,
      });
      if (!user) return res.status(404).json({ error: "잘못된 이메일" });
      if (user?.password === body.password) {
        return res.status(200).json({ token });
      }

      return res.status(404).json({ error: "잘못된 비밀번호" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Post("/create")
  @HttpCode(201)
  async createUser(@Body() body: IUser, @Res() res: Response) {
    try {
      const newUser = await this.userService.createUser(body);

      if (!newUser) {
        return res.status(500).json({ error: "이미 존재하는 email 입니다." });
      }

      return res.status(201).json({ data: newUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/get")
  @HttpCode(200)
  async getUser(@QueryParam("email") email: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUser(email);

      if (!user) {
        return res
          .status(404)
          .json({ error: "해당 email을 가진 유저는 없습니다." });
      }

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Get("/getAll")
  @HttpCode(200)
  async getAll(@Res() res: Response) {
    try {
      const user = await this.userService.getAll();
      return res.status(200).json({ data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
  @Get("/getUsers")
  @HttpCode(200)
  async getUsers(
    @QueryParam("email") usersEmail: string[],
    @Res() res: Response
  ) {
    try {
      const data = await this.userService.getUsers(usersEmail);

      return res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Put("/update")
  @HttpCode(200)
  async updateUser(
    @Body() body: { email: string; updateData: IUpdateUser },
    @Res() res: Response
  ) {
    try {
      if (!body.email)
        return res.status(404).json({ error: "email이 필요 합니다." });

      const user = await this.userService.updateUser(
        body.email,
        body.updateData
      );

      if (!user)
        return res
          .status(404)
          .json({ error: "수정하려는 email은 이미 존재합니다." });

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Delete("/delete")
  @HttpCode(200)
  async deleteUser(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const user = await this.userService.deleteUser(body.email);

      if (!user)
        return res
          .status(404)
          .json({ error: "해당 email을 가진 유저는 존재하지 않습니다." });

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default UserController;
