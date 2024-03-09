import "reflect-metadata";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { config } from "dotenv";
import cors from "cors";
import { useExpressServer } from "routing-controllers";

const app = express();

config();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

import { useContainer } from "routing-controllers";
import Container from "typedi";
import UserService from "./src/service/UserService";
import UserContoller from "./src/controllers/UserController";
import RoomService from "./src/service/RoomService";
import RoomController from "./src/controllers/RoomController";
import JwtController from "./src/controllers/JwtController";
Container.set(UserService, new UserService());
Container.set(RoomService, new RoomService());
useContainer(Container);

useExpressServer(app, {
  controllers: [UserContoller, RoomController, JwtController],
});

export default app;
