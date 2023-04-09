import { createHono } from "./lib/constant";

const app = createHono();

app.get("/", (ctx) => ctx.json({ message: "success" }));
app.post("/", (ctx) => ctx.json({ message: "success" }));

export default app;
