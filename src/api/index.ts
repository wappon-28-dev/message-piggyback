import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";
import { z } from "zod";

const validator = {
  get: {
    resBody: z.object({
      message: z.string().default("success"),
    }),
  },
};

export type Methods = DefineMethods<{
  get: {
    status: 200;
    resBody: z.infer<typeof validator["get"]["resBody"]>;
  };
}>;

export default mockMethods<Methods>({
  get: () => {
    return {
      status: 200,
      resBody: {
        message: "success",
      },
    };
  },
});

export { validator };
