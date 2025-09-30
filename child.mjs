import http from "node:http"

const port = Number(process.env.REPRO_PORT ?? 48787)

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/plain" })
  res.end("ok\n")
})

server.listen(port, () => {
  console.log(`[child] listening on http://127.0.0.1:${port} pid=${process.pid}`)
})

process.on("SIGINT", () => {
  console.log("[child] received SIGINT")
  server.close(() => {
    console.log("[child] server closed")
    process.exit(0)
  })
})

setInterval(() => {}, 1_000)
