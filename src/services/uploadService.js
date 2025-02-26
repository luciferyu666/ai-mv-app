import storage from "@react-native-firebase/storage";

/**
 * 上傳影片至 Firebase Storage
 * @param {string} filePath - 本地影片路徑 (file:// 開頭)
 * @param {function} onProgress - 上傳進度回調函數 (可選)
 * @returns {Promise<string>} 影片下載連結
 */
export const uploadVideo = async (filePath, onProgress = null) => {
  try {
    // 生成唯一檔案名稱
    const fileName = `videos/${Date.now()}.mp4`;
    const reference = storage().ref(fileName);

    // 開始上傳
    const task = reference.putFile(filePath);

    // 監聽上傳進度
    task.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`上傳進度: ${progress}%`);
      if (onProgress) onProgress(progress);
    });

    // 等待上傳完成
    await task;

    // 獲取下載連結
    const downloadURL = await reference.getDownloadURL();
    console.log("影片上傳成功:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("影片上傳失敗:", error);
    throw error;
  }
};
