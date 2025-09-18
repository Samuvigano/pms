import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Message, Escalation, User } from "./models.js";
import cors from "cors";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import OpenAI from "openai";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.static("../client/dist"));

const authenticate = (req, res, next) => {
  const password = req.query.password;
  if (!password || password !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.get("/api/v1/users", authenticate, async (req, res) => {
  try {
    // Aggregate users with their last message and timestamp
    const users = await User.aggregate([
      {
        $lookup: {
          from: "messages",
          let: { userWaId: "$wa_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$wa_id", "$$userWaId"] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 },
            { $project: { text: 1, timestamp: 1, _id: 0 } },
          ],
          as: "lastMessageInfo",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessageInfo.text", 0] },
          lastTimestamp: { $arrayElemAt: ["$lastMessageInfo.timestamp", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          wa_id: 1,
          name: 1,
          lastMessage: 1,
          lastTimestamp: 1,
        },
      },
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/messages", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.query.id }).select(
      "message_id text direction timestamp image"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/send", authenticate, async (req, res) => {
  try {
    const { to, text } = req.body;
    console.log(to, text);
    const whatsappUrl = process.env.WHATSAPP_URL;
    const response = await axios.get(
      `${whatsappUrl}/send?to=${encodeURIComponent(to)}&text=${encodeURIComponent(
        text
      )}`
    );
    console.log(response);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/analytics", authenticate, async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalEscalations = await Escalation.countDocuments();
    const totalResolvedEscalations = await Escalation.countDocuments({
      status: "resolved",
    });
    const totalPendingEscalations = await Escalation.countDocuments({
      status: "pending",
    });
    const totalUsers = (await Message.distinct("wa_id")).length;

    const totalMessagesSent = await Message.countDocuments({
      direction: "outbound",
    });
    const totalMessagesReceived = await Message.countDocuments({
      direction: "inbound",
    });
    const escalationResolvedTimeAgg = await Escalation.aggregate([
      { $match: { status: "resolved" } },
      {
        $project: {
          diff: { $subtract: ["$updatedAt", "$createdAt"] },
        },
      },
      {
        $group: {
          _id: null,
          avgResolvedTime: { $avg: "$diff" },
        },
      },
    ]);
    const responseTime =
      escalationResolvedTimeAgg[0]?.avgResolvedTime / 60000 || 0;
    res.status(200).json({
      totalMessages,
      totalEscalations,
      totalResolvedEscalations,
      totalPendingEscalations,
      totalUsers,
      totalMessagesSent,
      totalMessagesReceived,
      responseTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/escalations", authenticate, async (req, res) => {
  try {
    const escalations = await Escalation.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "wa_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          userName: "$userInfo.name",
          userWaId: "$userInfo.wa_id",
        },
      },
    ]);
    res.status(200).json(escalations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/escalations/resolve", authenticate, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Escalation ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid escalation ID format" });
    }

    const existingEscalation = await Escalation.findById(id);

    if (!existingEscalation) {
      return res.status(404).json({ error: "Escalation not found" });
    }

    if (existingEscalation.status === "resolved") {
      return res.status(200).json({
        message: "Escalation already resolved",
        escalation: existingEscalation,
      });
    }

    if (existingEscalation.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Escalation status is not pending" });
    }

    const escalation = await Escalation.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    );

    return res.status(200).json({
      message: "Escalation resolved successfully",
      escalation,
    });
  } catch (error) {
    console.error("Error resolving escalation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// OpenAI Chat Completions streaming endpoint (no auth for demo)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.post("/api/v1/ai/stream", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing 'prompt' string in body" });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const stream = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    console.error("OpenAI stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to stream response" });
    } else {
      try {
        res.write("\n[error]: Failed to stream response");
        res.end();
      } catch (_) {}
    }
  }
});

// Catch-all route to serve the frontend for any route that doesn't match API routes
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
