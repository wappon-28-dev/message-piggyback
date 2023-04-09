import { Client as LineClient, middleware, WebhookEvent } from "@line/bot-sdk";
import type { Profile } from "@line/bot-sdk";
import { getClientConfig, getMiddlewareConfig } from "lib/config";
import {
  ENV,
  InvalidRequestError,
  ResponseNotOkError,
  createHono,
} from "lib/constant";
import { Client as DiscordClient } from "discord.js";

const webhook = createHono();

webhook.use("/*", async (ctx, next) => {
  middleware(getMiddlewareConfig(ctx.env));
  await next();
});

const sendTextMessage2Discord = async (
  env: ENV,
  profile: Profile,
  text: string
) => {
  // TODO: webhook へ切り替える
  // const discordClient = new DiscordClient({ intents: [] });
  // await discordClient.login(env.DISCORD_TOKEN);
  // // send message
  // const targetChannel = discordClient.channels.cache.get(
  //   env.DISCORD_TARGET_CHANNEL.toString()
  // );
  // if (!targetChannel) {
  //   throw new ResponseNotOkError(
  //     "Target Discord Channel not found",
  //     "targetChannel is undefined"
  //   );
  // }
  // if (!targetChannel.isTextBased()) {
  //   throw new InvalidRequestError("targetChannel is not text based");
  // }
  // await targetChannel.send(`[${profile.displayName}] ${text}`);
};

const textEventHandler = async (
  env: ENV,
  event: WebhookEvent
): Promise<{ profile: Profile; message: string }> => {
  if (event.type !== "message" || event.message.type !== "text") {
    throw new InvalidRequestError("event is not text message");
  }

  if (event.source.type !== "user") {
    throw new InvalidRequestError("source is not user");
  }

  const lineClient = new LineClient(getClientConfig(env));
  const profile = await lineClient.getProfile(event.source.userId);

  if (event.message.type !== "text") {
    throw new InvalidRequestError("message is not text");
  }

  const message = event.message.text;
  return { profile, message };
};

webhook.post("/", async (ctx) => {
  const data = await ctx.req.json();
  const events: WebhookEvent[] = (data as any).events;

  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        const { profile, message } = await textEventHandler(ctx.env, event);
        await sendTextMessage2Discord(ctx.env, profile, message);
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
