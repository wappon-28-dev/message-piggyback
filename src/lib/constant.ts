import { Hono } from "hono";
import { z } from "zod";

type ENV = {
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
  DISCORD_TOKEN: string;
  DISCORD_TARGET_SERVER: number;
  DISCORD_TARGET_CHANNEL: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: z.ZodType<T[K]>;
};

type valueOf<T> = T[keyof T];

const createHono = () => new Hono<{ Bindings: ENV; strict: false }>();

class NetworkError extends Error {
  constructor(reason: string) {
    super(JSON.stringify({ message: "Network Error", reason: reason }));
  }
}

class ResponseNotOkError extends Error {
  constructor(message: string, reason: string) {
    super(JSON.stringify({ message, reason }));
  }
}

class InvalidRequestError extends Error {
  constructor(reason: string) {
    super(JSON.stringify({ message: "InvalidRequestError", reason }));
  }
}

export { createHono, NetworkError, ResponseNotOkError, InvalidRequestError };
export type { ENV, toZod, valueOf };
