import { webhook } from "api/webhook/api";
import { createHono } from "./lib/constant";

const app = createHono();

app.get("/", (ctx) => ctx.text("Welcome to message-piggy"));
app.route("/api/webhook", webhook);

export default app;
