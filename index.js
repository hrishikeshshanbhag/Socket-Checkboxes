import http from "node:http";
import path from "node:path";
import express from "express";
import { Server } from "socket.io";
import { publisher, subscriber, redis } from "./redis-connection.js";
async function main() {
  const PORT = process.env.PORT || 8000;
  const CHECKBOX_SIZE = 100;
  const CHECKBOX_KEY = "checkbox-state";
  // const state = {
  //   checkboxes: new Array(CHECKBOX_SIZE).fill(false),
  // };

  const app = express();
  const io = new Server();
  const server = http.createServer(app);
  io.attach(server);
  await subscriber.subscribe("internal-server:checkbox:clicked");
  subscriber.on("message", (channel, message) => {
    if (channel === "internal-server:checkbox:clicked") {
      const { index, checked } = JSON.parse(message);

      // state.checkboxes[index] = checked;
      io.emit("server:checkbox:clicked", { index, checked });
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected with socketid ${socket.id}`);
    socket.on("client:checkbox:clicked", async (data) => {
      const exists = await redis.exists(CHECKBOX_KEY);
      const { index, checked } = data;
      if (!exists) {
        await redis.set(
          CHECKBOX_KEY,
          JSON.stringify(new Array(CHECKBOX_SIZE).fill(false)),
        );
      } else {
        const temp = await redis.get(CHECKBOX_KEY);
        const existingData = JSON.parse(temp);

        existingData[index] = checked;
        await redis.set(CHECKBOX_KEY, JSON.stringify(existingData));
      }
      publisher.publish(
        "internal-server:checkbox:clicked",
        JSON.stringify(data),
      );
    });
  });
  app.use(express.static(path.resolve("./public")));

  app.get("/health", (req, res) => {
    res.json({ healthy: true });
  });
  app.get("/checkboxes", async (req, res) => {
    const exists = await redis.exists(CHECKBOX_KEY);
    if (!exists) {
      return res.json({ checkboxes: new Array(CHECKBOX_SIZE).fill(false) });
    } else {
      const temp = await redis.get(CHECKBOX_KEY);
      const existingData = JSON.parse(temp);
      return res.json({ checkboxes: existingData });
    }
  });
  server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost${PORT}`);
  });
}
main();
