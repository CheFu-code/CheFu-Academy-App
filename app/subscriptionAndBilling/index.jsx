import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "@react-native-firebase/firestore";

import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useContext, useEffect, useState } from "react";
import RNFS from "react-native-fs";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SubscriptionAndBilling() {
  const { userDetail } = useContext(UserDetailContext);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const db = getFirestore(); // NEW

  const getUserPayments = async (email) => {
    const q = query(collection(db, "payments"), where("email", "==", email));

    const snapshot = await getDocs(q);
    const payments = [];
    snapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    return payments;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getUserPayments(userDetail.email); // from context
      setPaymentHistory(data);
    };

    fetchPayments();
  }, []);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const downloadTransaction = async (payment, userDetail) => {
    setLoading(true);
    try {
      const html = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              padding: 24px;
              background: #ffffff;
              color: #333;
            }
            header {
              text-align: center;
              margin-bottom: 30px;
            }
            header h1 {
              color: #1a73e8;
              margin-bottom: 4px;
            }
            header p {
              font-size: 13px;
              color: #666;
            }
            h2 {
              color: #2c3e50;
              border-bottom: 2px solid #eee;
              padding-bottom: 10px;
              margin-top: 40px;
            }
            .section {
              margin-bottom: 25px;
            }
            .label {
              font-weight: 600;
              width: 180px;
              display: inline-block;
            }
            .value {
              color: #444;
            }
            .amount {
              font-weight: bold;
              font-size: 16px;
              color: #28a745;
            }
            .status-paid {
              color: white;
              background-color: #28a745;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              display: inline-block;
            }
            .status-failed {
              color: white;
              background-color: #dc3545;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              display: inline-block;
            }
            footer {
              border-top: 1px solid #ddd;
              margin-top: 50px;
              padding-top: 20px;
              font-size: 12px;
              color: #888;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>CheFu Academy</h1>
            <p>Empowering Learners Through Tech Education</p>
            <p><a href="https://chefu.academy">www.chefu.academy</a></p>
          </header>

          <h2>Transaction Receipt</h2>

          <div class="section">
            <p><span class="label">Order ID:</span> <span class="value">${
              payment.orderID
            }</span></p>
            <p><span class="label">Payer Name:</span> <span class="value">${
              payment.payerName?.given_name || ""
            } ${payment.payerName?.surname || ""}</span></p>
            <p><span class="label">Payer Email:</span> <span class="value">${
              payment.email
            }</span></p>
          </div>

          <div class="section">
            <p><span class="label">Plan:</span> <span class="value">${
              payment.planType
            }</span></p>
            <p><span class="label">Amount:</span> <span class="amount">${
              payment.amount?.value
            } ${payment.amount?.currency_code}</span></p>
            <p><span class="label">Status:</span> 
              <span class="${
                payment.status?.toLowerCase() === "paid" ||
                payment.status?.toLowerCase() === "completed"
                  ? "status-paid"
                  : "status-failed"
              }">${payment.status}</span>
            </p>
            <p><span class="label">Transaction Date:</span> <span class="value">${new Date(
              payment.timestamp
            ).toLocaleString()}</span></p>
          </div>

          <div class="section">
            <p><span class="label">Membership Start:</span> <span class="value">${new Date(
              userDetail?.subscribedAt
            ).toLocaleDateString()}</span></p>
            <p><span class="label">Membership Ends:</span> <span class="value">${new Date(
              userDetail?.memberUntil
            ).toLocaleDateString()}</span></p>
          </div>

          <footer>
            Thank you for learning with CheFu Academy.<br/>
            Need help? Email us at <strong>support@chefu.academy</strong><br/>
            &copy; ${new Date().getFullYear()} CheFu Inc. All rights reserved.
          </footer>
        </body>
      </html>
    `;

      // Generate the PDF (temporary uri)
      const { uri } = await Print.printToFileAsync({ html });

      // Construct destination path in Downloads folder (Android)
      const fileName = `chefu_receipt_${payment.orderID || Date.now()}.pdf`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // Copy from temp uri to Downloads folder
      // Android requires file:// prefix for RNFS paths
      await RNFS.copyFile(uri.replace("file://", ""), downloadPath);

      Alert.alert(
        "Success",
        `Receipt saved to Downloads folder:\n${downloadPath}`
      );
    } catch (error) {
      console.error("Download failed", error);
      Alert.alert("Error", "Failed to save receipt.");
    }
    setLoading(false);
  };

  const shareTransaction = async (payment) => {
    setLoading(true);
    try {
      const html = `
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 24px;
        background: #ffffff;
        color: #333;
      }
      header {
        text-align: center;
        margin-bottom: 30px;
      }
      header h1 {
        color: #1a73e8;
        margin-bottom: 4px;
      }
      header p {
        font-size: 13px;
        color: #666;
      }
      h2 {
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-top: 40px;
      }
      .section {
        margin-bottom: 25px;
      }
      .label {
        font-weight: 600;
        width: 180px;
        display: inline-block;
      }
      .value {
        color: #444;
      }
      .amount {
        font-weight: bold;
        font-size: 16px;
        color: #28a745;
      }
      .status-paid {
        color: white;
        background-color: #28a745;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        display: inline-block;
      }
      .status-failed {
        color: white;
        background-color: #dc3545;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        display: inline-block;
      }
      footer {
        border-top: 1px solid #ddd;
        margin-top: 50px;
        padding-top: 20px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>CheFu Academy</h1>
      <p>Empowering Learners Through Tech Education</p>
      <p><a href="https://chefu.academy">www.chefu.academy</a></p>
    </header>

    <h2>Transaction Receipt</h2>

    <div class="section">
      <p><span class="label">Order ID:</span> <span class="value">${
        payment.orderID
      }</span></p>
      <p><span class="label">Payer Name:</span> <span class="value">${
        payment.payerName?.given_name || ""
      } ${payment.payerName?.surname || ""}</span></p>
      <p><span class="label">Payer Email:</span> <span class="value">${
        payment.email
      }</span></p>
    </div>

    <div class="section">
      <p><span class="label">Plan:</span> <span class="value">${
        payment.planType
      }</span></p>
      <p><span class="label">Amount:</span> <span class="amount">${
        payment.amount?.value
      } ${payment.amount?.currency_code}</span></p>
      <p><span class="label">Status:</span> 
        <span class="${
          payment.status?.toLowerCase() === "paid" ||
          payment.status?.toLowerCase() === "completed"
            ? "status-paid"
            : "status-failed"
        }">${payment.status}</span>
      </p>
      <p><span class="label">Transaction Date:</span> <span class="value">${new Date(
        payment.timestamp
      ).toLocaleString()}</span></p>
    </div>

    <div class="section">
      <p><span class="label">Membership Start:</span> <span class="value">${new Date(
        userDetail?.subscribedAt
      ).toLocaleDateString()}</span></p>
      <p><span class="label">Membership Ends:</span> <span class="value">${new Date(
        userDetail?.memberUntil
      ).toLocaleDateString()}</span></p>
    </div>

    <footer>
      Thank you for learning with CheFu Academy.<br/>
      Need help? Email us at <strong>support@chefu.academy</strong><br/>
      &copy; ${new Date().getFullYear()} CheFu Inc. All rights reserved.
    </footer>
  </body>
