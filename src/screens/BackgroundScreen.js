import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// 內建背景圖片列表
const builtInBackgrounds = [
  { id: 1, name: "都市夜景", image: require("../assets/backgrounds/city.jpg") },
  {
    id: 2,
    name: "森林奇境",
    image: require("../assets/backgrounds/forest.jpg"),
  },
  {
    id: 3,
    name: "未來科技",
    image: require("../assets/backgrounds/futuristic.jpg"),
  },
  {
    id: 4,
    name: "海灘日落",
    image: require("../assets/backgrounds/beach.jpg"),
  },
];

// AI 生成背景（模擬 API 回應）
const aiGeneratedBackgrounds = [
  {
    id: 5,
    name: "AI - 霓虹街道",
    image: require("../assets/backgrounds/ai_neon.jpg"),
  },
  {
    id: 6,
    name: "AI - 星空宇宙",
    image: require("../assets/backgrounds/ai_space.jpg"),
  },
];

const BackgroundScreen = () => {
  const navigation = useNavigation();
  const [selectedBackground, setSelectedBackground] = useState(null);

  // 選擇背景
  const selectBackground = (background) => {
    setSelectedBackground(background);
  };

  // 確認背景並返回
  const confirmBackground = () => {
    if (!selectedBackground) {
      Alert.alert("請選擇背景", "請先選擇一個背景來應用到 MV");
      return;
    }
    // 假設我們會將背景資訊傳回 MV 編輯頁面
    navigation.navigate("RecordScreen", { background: selectedBackground });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>選擇 MV 背景</Text>

      {/* 內建背景列表 */}
      <Text style={styles.sectionTitle}>內建背景</Text>
      <FlatList
        data={builtInBackgrounds}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.backgroundItem,
              selectedBackground?.id === item.id ? styles.selected : {},
            ]}
            onPress={() => selectBackground(item)}
          >
            <Image source={item.image} style={styles.backgroundImage} />
            <Text style={styles.backgroundName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* AI 生成背景列表 */}
      <Text style={styles.sectionTitle}>AI 生成背景</Text>
      <FlatList
        data={aiGeneratedBackgrounds}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.backgroundItem,
              selectedBackground?.id === item.id ? styles.selected : {},
            ]}
            onPress={() => selectBackground(item)}
          >
            <Image source={item.image} style={styles.backgroundImage} />
            <Text style={styles.backgroundName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 確認按鈕 */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={confirmBackground}
      >
        <Text style={styles.buttonText}>確定背景</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1EB1FC",
    marginBottom: 10,
  },
  backgroundItem: {
    marginRight: 15,
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#1EB1FC",
  },
  backgroundImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  backgroundName: {
    marginTop: 5,
    color: "#fff",
    fontSize: 14,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#1EB1FC",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BackgroundScreen;
