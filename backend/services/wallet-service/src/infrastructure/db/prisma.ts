import 'dotenv-flow/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const url = new URL(connectionString!);
const sslMode = url.searchParams.get('sslmode');

const pool = new Pool({
  connectionString,
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  ssl:
    sslMode === 'require' || sslMode === 'no-verify'
      ? { rejectUnauthorized: false }
      : false,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
