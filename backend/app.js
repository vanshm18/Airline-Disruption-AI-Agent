import express from "express";
import cors from "cors";

import agentRoutes from "./routes/agentRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Airline Resolution Agent API is running",
  });
});

app.use("/api/agent", agentRoutes);

export default app;