</html>
`;

      const { uri } = await Print.printToFileAsync({ html });

      if (!(await Sharing.isAvailableAsync())) {
        alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(uri);
      setLoading(false);
    } catch (err) {
      console.error("Download failed", err);
      alert("Error", "Failed to download transaction");
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { padding: 20 }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons style={styles.icon} size={24} name="arrow-back" />
        </Pressable>
        <Text style={styles.heading}>Subscription & Billing</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Current Plan Section */}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.sectionTitle}>Current Plan</Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                disabled={loading}
                onPress={() =>
                  paymentHistory.length > 0
                    ? shareTransaction(paymentHistory[0])
                    : alert("No payment available")
                }
              >
                {loading ? (
                  <ActivityIndicator color="green" />
                ) : (
                  <MaterialIcons
                    name="share"
                    size={24}
                    style={{
                      color: "green",
                      padding: 5,
                      backgroundColor: Colors.LIGHT_GREEN,
                      borderRadius: 15,
                    }}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  paymentHistory.length > 0
                    ? downloadTransaction(paymentHistory[0], userDetail)
                    : alert("No receipt available")
                }
              >
                <MaterialIcons
                  name="receipt"
                  size={24}
                  style={{
                    color: "green",
                    padding: 5,
                    backgroundColor: Colors.LIGHT_GREEN,
                    borderRadius: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.planName}>
            {`${capitalize(userDetail.planType)} Plan`}
          </Text>
          <Text style={styles.renewalDate}>
            Your plan will expire on:{" "}
            {new Date(userDetail.memberUntil).toLocaleDateString()}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Replace with real cancellation logic
              alert("Cancel Subscription pressed");
            }}
          >
            <Text style={styles.buttonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: Colors.BG_GRAY,
              fontFamily: "michroma",
              fontSize: 12,
            }}
          >
            Email: {userDetail.email}
          </Text>
          <Text style={styles.sectionTitle}>
            Total Payments: {paymentHistory.length}
          </Text>
        </View>

        {/* Payment History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {paymentHistory.map((payment) => (
            <View key={payment.id} style={styles.paymentRow}>
              <Text style={styles.paymentText}>
                {new Date(payment.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.paymentText}>
                {payment.amount?.value} {payment.amount?.currency_code}
              </Text>
              <Text
                style={{
                  color:
                    payment.status === "Paid" || payment.status === "COMPLETED"
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {payment.status}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG_COLOR,
    flex: 1,
  },
  icon: {
    marginTop: 30,
    backgroundColor: Colors.GRAY,
    padding: 5,
    borderRadius: 20,
    color: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    color: Colors.PRIMARY,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "white",
  },
  planName: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.GREEN,
    fontFamily: "outfit-bold",
  },
  renewalDate: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    fontFamily: "outfit",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  paymentText: {
    color: "#ccc",
    fontSize: 14,
  },
});
