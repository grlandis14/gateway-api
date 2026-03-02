const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(morgan("combined"));

// Railway sets PORT automatically; locally you'll use 3000 by default
const PORT = process.env.PORT || 3000;

// Health check (Railway + you)
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "gateway-api", ts: new Date().toISOString() });
});

// MVP proxy endpoint (placeholder)
// Later: auth, correlation IDs, retries, upstream forwarding
app.post("/proxy/:provider/*", async (req, res) => {
  const { provider } = req.params;
  const path = req.params[0] || ""; // wildcard remainder

  // For now, just echo back to prove routing works
  res.json({
    ok: true,
    provider,
    path,
    method: req.method,
    receivedHeaders: {
      "x-agent-key": req.get("x-agent-key") || null,
      "x-correlation-id": req.get("x-correlation-id") || null
    },
    body: req.body
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`gateway-api listening on port ${PORT}`);
});
