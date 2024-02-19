#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app";
import debugs from "debug";
import http from "http";

const debug = debugs("server:server");

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: any) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;
  debug("Listening on " + bind);
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
import { Server, Socket } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`connect ID: ${socket.id}`);

  socket.on("join", (id: string) => {
    socket.data.id = id;
  });

  socket.on("message", (data: { id: string; message: string }) => {
    const { id, message } = data;
    const sockets = Array.from(io.sockets.sockets.values()).filter(
      (socket: Socket) => socket.data.id === id
    );
    sockets.forEach((socket) => {
      socket.emit(message);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);