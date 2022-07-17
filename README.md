## Scheduler

Here i use github actions to run scheduler jobs, mostly cron jobs.

### How

```shell
# first install dependencies
npm i

# then run serve, this will store output log to local file(log.json)
npm run serve

# last run log, send log to notion database
npm run log $NOTION_BD_ID $NOTION_BD_TOKEN
```