#!/bin/bash

# Build the Next site including SSG
npm run build

# Start the production server
exec "$@"