import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { IJwtUser } from "../types/UserType";

config();

export class JwtUtil {
  private static readonly secret_key = process.env.SECRET_KEY!;

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, this.secret_key);
    } catch (error) {
      console.error(error);
    }
  }

  static generateToken(user: IJwtUser) {
    try {
      return jwt.sign(
        {
          name: user.username,
          email: user.email,
        },
        this.secret_key
      );
    } catch (error) {
      console.error(error);
    }
  }
}
