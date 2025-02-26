import { FFmpeg } from "@ffmpeg/ffmpeg";
import RNFS from "react-native-fs";

/**
 * 初始化 FFmpeg
 */
const loadFFmpeg = async () => {
  if (!FFmpeg.isLoaded()) {
    await FFmpeg.load();
    console.log("FFmpeg 已加載");
  }
};

/**
 * 裁剪影片
 * @param {string} inputPath - 影片路徑 (file:// 開頭)
 * @param {number} startTime - 裁剪開始時間（秒）
 * @param {number} duration - 裁剪時長（秒）
 * @returns {Promise<string>} - 新影片路徑
 */
export const trimVideo = async (inputPath, startTime, duration) => {
  await loadFFmpeg();
  const outputPath = `${RNFS.DocumentDirectoryPath}/trimmed_video.mp4`;

  const command = `-i ${inputPath} -ss ${startTime} -t ${duration} -c:v copy -c:a copy ${outputPath}`;
  const result = await FFmpeg.run(command);
  if (result === 0) {
    console.log("裁剪成功:", outputPath);
    return outputPath;
  } else {
    throw new Error("影片裁剪失敗");
  }
};

/**
 * 調整影片音量
 * @param {string} inputPath - 影片路徑
 * @param {number} volume - 音量倍率 (0.5 = 降低 50%，2 = 增強 200%)
 * @returns {Promise<string>} - 新影片路徑
 */
export const adjustVolume = async (inputPath, volume) => {
  await loadFFmpeg();
  const outputPath = `${RNFS.DocumentDirectoryPath}/adjusted_volume.mp4`;

  const command = `-i ${inputPath} -filter:a "volume=${volume}" ${outputPath}`;
  const result = await FFmpeg.run(command);
  if (result === 0) {
    console.log("音量調整成功:", outputPath);
    return outputPath;
  } else {
    throw new Error("音量調整失敗");
  }
};

/**
 * 應用濾鏡效果
 * @param {string} inputPath - 影片路徑
 * @param {string} filter - 濾鏡名稱 ('grayscale' | 'sepia' | 'cartoon')
 * @returns {Promise<string>} - 新影片路徑
 */
export const applyFilter = async (inputPath, filter) => {
  await loadFFmpeg();
  const outputPath = `${RNFS.DocumentDirectoryPath}/filtered_video.mp4`;

  let filterCommand = "";
  switch (filter) {
    case "grayscale":
      filterCommand = "hue=s=0";
      break;
    case "sepia":
      filterCommand =
        "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131";
      break;
    case "cartoon":
      filterCommand = "gblur=sigma=3";
      break;
    default:
      throw new Error("不支援的濾鏡");
  }

  const command = `-i ${inputPath} -vf "${filterCommand}" ${outputPath}`;
  const result = await FFmpeg.run(command);
  if (result === 0) {
    console.log("濾鏡應用成功:", outputPath);
    return outputPath;
  } else {
    throw new Error("濾鏡應用失敗");
  }
};

/**
 * 合併影片與背景（適用 AI 去背後的影片）
 * @param {string} videoPath - 影片路徑
 * @param {string} backgroundPath - 背景影片/圖片路徑
 * @returns {Promise<string>} - 合併後的影片路徑
 */
export const mergeVideoWithBackground = async (videoPath, backgroundPath) => {
  await loadFFmpeg();
  const outputPath = `${RNFS.DocumentDirectoryPath}/merged_video.mp4`;

  const command = `-i ${videoPath} -i ${backgroundPath} -filter_complex "[0:v]chromakey=0x00FF00:0.1:0.2[out]" -map "[out]" ${outputPath}`;
  const result = await FFmpeg.run(command);
  if (result === 0) {
    console.log("影片合併成功:", outputPath);
    return outputPath;
  } else {
    throw new Error("影片合併失敗");
  }
};
