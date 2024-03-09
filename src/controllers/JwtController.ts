import {
  Body,
  JsonController,
  HttpCode,
  Post,
  Res,
  Req,
} from "routing-controllers";
import { Service } from "typedi";
import { Request, Response } from "express";
import { JwtUtil } from "../util/JWT";

@JsonController("/jwt")
@Service()
class JwtController {
  @Post("/verify")
  @HttpCode(200)
  async loginUser(
    @Body() body: { token: string },
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      const token = req.headers.authorization!.replace("Bearer ", "");

      if (!token)
        return res.status(404).json({ error: "토큰이 존재하지 않습니다." });

      const verify = JwtUtil.verifyToken(token);

      console.log(verify);
      return res.status(200).json({ message: "유효한 토큰" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default JwtController;
