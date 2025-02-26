import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Video from "react-native-video";
import Share from "react-native-share";
import Clipboard from "@react-native-clipboard/clipboard";
import RNFS from "react-native-fs";

const ShareScreen = ({ route }) => {
  const { videoPath } = route.params; // 從剪輯頁面獲取影片
  const [isPlaying, setIsPlaying] = useState(false);

  // 切換播放/暫停
  const togglePlayPause = () => setIsPlaying(!isPlaying);

  // 分享影片
  const shareVideo = async () => {
    try {
      const shareOptions = {
        title: "分享我的 AI MV！",
        message: "看看我用 AI MV App 製作的影片！ 🚀",
        url: `file://${videoPath}`,
        type: "video/mp4",
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error("分享失敗:", error);
    }
  };

  // 複製影片連結
  const copyLink = () => {
    const videoUrl =
      "https://your-cloud-storage.com/" + videoPath.split("/").pop();
    Clipboard.setString(videoUrl);
    Alert.alert("已複製連結", "你可以分享這個連結給朋友！");
  };

  // 下載影片到本機
  const downloadVideo = async () => {
    try {
      const downloadPath = `${RNFS.DownloadDirectoryPath}/my_video.mp4`;
      await RNFS.copyFile(videoPath, downloadPath);
      Alert.alert("下載成功", `影片已存至: ${downloadPath}`);
    } catch (error) {
      console.error("下載失敗:", error);
      Alert.alert("下載失敗", "無法儲存影片");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>分享你的 MV！</Text>

      {/* 影片播放器 */}
      <Video
        source={{ uri: videoPath }}
        style={styles.video}
        resizeMode="contain"
        paused={!isPlaying}
      />

      {/* 播放按鈕 */}
      <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
        <Text style={styles.buttonText}>
          {isPlaying ? "⏸ 暫停" : "▶️ 播放"}
        </Text>
      </TouchableOpacity>

      {/* 分享按鈕 */}
      <TouchableOpacity style={styles.button} onPress={shareVideo}>
        <Text style={styles.buttonText}>📤 分享影片</Text>
      </TouchableOpacity>

      {/* 複製連結 */}
      <TouchableOpacity style={styles.button} onPress={copyLink}>
        <Text style={styles.buttonText}>🔗 複製影片連結</Text>
      </TouchableOpacity>

      {/* 下載影片 */}
      <TouchableOpacity style={styles.button} onPress={downloadVideo}>
        <Text style={styles.buttonText}>⬇️ 下載影片</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#1EB1FC",
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 8,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShareScreen;
