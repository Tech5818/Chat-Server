import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";

const app = express();

app.use(
  session({
    secret: "abcdefg",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60,
    },
  })
);

import cors from "cors";

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

import indexRouter from "./routes/index";
import loginRouter from "./routes/login";

app.use("/", indexRouter);
app.use("/login", loginRouter);

export default app;
