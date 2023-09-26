# get current date
current_date=$(date +%d)

# filter date
if (( current_date % 9 == 0 )); then
    echo "commit log"
    # update date file and commit
    echo $(date) > updated_at
    git config user.email "15816056+fqd511@users.noreply.github.com "
    git config user.name "bot"
    git add .
    git commit -m "chore: Update log by Github Action"
    git push origin main
else
    echo "skip log"
    exit 0
fi
