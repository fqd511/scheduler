/**
 * By 511 at 22/07/16/ 周六 22:00
 * @Desc: run scheduler jobs
 */
import { LogLevelEnum, LogSourceTypeEnum } from "./type";
import { GFWCheckIn } from "./jobs/gfw";
import { getISODate, log } from "./utils";

const serviceList = [
  {
    service: GFWCheckIn,
    name: "光速云每日签到",
  },
];

executeList();
process.exit();

export function executeList() {
  serviceList.forEach(({ service, name }) => {
    try {
      service()
        .then((msg) => {
          log({
            desc: msg,
            type: LogSourceTypeEnum.GA,
            name,
            level: LogLevelEnum.success,
            timestamp: getISODate(),
          });
        })
        .catch((err) => {
          handleError(err as Error, name);
        });
    } catch (error: unknown) {
      handleError(error as Error, name);
    }
  });
}

function handleError(error: Error, name: string) {
  log({
    desc: error.message,
    type: LogSourceTypeEnum.GA,
    name,
    level: LogLevelEnum.error,
    timestamp: getISODate(),
  });
}
