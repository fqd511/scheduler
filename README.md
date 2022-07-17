## Scheduler

Here i use github actions to run scheduler jobs, mostly cron jobs.

### How

```shell
# install dependencies
npm i

# execute jobs and store output log to local file(log.json)
npm run serve

# send log to notion database (config env first)
npm run log 
```