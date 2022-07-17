/**
 * By 511 at 22/07/16/ 周六 22:00
 * @Desc: data models
 */

export enum LogSourceTypeEnum {
  GA = "github_action",
}

export enum LogLevelEnum {
  success = "success",
  info = "info",
  warning = "warning",
  error = "error",
}

/**
 * log interface, should unified across all projects
 */
export interface Log {
  /* log source type */
  type: LogSourceTypeEnum;
  /* sub-type, temporarily string  */
  subType: string;
  /* log content */
  desc: string;
  /* date in ISO format */
  timestamp: string;
  /* log report level */
  level: LogLevelEnum;
}
