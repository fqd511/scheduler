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
    desc: "光速云每日签到",
  },
];

executeList();
process.exit();

export function executeList() {
  serviceList.forEach(({ service, desc }) => {
    try {
      service()
        .then((msg) => {
          log({
            desc: msg,
            type: LogSourceTypeEnum.GA,
            subType: desc,
            level: LogLevelEnum.success,
            timestamp: getISODate(),
          });
        })
        .catch((err) => {
          handleError(err as Error, desc);
        });
    } catch (error: unknown) {
      handleError(error as Error, desc);
    }
  });  
}

function handleError(error: Error, desc: string) {
  log({
    desc: error.message,
    type: LogSourceTypeEnum.GA,
    subType: desc,
    level: LogLevelEnum.error,
    timestamp: getISODate(),
  });
}
