/**
 * By 511 at 22/07/16/ 周六 22:00
 * @Desc: run scheduler jobs
 */
require("dotenv").config();
import { LogLevelEnum, LogSourceTypeEnum } from "./type";
import { GFWCheckIn } from "./jobs/gfw";
import { getISODate, log } from "./utils";

interface Service {
  service: () => Promise<any>;
  name: string;
  retry: number;
}
const serviceList: Service[] = [
  // new website has no sign-in bonus
  {
    service: GFWCheckIn,
    name: "每日签到-" + process.env.GFW_URL?.split("://")[1].split("/")[0],
    retry: 3,
  },
];

function executeJob({ service, name, retry }: Service): any {
  try {
    if (service) {
      return service?.()
        .then((msg: string) => {
          return log({
            desc: msg + (retry === 3 ? "" : `(retry:${3 - retry})`),
            type: LogSourceTypeEnum.GA,
            name,
            level: LogLevelEnum.success,
            timestamp: getISODate(),
          });
        })
        .catch((err: any) => {
          if (retry) {
            return executeJob({ service, name, retry: retry - 1 });
          } else {
            return handleError(err as Error, name);
          }
        });
    } else {
      return;
    }
  } catch (error: unknown) {
    return handleError(error as Error, name);
  }
}

Promise.all(
  serviceList.map(({ service, name, retry }) =>
    executeJob({ service, name, retry })
  )
).then(() => {
  process.exit();
});

function handleError(error: Error, name: string) {
  return log({
    desc: error.message,
    type: LogSourceTypeEnum.GA,
    name,
    level: LogLevelEnum.error,
    timestamp: getISODate(),
  });
}
