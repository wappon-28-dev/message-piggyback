import { zValidator } from "@hono/zod-validator";
import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";
import { getClientConfig, getMiddlewareConfig } from "lib/config";
import { ENV, ResponseNotOkError, createHono } from "lib/constant";

const webhook = createHono();

webhook.use("/*", async (ctx, next) => {
  middleware(getMiddlewareConfig(ctx.env));
  await next();
});

const textEventHandler = async (
  env: ENV,
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  const client = new Client(getClientConfig(env));

  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  const response: TextMessage = {
    type: "text",
    text: text,
  };
  await client.replyMessage(replyToken, response);
};

webhook.post("/", async (ctx) => {
  const events: WebhookEvent[] = (await ctx.req.json()) as WebhookEvent[];
  await Promise.all(
    events.map(async (event) => {
      try {
        await textEventHandler(ctx.env, event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new ResponseNotOkError(err.message, err.stack ?? "");
        }
        return ctx.text("Internal Server Error", 500);
      }
    })
  );
  return ctx.status(200);
});

export default webhook;
