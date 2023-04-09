import { WebhookEvent } from "@line/bot-sdk";
import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";
import { z } from "zod";

export type Methods = DefineMethods<{
  post: {
    status: 200;
    reqBody: WebhookEvent[];
  };
}>;

export default mockMethods<Methods>({
  post: () => {
    return {
      status: 200,
    };
  },
});
