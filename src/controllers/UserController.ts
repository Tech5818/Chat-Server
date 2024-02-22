import { Body, JsonController, HttpCode, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import UserService from "../service/UserService";
import { Response } from "express";

@JsonController("/user")
@Service()
class UserController {
  constructor(private userService: UserService) {}

  @Post("/create")
  @HttpCode(201)
  async createUser(
    @Body() body: { username: string; password: string; email: string },
    @Res() res: Response
  ) {
    try {
      const { username, password, email } = body;

      const newUser = await this.userService.createUser(
        username,
        password,
        email
      );

      if (!newUser) {
        return res.status(500).json({ error: "이미 존재하는 email" });
      }

      return res.status(201).json({ data: newUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default UserController;
