## Scheduler
[![Scheduler Jobs Bot](https://github.com/fqd511/scheduler/actions/workflows/scheduler.yaml/badge.svg)](https://github.com/fqd511/scheduler/actions/workflows/scheduler.yaml)

Here i use github actions to run scheduler jobs, mostly cron jobs.

### How

```shell
# install dependencies
npm i

# execute jobs and send output log to notion db
npm run serve
```

### Currently jobs

- auto-signin

### Todo

- [ ] integret notion handler into another lib
- [ ] set auto-commit bot on a physical machine
