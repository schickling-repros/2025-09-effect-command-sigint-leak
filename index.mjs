import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { Effect, Layer } from "effect"
import * as Command from "@effect/platform/Command"
import {
  NodeCommandExecutor,
  NodeContext,
  NodeFileSystem,
  NodeRuntime,
} from "@effect/platform-node"

const cwd = dirname(fileURLToPath(import.meta.url))

const command = Command.make(process.execPath, ["child.mjs"]).pipe(
  Command.workingDirectory(cwd),
  Command.stdin("inherit"),
  Command.stdout("inherit"),
  Command.stderr("inherit"),
  Command.exitCode,
)

const layer = Layer.mergeAll(NodeContext.layer, NodeFileSystem.layer, NodeCommandExecutor.layer)

NodeRuntime.runMain(command.pipe(Effect.provide(layer)))
