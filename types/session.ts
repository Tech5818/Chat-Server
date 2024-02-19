import { SessionData } from "express-session";

export interface SessionInterface extends SessionData {
  user?: {
    id: string;
  };
}
