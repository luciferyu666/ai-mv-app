import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import RNFFmpeg from "react-native-ffmpeg";
import RNFS from "react-native-fs";

const EditScreen = ({ route, navigation }) => {
  const { videoPath } = route.params; // 從錄製頁面獲取影片
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);
  const [volume, setVolume] = useState(1.0);
  const [filter, setFilter] = useState(null);
  const [exportedVideo, setExportedVideo] = useState(null);

  // 切換播放/暫停
  const togglePlayPause = () => setIsPlaying(!isPlaying);

  // 應用濾鏡
  const applyFilter = (type) => {
    setFilter(type);
  };

  // 執行剪輯 (FFmpeg)
  const trimVideo = async () => {
    const outputFilePath = `${RNFS.DocumentDirectoryPath}/trimmed_video.mp4`;
    const command = `-i ${videoPath} -ss ${trimStart} -to ${trimEnd} -c:v copy -c:a copy ${outputFilePath}`;

    const result = await RNFFmpeg.execute(command);
    if (result === 0) {
      setExportedVideo(outputFilePath);
      Alert.alert("剪輯完成", "影片已成功裁剪！");
    } else {
      Alert.alert("剪輯失敗", "發生錯誤，請重試");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>影片編輯</Text>

      {/* 影片播放器 */}
      <Video
        ref={videoRef}
        source={{ uri: videoPath }}
        style={styles.video}
        resizeMode="contain"
        paused={!isPlaying}
        volume={volume}
        filter={filter}
      />

      {/* 播放控制 */}
      <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
        <Text style={styles.buttonText}>
          {isPlaying ? "⏸ 暫停" : "▶️ 播放"}
        </Text>
      </TouchableOpacity>

      {/* 剪輯控制 */}
      <Text style={styles.label}>裁剪開始時間: {trimStart}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={30}
        value={trimStart}
        onValueChange={(value) => setTrimStart(value)}
      />
      <Text style={styles.label}>裁剪結束時間: {trimEnd}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={trimStart}
        maximumValue={30}
        value={trimEnd}
        onValueChange={(value) => setTrimEnd(value)}
      />

      {/* 音量控制 */}
      <Text style={styles.label}>音量調整</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={(value) => setVolume(value)}
      />

      {/* 濾鏡效果 */}
      <Text style={styles.label}>選擇濾鏡</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => applyFilter("none")}
        >
          <Text style={styles.filterText}>無濾鏡</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => applyFilter("grayscale")}
        >
          <Text style={styles.filterText}>黑白</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => applyFilter("sepia")}
        >
          <Text style={styles.filterText}>復古</Text>
        </TouchableOpacity>
      </View>

      {/* 剪輯 & 儲存按鈕 */}
      <TouchableOpacity style={styles.button} onPress={trimVideo}>
        <Text style={styles.buttonText}>✂️ 剪輯影片</Text>
      </TouchableOpacity>

      {exportedVideo && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={() => Alert.alert("影片已儲存", exportedVideo)}
        >
          <Text style={styles.buttonText}>✅ 影片已儲存</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
  },
  filterText: {
    color: "#fff",
  },
});

export default EditScreen;
