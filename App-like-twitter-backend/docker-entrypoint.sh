#!/bin/bash
set -e

echo "Apply database migrations"
python manage.py migrate

echo "Starting server on port 8000"
python manage.py runserver 0.0.0.0:8000
