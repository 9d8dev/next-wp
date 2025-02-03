import "server-only";

import { WebClient } from "@slack/web-api";

// 🦾
export const botwise = new WebClient(process.env.BOTWISE_AUTH_TOKEN as string);
