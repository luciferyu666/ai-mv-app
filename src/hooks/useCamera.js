import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";

/**
 * 自訂 Hook：管理相機錄製功能
 */
export const useCamera = () => {
  const devices = useCameraDevices();
  const device = devices.back; // 使用後置相機
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoPath, setVideoPath] = useState(null);

  // 請求相機 & 麥克風權限
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const micPermission = await Camera.requestMicrophonePermission();

      if (cameraPermission === "authorized" && micPermission === "authorized") {
        setHasPermission(true);
      } else {
        Alert.alert("權限不足", "請啟用相機與麥克風權限");
      }
    };
    requestPermissions();
  }, []);

  // 開始錄製影片
  const startRecording = async () => {
    if (!cameraRef.current) return;
    setRecording(true);

    try {
      const video = await cameraRef.current.startRecording({
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
    if (!cameraRef.current) return;
    await cameraRef.current.stopRecording();
  };

  return {
    cameraRef,
    device,
    hasPermission,
    recording,
    videoPath,
    startRecording,
    stopRecording,
  };
};
