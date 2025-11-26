#!/bin/bash

# Run the setup script in the background after a delay
(sleep 30 && /usr/local/bin/setup-wordpress.sh) &

# Run the original WordPress entrypoint
exec docker-entrypoint.sh "$@"
