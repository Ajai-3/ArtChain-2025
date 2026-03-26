import { defineConfig, env } from 'prisma/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// picks up ENV_FILE=".env.docker" or defaults to ".env.local"
// this configuration lives at the project root so that the `prisma` CLI
// (which searches the current working directory) can find it automatically.
// if you ever want to move it inside the `prisma/` directory you must
// supply `--config prisma/prisma.config.ts` when you run commands.
config({ path: resolve(process.cwd(), process.env.ENV_FILE ?? '.env.local') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
