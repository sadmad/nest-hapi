# Use the official PostgreSQL 14 image as the base image
FROM postgres:14

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy the backup script and cron job file
COPY backup.sh /docker-entrypoint-initdb.d/backup.sh
COPY crontab.txt /etc/cron.d/backup-cron

# Set correct permissions on the cron job
RUN chmod 0644 /etc/cron.d/backup-cron

# Apply the cron job
RUN crontab /etc/cron.d/backup-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Ensure the backup script is executable
RUN chmod +x /docker-entrypoint-initdb.d/backup.sh

# Start the cron service and then PostgreSQL
CMD service cron start && docker-entrypoint.sh postgres