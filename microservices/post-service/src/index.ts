import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Post-service running on port ${PORT}`);
});
