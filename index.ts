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

Promise.all(
  serviceList.map(({ service, name }) => {
    try {
      return service()
        .then((msg) => {
          return log({
            desc: msg,
            type: LogSourceTypeEnum.GA,
            name,
            level: LogLevelEnum.success,
            timestamp: getISODate(),
          });
        })
        .catch((err) => {
          return handleError(err as Error, name);
        });
    } catch (error: unknown) {
      return handleError(error as Error, name);
    }
  })
).then((list) => {
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
