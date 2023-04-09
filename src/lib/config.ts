import { ENV } from "./constant";
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";

const getClientConfig = (env: ENV): ClientConfig => ({
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
  channelSecret: env.CHANNEL_SECRET,
});

const getMiddlewareConfig = (env: ENV): MiddlewareConfig => ({
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN,
  channelSecret: env.CHANNEL_SECRET,
});

export { getClientConfig, getMiddlewareConfig };
