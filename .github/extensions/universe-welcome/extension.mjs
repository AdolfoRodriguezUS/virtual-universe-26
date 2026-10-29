const files = {
    "/": ["welcome.html", "text/html; charset=utf-8"],
    "/avatar.svg": ["avatar.svg", "image/svg+xml"],
    "/walkthroughs.js": ["walkthroughs.js", "text/javascript; charset=utf-8"],
};
const VALID_IDS = new Set(["skills", "tools", "security", "automate"]);
const servers = new Map();
let session;

function getPrompt(id, text) {
    if (typeof text === "string" && text.length > 0) return text;
    const defaults = {
        skills: "Read only. Open .github/skills/issue-to-pr/SKILL.md from this checkout in the editor without creating a fork.",
        tools: "Use the public Microsoft Learn connector to look up current Node.js documentation without creating a fork.",
        security: "Review the request for security issues in the current session without creating a fork.",
        automate: "Create a manual automation in this session without creating a fork or switching projects.",
    };
    return defaults[id] || "";
}

async function startServer() {
    const server = createServer(async (req, res) => {
        const url = new URL(req.url, "http://127.0.0.1");
        const origin = req.headers.origin || "";

        if (req.method === "POST" && url.pathname === "/try") {
            res.setHeader("Content-Type", "application/json");
            const requestOrigin = new URL(`http://${req.headers.host || "127.0.0.1"}`).origin;
            if (origin && origin !== requestOrigin) {
                res.statusCode = 403;
                return res.end(JSON.stringify({ error: "Forbidden" }));
            }
            let body = "";
            for await (const chunk of req) body += String(chunk);
            let payload = {};
            try {
                payload = JSON.parse(body || "{}");
            } catch {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
            const { id, text } = payload;
            if (typeof id !== "string" || !VALID_IDS.has(id)) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Bad request" }));
            }
            if (text !== undefined && typeof text !== "string") {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "Bad request" }));
            }
            const prompt = getPrompt(id, text);
            if (prompt.length > 16384) {
                res.statusCode = 413;
                return res.end(JSON.stringify({ error: "Payload too large" }));
            }
            await session.send({ prompt });
            return res.end(JSON.stringify({ ok: true }));
        }

        if (req.method === "GET" && url.pathname === "/walkthroughs.js") {
            res.setHeader("Cache-Control", "no-store");
            const data = await readFile(new URL("./walkthroughs.js", import.meta.url));
            res.setHeader("Content-Type", "text/javascript; charset=utf-8");
            return res.end(data);
        }

        if (req.method === "GET" && url.pathname === "/") {
            res.setHeader("Cache-Control", "no-store");
            const data = await readFile(new URL("./welcome.html", import.meta.url));
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.end(data);
        }

        res.statusCode = 404;
        return res.end();
    });

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

session = await joinSession({
    canvases: [
        createCanvas({
            id: "universe-welcome",
            displayName: "Universe '26 welcome",
            description: "Welcome screen for the Universe '26 Section 2 cookbook: introduces building an automation with skills, tools and connectors, security review, and triggers.",
            actions: [],
            open: async (ctx) => {
                let entry = servers.get(ctx.instanceId);
                if (!entry) {
                    entry = await startServer();
                    servers.set(ctx.instanceId, entry);
                }
                return { title: "Welcome to Universe '26", url: entry.url };
            },
            onClose: async (ctx) => {
                const entry = servers.get(ctx.instanceId);
                if (entry) {
                    servers.delete(ctx.instanceId);
                    await new Promise((resolve) => entry.server.close(() => resolve()));
                }
            },
        }),
    ],
});
