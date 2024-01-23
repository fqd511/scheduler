/**
 * By 511 at 22/07/16/ 周六 22:00
 * @Desc: run scheduler jobs
 */
require("dotenv").config();
import { LogLevelEnum, LogSourceTypeEnum } from "./type";
import { GFWCheckIn } from "./jobs/gfw";
import { getISODate, log } from "./utils";

interface Service {
  service?: () => Promise<any>;
  name: string;
}
const serviceList: Service[] = [
  // new website has no sign-in bonus
  {
    service: undefined,
    name: "光速云每日签到",
  },
];

Promise.all(
  serviceList.map(({ service, name }) => {
    try {
      if (service) {
        return service?.()
          .then((msg: string) => {
            return log({
              desc: msg,
              type: LogSourceTypeEnum.GA,
              name,
              level: LogLevelEnum.success,
              timestamp: getISODate(),
            });
          })
          .catch((err: any) => {
            return handleError(err as Error, name);
          });
      } else {
        return;
      }
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
