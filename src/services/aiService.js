import axios from "axios";

/** 後端 AI 伺服器 API */
const API_BASE_URL = "https://api.example.com";

/**
 * 上傳影片並進行 AI 背景去背
 * @param {string} filePath - 本地影片路徑 (file:// 開頭)
 * @param {function} onProgress - 上傳進度回調函數 (可選)
 * @returns {Promise<string>} 處理後影片的下載連結
 */
export const removeBackground = async (filePath, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: filePath,
      name: "video.mp4",
      type: "video/mp4",
    });

    // 上傳至後端
    const response = await axios.post(
      `${API_BASE_URL}/remove-background`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          if (onProgress) onProgress(progress);
        },
      }
    );

    console.log("去背影片下載連結:", response.data.video_url);
    return response.data.video_url;
  } catch (error) {
    console.error("AI 背景去背失敗:", error);
    throw error;
  }
};

/**
 * 生成 AI MV 背景 (Stable Diffusion / ControlNet)
 * @param {string} prompt - 使用者輸入的 AI 生成背景描述
 * @returns {Promise<string>} 生成的背景圖片 URL
 */
export const generateAIBackground = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-background`, {
      prompt,
    });

    console.log("AI 生成背景 URL:", response.data.image_url);
    return response.data.image_url;
  } catch (error) {
    console.error("AI 背景生成失敗:", error);
    throw error;
  }
};
