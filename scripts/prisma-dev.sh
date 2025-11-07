#!/bin/bash

# Track the Prisma dev process PID
PRISMA_PID=""
CLEANUP_CALLED=0

# Trap signals to ensure cleanup
cleanup() {
  # Prevent multiple calls
  if [ "$CLEANUP_CALLED" -eq 1 ]; then
    return
  fi
  CLEANUP_CALLED=1
  
  echo "Stopping Prisma dev server..." >&2
  
  # First, try to stop the Prisma dev server gracefully
  # Automatically confirm the prompt by piping the confirmation text
  echo "i will interrupt sessions" | npx prisma dev stop "*" 2>&1 || echo "i will interrupt sessions" | npx prisma dev stop "default" 2>&1 || true
  
  # Wait a moment for graceful shutdown
  sleep 0.5
  
  # Kill the tracked process if it's still running
  if [ ! -z "$PRISMA_PID" ] && kill -0 "$PRISMA_PID" 2>/dev/null; then
    echo "Killing Prisma dev process $PRISMA_PID..." >&2
    kill -TERM "$PRISMA_PID" 2>/dev/null || true
    sleep 0.5
    if kill -0 "$PRISMA_PID" 2>/dev/null; then
      kill -KILL "$PRISMA_PID" 2>/dev/null || true
    fi
  fi
  
  # Force kill any remaining prisma dev processes
  pkill -f "prisma dev" 2>/dev/null || true
  
  exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT SIGQUIT EXIT

# Start Prisma dev in background and capture PID
npx prisma dev &
PRISMA_PID=$!

# Wait for the process to finish
wait $PRISMA_PID 2>/dev/null || cleanup

