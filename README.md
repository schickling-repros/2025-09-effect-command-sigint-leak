# Effect Command SIGINT Reproduction

Minimal reproduction showing that child processes spawned via Effect's `Command` API remain alive after the parent Effect program receives `SIGINT`.

## Steps

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the wrapper:

   ```sh
   pnpm start
   ```

   You should see the child log its PID and port:

   ```
   [child] listening on http://127.0.0.1:48787 pid=12345
   ```

3. Press `Ctrl+C`.
4. Verify the child is still running (the port is still bound):

   ```sh
   lsof -nP -iTCP:48787 -sTCP:LISTEN
   # or
   ps -p <pid> -o pid,ppid,pgid,command
   ```

   The process remains with `PPID=1`, showing that the effect wrapper exited before killing the child process group.

## Expected
- The child should terminate when the wrapper receives `SIGINT`.

## Actual
- The wrapper exits immediately, leaving the detached child process running, mirroring what we observe in `mono examples run cf-chat`.
