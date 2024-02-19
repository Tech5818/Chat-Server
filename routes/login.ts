import express from "express";
import * as controller from "../Controller/Login";

const router = express.Router();

router.post("/", controller.Login);

export default router;
