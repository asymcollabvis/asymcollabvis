#!/bin/bash

mkdir dist
cp public/* dist

# Start the first process
npm run start &
  
# Start the second process
cd server && npm run start:build
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?