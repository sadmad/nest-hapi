#!/bin/bash

# Set the container name and database details
CONTAINER_NAME="hapi-pg"
DB_USER="hapi-admin"
DB_NAME="hapi-pg"
DB_PASSWORD="hapi-pass"
DUMP_FILE="dump_$(date +%F_%T).sql.gz"
REPO_PATH="/home/sa/src/Hapi/01/hippocratic-api"

# Set the PGPASSWORD environment variable
export PGPASSWORD=$DB_PASSWORD

# Run the pg_dump command inside the Docker container and compress the dump
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > $REPO_PATH/$DUMP_FILE

# Change to the repository directory
cd $REPO_PATH

# Add the dump file to the repo
git add $DUMP_FILE
git commit -m "Database dump for $(date)"
git push origin main