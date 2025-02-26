import Share from "react-native-share";
import Clipboard from "@react-native-clipboard/clipboard";
import { Alert } from "react-native";

/**
 * 分享影片到社群媒體
 * @param {string} videoUrl - 影片的下載連結
 */
export const shareVideo = async (videoUrl) => {
  try {
    const shareOptions = {
      title: "分享我的 AI MV！",
      message: "看看我用 AI MV App 製作的影片！ 🚀",
      url: videoUrl,
      type: "video/mp4",
    };

    await Share.open(shareOptions);
    console.log("影片分享成功:", videoUrl);
  } catch (error) {
    console.error("分享失敗:", error);
  }
};

/**
 * 直接分享到特定平台
 * @param {string} videoUrl - 影片下載連結
 * @param {string} platform - 平台名稱 ('facebook' | 'youtube' | 'twitter' | 'tiktok')
 */
export const shareToPlatform = async (videoUrl, platform) => {
  let socialPlatform;

  switch (platform) {
    case "facebook":
      socialPlatform = Share.Social.FACEBOOK;
      break;
    case "youtube":
      socialPlatform = Share.Social.YOUTUBE;
      break;
    case "twitter":
      socialPlatform = Share.Social.TWITTER;
      break;
    case "tiktok":
      socialPlatform = Share.Social.TIKTOK;
      break;
    default:
      Alert.alert("錯誤", "不支援此社群平台");
      return;
  }

  try {
    const shareOptions = {
      title: "分享我的 AI MV！",
      message: "看看我用 AI MV App 製作的影片！ 🚀",
      url: videoUrl,
      social: socialPlatform,
    };

    await Share.shareSingle(shareOptions);
    console.log(`影片分享到 ${platform} 成功`);
  } catch (error) {
    console.error(`分享到 ${platform} 失敗:`, error);
  }
};

/**
 * 複製影片連結到剪貼簿
 * @param {string} videoUrl - 影片的下載連結
 */
export const copyVideoLink = (videoUrl) => {
  Clipboard.setString(videoUrl);
  Alert.alert("已複製連結", "你可以分享這個連結給朋友！");
};
