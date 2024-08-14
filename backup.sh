#!/bin/bash

# Get current date and time
BACKUP_TIME=$(date +"%Y%m%d%H%M")

# Set the backup file name
BACKUP_FILE="/backups/db_backup_$BACKUP_TIME.sql"

# Perform the backup
pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

# Optional: Clean up old backups (e.g., keep only the last 7 backups)
find /backups -type f -name "*.sql" -mtime +7 -exec rm {} \;
