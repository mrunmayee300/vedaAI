import http from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createGenerationWorker } from "./workers/generation.worker.js";
import { registerSocketServer } from "./sockets/socket.js";

const bootstrap = async () => {
  await connectDatabase();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  registerSocketServer(io);
  createGenerationWorker();

  server.listen(env.PORT, () => {
    console.log(`VedaAI API running on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
