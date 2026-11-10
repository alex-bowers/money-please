// Tiny dependency-free server: serves the static app and stores costs in a JSON file.
const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 80
const DATA_FILE = process.env.DATA_FILE || "/data/monthly-costs.json"
const PUBLIC_DIR = path.join(__dirname, "public")

const TYPES = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".webmanifest": "application/manifest+json",
    ".png": "image/png"
}

function sendJson(res, status, body) {
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" })
    res.end(JSON.stringify(body))
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost")

    if (url.pathname === "/api/monthly-costs/get" && req.method === "GET") {
        fs.readFile(DATA_FILE, "utf8", (err, data) => {
            if (err) return sendJson(res, 200, { message: "Key not found" })
            res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" })
            res.end(data)
        })
        return
    }

    if (url.pathname === "/api/monthly-costs/update" && req.method === "POST") {
        let body = ""
        req.on("data", chunk => {
            body += chunk
            if (body.length > 1e6) req.destroy()
        })
        req.on("end", () => {
            try {
                JSON.parse(body)
            } catch {
                return sendJson(res, 400, { message: "Invalid JSON" })
            }
            const tmp = DATA_FILE + ".tmp"
            fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
            fs.writeFile(tmp, body, (err) => {
                if (err) return sendJson(res, 500, { message: "Write failed" })
                fs.rename(tmp, DATA_FILE, (err2) =>
                    err2 ? sendJson(res, 500, { message: "Write failed" }) : sendJson(res, 200, { message: "OK" }))
            })
        })
        return
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405); return res.end()
    }

    const rel = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname)
    const file = path.join(PUBLIC_DIR, path.normalize(rel))
    if (!file.startsWith(PUBLIC_DIR + path.sep)) {
        res.writeHead(403); return res.end()
    }
    fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); return res.end("Not found") }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" })
        res.end(data)
    })
})

server.listen(PORT, () => console.log(`Money Please listening on ${PORT}, data at ${DATA_FILE}`))
