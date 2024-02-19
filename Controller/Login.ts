import { Request, Response } from "express";
import { SessionInterface } from "../types/session";

export const Login = (req: Request, res: Response) => {
  const id = req.body;
  const sessionData = req.session as SessionInterface;
  sessionData.user = { id };

  res.status(201).json({ message: "로그인 성공", data: { id } });
};
