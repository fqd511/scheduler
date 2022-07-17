/**
 * By 511 at 22/07/17/ 周日 19:33
 * @Desc: utils
 */

import { Log } from "./type";
const fs = require("fs");

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
      fractionalSecondDigits: 3,
    })
    .replace(",", ".")
    .replace(" ", "T");
}

/**
 * formet log into notion-format and write to local file
 * @param log
 */
export function log(log: Log) {
  const { type, name, desc, timestamp = getISODate(), level } = log;
  const logItem = {
    desc: {
      title: [
        {
          text: {
            content: desc,
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
    name: {
      rich_text: [
        {
          text: {
            content: name,
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
  let data = null;
  // read local file
  try {
    const fileData = JSON.parse(fs.readFileSync("./log.json", "utf8"));
    if (Array.isArray(fileData)) {
      data = fileData;
    } else {
      data = [];
    }
  } catch (e) {
    console.error("read log file error");
    data = [];
  }
  data.push(logItem);
  fs.writeFileSync("./log.json", JSON.stringify(data));
}
