import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import RNFS from "react-native-fs"; // 用於儲存影片檔案

const RecordScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back; // 使用後置鏡頭
  const camera = useRef(null);
  const navigation = useNavigation();
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);

  // 請求相機 & 麥克風權限
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      if (
        cameraPermission !== "authorized" ||
        microphonePermission !== "authorized"
      ) {
        Alert.alert("權限不足", "請啟用相機與麥克風權限");
      }
    };
    requestPermissions();
  }, []);

  // 開始錄影
  const startRecording = async () => {
    if (!camera.current) return;
    setRecording(true);

    try {
      const video = await camera.current.startRecording({
        flash: "off",
        onRecordingFinished: (video) => {
          console.log("錄製完成:", video);
          setVideoPath(video.path);
          setRecording(false);
        },
        onRecordingError: (error) => {
          console.error("錄影錯誤:", error);
          setRecording(false);
        },
      });
    } catch (error) {
      console.error("錄影啟動失敗:", error);
      setRecording(false);
    }
  };

  // 停止錄影
  const stopRecording = async () => {
    if (!camera.current) return;
    await camera.current.stopRecording();
  };

  // 儲存影片到本機 (可選)
  const saveVideo = async () => {
    if (!videoPath) return;
    const newPath = `${RNFS.DocumentDirectoryPath}/my_video.mp4`;
    await RNFS.moveFile(videoPath, newPath);
    Alert.alert("影片已儲存", `已存至 ${newPath}`);
  };

  return (
    <View style={styles.container}>
      {device ? (
        <>
          {/* 相機視圖 */}
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            video={true}
            audio={true}
          />

          {/* 錄製按鈕 */}
          <TouchableOpacity
            style={[styles.recordButton, recording ? styles.recording : {}]}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.buttonText}>
              {recording ? "停止錄製" : "開始錄製"}
            </Text>
          </TouchableOpacity>

          {/* 影片儲存按鈕 */}
          {videoPath && (
            <TouchableOpacity style={styles.saveButton} onPress={saveVideo}>
              <Text style={styles.buttonText}>儲存影片</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.errorText}>未找到可用相機</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "75%",
  },
  recordButton: {
    position: "absolute",
    bottom: 80,
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  recording: {
    backgroundColor: "darkred",
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#1EB1FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "white",
    fontSize: 18,
  },
});

export default RecordScreen;
