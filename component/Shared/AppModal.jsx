import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";

const AppModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "OK",
  showCancel = true,
  confirmColor = Colors.GREEN,
  cancelColor = "red",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonRow}>
            {showCancel && (
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.button, { borderColor: cancelColor }]}
              >
                <Text style={[styles.cancelText, { color: cancelColor }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, { backgroundColor: confirmColor }]}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: 300,
  },
  title: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.GREEN,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    fontFamily: "outfit",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  confirmText: {
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  cancelText: {
    fontWeight: "bold",
  },
});
