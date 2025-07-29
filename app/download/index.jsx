import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constant/Colors";
import { styles } from "../../styles/Download.styles";

export default function DownloadScreen() {
  const [downloads, setDownloads] = useState([]);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null); // Track loading per item

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    const saved = await AsyncStorage.getItem("offlineDownloads");
    if (saved) setDownloads(JSON.parse(saved));
  };

  const removeDownload = async (item) => {
    if (loadingId) return;
    setLoadingId(item.id);
    try {
      await FileSystem.deleteAsync(item.uri, { idempotent: true });
      const updated = downloads.filter((d) => d.id !== item.id);
      setDownloads(updated);
      await AsyncStorage.setItem("offlineDownloads", JSON.stringify(updated));
    } catch (error) {
      Alert.alert("Error", "Unable to delete the course file.");
    } finally {
      setLoadingId(null);
    }
  };

  const share = async (item) => {
    if (loadingId) return;
    setLoadingId(item.id);
    try {
      const fileInfo = await FileSystem.getInfoAsync(item.uri);
      if (!fileInfo.exists) {
        Alert.alert("File not found", "The file has been moved or deleted.");
        return;
      }
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          "Sharing Not Available",
          "This feature is not supported on your device."
        );
        return;
      }
      await Sharing.shareAsync(item.uri, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${item.title}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share the course file.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (router && typeof router.push === "function") router.back();
        }}
        accessible={true}
        accessibilityLabel="Go back"
        style={styles.backButton}
      >
        <Ionicons size={24} color={Colors.BLACK} name="arrow-back" />
      </Pressable>
      <Text
        style={[
          styles.title,
          {
            textAlign: "center",
            marginTop: 30,
            fontFamily: "outfit-bold",
          },
        ]}
      >
        Downloaded Courses
      </Text>
      {downloads.length === 0 ? (
        <Text style={styles.empty}>No courses downloaded.</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={downloads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              <View
                style={[
                  styles.itemBox,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 2,
                    borderBottomColor: Colors.PRIMARY,
                    borderTopWidth: 2,
                    borderTopColor: Colors.RED,
                    backgroundColor: "#ccc",
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderRightColor: Colors.BLACK,
                    borderLeftColor: Colors.GREEN,
                  },
                ]}
              >
                <Text numberOfLines={4} style={styles.itemText}>
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => share(item)}
                    disabled={!!loadingId}
                  >
                    {loadingId === item.id ? (
                      <ActivityIndicator size={"small"} color={Colors.GREEN} />
                    ) : (
                      <Text
                        style={[
                          styles.delete,
                          {
                            color: Colors.GREEN,
                            backgroundColor: Colors.BG_GRAY,
                            borderWidth: 0.5,
                            borderColor: Colors.GREEN,
                          },
                        ]}
                      >
                        Share
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!!loadingId}
                    onPress={() =>
                      Alert.alert(
                        "Delete?",
                        "Remove this course from device?",
                        [
                          { text: "Cancel" },
                          {
                            text: "Delete",
                            onPress: () => removeDownload(item),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.desc}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}