import { Hono } from "hono";
import { z } from "zod";

type ENV = {
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: z.ZodType<T[K]>;
};

type valueOf<T> = T[keyof T];

const createHono = () => new Hono<{ Bindings: ENV }>();

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

class StoreError extends Error {
  constructor(reason: string, public status?: number) {
    super(JSON.stringify({ message: "Store Error", reason }));
  }
}

export { createHono, NetworkError, StoreError, ResponseNotOkError };
export type { ENV, toZod, valueOf };
