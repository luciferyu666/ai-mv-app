import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Slider, Text, StyleSheet } from "react-native";
import Video from "react-native-video";

const VideoPlayer = ({ source }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 切換播放/暫停
  const togglePlayPause = () => {
    setPaused(!paused);
  };

  // 更新播放進度
  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  // 影片載入完成
  const handleLoad = (data) => {
    setDuration(data.duration);
  };

  // 調整播放進度
  const seekVideo = (time) => {
    videoRef.current.seek(time);
    setCurrentTime(time);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        onProgress={handleProgress}
        onLoad={handleLoad}
      />

      {/* 進度條 */}
      <Slider
        style={styles.slider}
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        onValueChange={seekVideo}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8E8E8E"
        thumbTintColor="#1EB1FC"
      />

      {/* 播放/暫停按鈕 */}
      <TouchableOpacity
        onPress={togglePlayPause}
        style={styles.playPauseButton}
      >
        <Text style={styles.playPauseText}>
          {paused ? "▶️ 播放" : "⏸ 暫停"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  slider: {
    width: "90%",
    marginTop: 10,
  },
  playPauseButton: {
    marginTop: 10,
    backgroundColor: "#1EB1FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  playPauseText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VideoPlayer;
