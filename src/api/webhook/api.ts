import {
  middleware,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from "@line/bot-sdk";
import { getMiddlewareConfig } from "lib/config";
import { ENV, createHono } from "lib/constant";

const webhook = createHono();

webhook.use("/*", async (ctx, next) => {
  middleware(getMiddlewareConfig(ctx.env));
  await next();
});

const textEventHandler = async (
  env: ENV,
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;
  const response: TextMessage = {
    type: "text",
    text,
  };
  await fetch("https://api.line.me/v2/bot/message/reply", {
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [response],
    }),
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CHANNEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
};

webhook.post("/", async (ctx) => {
  const data = await ctx.req.json();
  const events: WebhookEvent[] = (data as any).events;

  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await textEventHandler(ctx.env, event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return ctx.status(500);
      }
    })
  );
  return ctx.status(200);
});

export { webhook };
