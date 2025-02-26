require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

// 啟用 CORS
app.use(cors());
app.use(express.json());

// 設定 Multer 來處理影片上傳
const upload = multer({ dest: "uploads/" });

// AI 伺服器（假設是 Flask 提供 AI 背景去背服務）
const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:8000";

// 上傳並去除影片背景
app.post("/remove-background", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "請提供影片" });

  try {
    const videoPath = req.file.path;
    console.log(`收到影片: ${videoPath}`);

    // 發送影片給 AI 伺服器（MODNet / RVM）
    const formData = new FormData();
    formData.append("file", fs.createReadStream(videoPath));

    const response = await axios.post(
      `${AI_SERVER_URL}/remove-background`,
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    // 返回處理後的影片 URL
    return res.json({ video_url: response.data.video_url });
  } catch (error) {
    console.error("AI 去背失敗:", error);
    return res.status(500).json({ error: "無法處理影片" });
  }
});

// AI 生成 MV 背景
app.post("/generate-background", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "請提供背景描述" });

  try {
    const response = await axios.post(`${AI_SERVER_URL}/generate-background`, {
      prompt,
    });

    return res.json({ image_url: response.data.image_url });
  } catch (error) {
    console.error("AI 背景生成失敗:", error);
    return res.status(500).json({ error: "無法生成背景" });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行於 http://localhost:${PORT}`);
});
