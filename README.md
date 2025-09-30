# Effect Command SIGINT Reproduction

Minimal stand-alone proof that a process spawned via Effect's `Command` API remains alive after the parent program is interrupted (e.g. Ctrl+C).

## Run the repro

```sh
pnpm install
pnpm start
```

Sample output:

```
> effect-cmd-sigint-repro@0.0.0 start
> node index.mjs

[child] listening on http://127.0.0.1:48787 pid=63128
```

Now press `Ctrl+C`.

## Expected vs actual

- **Expected:** When the wrapper receives SIGINT, it should tear down the spawned process group (the child server and its descendants) and exit with them.
- **Actual:** The wrapper exits immediately, but the child remains running with `PPID=1` and keeps its TCP port open.

You can verify the leak with either command below (replace `63128` with the PID printed by the child):

```sh
# Check that the port is still bound:
lsof -nP -iTCP:48787 -sTCP:LISTEN

# Inspect the child process – note PPID=1:
ps -o pid,ppid,pgid,command -p 63128
```

Example after pressing Ctrl+C:

```
$ lsof -nP -iTCP:48787 -sTCP:LISTEN
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    63128 schickling   18u  IPv4  95336      0t0  TCP 127.0.0.1:48787 (LISTEN)

$ ps -o pid,ppid,pgid,command -p 63128
    PID    PPID    PGID COMMAND
  63128       1   63128 node child.mjs
```

This mirrors what we see in larger applications (dev servers, CLIs, etc.): anything started via `Effect / @effect/platform` survives SIGINT because the process group is detached and never explicitly killed when the parent exits due to a signal.
