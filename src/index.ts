import "dotenv/config";
import express from "express";
import cors from "cors";
import softwareRouter from "./routes/software";

const app = express();

app.use(cors());
app.use(express.json());

// Allow requests from localhost:4200
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (_req, res) => {
  res.send("Backend is up. Use /api/software to fetch items.");
});

app.use("/api/software", softwareRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
