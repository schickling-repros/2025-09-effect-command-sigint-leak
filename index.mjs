import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { Effect } from "effect"
import * as Command from "@effect/platform/Command"
import { NodeCommandExecutor, NodeRuntime } from "@effect/platform-node"

const cwd = dirname(fileURLToPath(import.meta.url))

const command = Command.make(process.execPath, ["child.mjs"]).pipe(
  Command.workingDirectory(cwd),
  Command.stdin("inherit"),
  Command.stdout("inherit"),
  Command.stderr("inherit"),
  Command.exitCode,
)

const program = Effect.provide(command, NodeCommandExecutor.layer)

NodeRuntime.runMain(program)
