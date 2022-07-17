import { db, notionToken } from "./localConfig";
/**
 * By 511 at 22/07/16/ 周六 21:59
 * @Desc: read local file(log.json),send to notion database
 */

import { Log } from "./type";
const { Client } = require("@notionhq/client");
const fs = require("fs");

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN || notionToken,
});

try {
  const data = JSON.parse(fs.readFileSync("./log.json", "utf8")) as Log[];
  if (Array.isArray(data)) {
    data.forEach((log) => {
      notion.pages.create({
        parent: {
          type: "database_id",
          database_id: process.env.DATABASE_ID || db,
        },
        properties: log,
      });
    });
  } else {
    notion.pages.create({
      parent: {
        type: "database_id",
        database_id: process.env.DATABASE_ID || db,
      },
      properties: data as Log,
    });
  }
} catch (error: unknown) {
  console.error(error);
}
