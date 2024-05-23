#!/usr/bin/env node
import "reflect-metadata";
import { Container } from "typedi";
import { App } from "./app/app";

(async () => {
  await Container.get(App).startServer(Number(process.env.PORT || 4321));
})();
