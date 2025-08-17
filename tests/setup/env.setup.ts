import {config} from "dotenv";

config({path: '.env.test', quiet: true});

const workerId = process.env.VITEST_WORKER_ID || process.pid;
const dbPath = `file:tests/db/test_${workerId}.db`;

process.env.DB_URL = dbPath;