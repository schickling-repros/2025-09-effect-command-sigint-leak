import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { Effect } from "effect"
import * as Command from "@effect/platform/Command"
import {
  NodeCommandExecutor,
  NodeContext,
  NodeFileSystem,
  NodeRuntime,
} from "@effect/platform-node"

const cwd = dirname(fileURLToPath(import.meta.url))
const envPort = process.env.REPRO_PORT ?? "48787"

const makeCommand = () =>
  Command.make("bash", "-lc", "node child.mjs").pipe(
    Command.workingDirectory(cwd),
    Command.stdin("inherit"),
    Command.stdout("inherit"),
    Command.stderr("inherit"),
    Command.env([["REPRO_PORT", envPort]]),
    Command.exitCode,
  )

const program = Effect.gen(function* () {
  return yield* makeCommand()
}).pipe(
  Effect.provide(NodeCommandExecutor.layer),
  Effect.provide(NodeFileSystem.layer),
  Effect.provide(NodeContext.layer),
)

NodeRuntime.runMain(program)
