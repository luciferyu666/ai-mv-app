import React, { useEffect } from "react";
import { StatusBar, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RecordScreen from "./screens/RecordScreen";
import EditScreen from "./screens/EditScreen";
import BackgroundScreen from "./screens/BackgroundScreen";
import ShareScreen from "./screens/ShareScreen";
import { loadFFmpeg } from "./utils/ffmpegUtils";
import { Provider } from "react-redux";
import store from "./store";
import { Camera } from "react-native-vision-camera";

// 創建 Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  // 初始化應用程式（加載 FFmpeg、請求權限）
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 請求相機 & 麥克風權限
        const cameraPermission = await Camera.requestCameraPermission();
        const micPermission = await Camera.requestMicrophonePermission();
        if (
          cameraPermission !== "authorized" ||
          micPermission !== "authorized"
        ) {
          Alert.alert("權限不足", "請啟用相機與麥克風權限");
        }

        // 初始化 FFmpeg
        await loadFFmpeg();
      } catch (error) {
        console.error("應用初始化失敗:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RecordScreen" component={RecordScreen} />
          <Stack.Screen name="EditScreen" component={EditScreen} />
          <Stack.Screen name="BackgroundScreen" component={BackgroundScreen} />
          <Stack.Screen name="ShareScreen" component={ShareScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
