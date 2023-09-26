/**
 * By 511 at 22/07/17/ 周日 19:33
 * @Desc: utils
 */

import { Log, LogLevelEnum, LogSourceTypeEnum } from "./type";
import { Client } from "@notionhq/client";

/**
 * taking advantage of the fact that Sweden uses a format very close to ISO
 * see: https://stackoverflow.com/a/65758103/6355803
 * @param date
 * @returns
 */
export function getISODate(date = new Date()) {
  return new Date()
    .toLocaleString("sv", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      // @ts-ignore
      fractionalSecondDigits: 3,
    })
    .replace(",", ".")
    .replace(" ", "T");
}

/**
 * formet log into notion-format and write to local file
 * @param log
 */
export function log(log: Partial<Log>): Promise<any> {
  const {
    type = LogSourceTypeEnum.Other,
    name = "",
    desc = "",
    // TODO this is not neccessary, use notion time
    timestamp = getISODate(),
    level = LogLevelEnum.info,
  } = log;
  const logItem = {
    name: {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
    level: {
      select: {
        name: level,
      },
    },
    type: {
      select: {
        name: type,
      },
    },
    desc: {
      rich_text: [
        {
          text: {
            content: desc.split(`\n`)[0],
          },
        },
      ],
    },
    timestamp: {
      date: {
        start: timestamp,
      },
    },
  };

  // send error log to mobile notification
  if (log.level === LogLevelEnum.error) {
    notifyThroughBark(log);
  }

  // Initializing a client
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  return notion.pages.create({
    parent: {
      type: "database_id",
      database_id: process.env.DATABASE_ID!,
    },
    properties: logItem,
  });
}

// send notification through bark
async function notifyThroughBark(log: Partial<Log>) {
  try {
    const response = await fetch(`https://api.day.app/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        body: log.desc || "-",
        title: log.name || "-",
        level: "passive",
        group: "Github Action",
        device_key: process.env.BARK_KEY,
      }),
    });

    if (!response.ok) {
      return new Error("Bark notify failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
