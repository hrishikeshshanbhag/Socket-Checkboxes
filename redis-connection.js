import Redis from "ioredis";

function createReddisConnection() {
  return new Redis({
    host: "localhost",
    port: 6379,
  });
}
export const redis = createReddisConnection();
export const publisher = createReddisConnection();
export const subscriber = createReddisConnection();
