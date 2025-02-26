import { useState } from "react";
import axios from "axios";

/** AI 影像處理 API 伺服器 */
const API_BASE_URL = "https://api.example.com";

/**
 * 自訂 Hook：AI 背景去背 & 生成背景
 */
export const useBackgroundAI = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [generatedBackgroundUrl, setGeneratedBackgroundUrl] = useState(null);

  /**
   * 上傳影片並去除背景
   * @param {string} filePath - 影片本地路徑 (file:// 開頭)
   */
  const removeBackground = async (filePath) => {
    setProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: filePath,
        name: "video.mp4",
        type: "video/mp4",
      });

      const response = await axios.post(
        `${API_BASE_URL}/remove-background`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const progressPercent = Math.round(
              (event.loaded / event.total) * 100
            );
            setProgress(progressPercent);
          },
        }
      );

      setProcessedVideoUrl(response.data.video_url);
      console.log("去背影片下載連結:", response.data.video_url);
    } catch (error) {
      console.error("AI 背景去背失敗:", error);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * 生成 AI MV 背景
   * @param {string} prompt - 使用者輸入的背景描述
   */
  const generateAIBackground = async (prompt) => {
    setProcessing(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-background`, {
        prompt,
      });

      setGeneratedBackgroundUrl(response.data.image_url);
      console.log("AI 生成背景 URL:", response.data.image_url);
    } catch (error) {
      console.error("AI 背景生成失敗:", error);
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    progress,
    processedVideoUrl,
    generatedBackgroundUrl,
    removeBackground,
    generateAIBackground,
  };
};
