/**
 * By 511 at 22/07/16/ 周六 22:00
 * @Desc: test scheduler jobs on local environment
 */

import { LogLevelEnum, LogSourceTypeEnum } from "./type";
import { getISODate, log } from "./utils";

log({
  type: LogSourceTypeEnum.GA,
  subType: "test",
  desc: "desc",
  timestamp: getISODate(),
  level: LogLevelEnum.success,
});
