#!/bin/sh

set -e

echo "Waiting for PostgreSQL to become healthy..."

while ! curl -s http://fleettrack-db:5433 >/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - executing command"
exec "$@"