import { UserDetail } from '@/types/UserDetail';
import { requestStoragePermission } from '@/utils/requestStorage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const useTransaction = () => {
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const downloadTransaction = async (payment, userDetail: UserDetail) => {
        setLoading2(true);
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert(
                    'Permission Denied',
                    'Cannot save receipt without storage permission.',
                );
                setLoading2(false);
                return;
            }

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
            payment.payerName?.given_name || ''
        } ${payment.payerName?.surname || ''}</span></p>
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
              payment.status?.toLowerCase() === 'paid' ||
              payment.status?.toLowerCase() === 'completed'
                  ? 'status-paid'
                  : 'status-failed'
          }">${payment.status}</span>
        </p>
        <p><span class="label">Transaction Date:</span> <span class="value">${new Date(
            payment.timestamp,
        ).toLocaleString()}</span></p>
      </div>

      <div class="section">
        <p><span class="label">Membership Start:</span> <span class="value">${new Date(
            userDetail?.subscribedAt,
        ).toLocaleDateString()}</span></p>
        <p><span class="label">Membership Ends:</span> <span class="value">${new Date(
            userDetail?.memberUntil,
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

            if (Platform.OS === 'android') {
                const fileName = `CheFu_Academy_subscription_receipt_${
                    payment.orderID || Date.now()
                }.pdf`;
                const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
                await RNFS.copyFile(uri.replace('file://', ''), downloadPath);

                Alert.alert(
                    'Success',
                    `Receipt saved to Downloads folder:\n${downloadPath}`,
                );
            } else {
                // iOS fallback: share instead of saving to Downloads
                if (!(await Sharing.isAvailableAsync())) {
                    Alert.alert(
                        'Error',
                        'Sharing is not available on this device',
                    );
                    setLoading2(false);
                    return;
                }
                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            console.error('Download failed', error);
            Alert.alert('Error', 'Failed to save receipt.');
        } finally {
            setLoading2(false);
        }
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
          payment.payerName?.given_name || ''
      } ${payment.payerName?.surname || ''}</span></p>
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
            payment.status?.toLowerCase() === 'paid' ||
            payment.status?.toLowerCase() === 'completed'
                ? 'status-paid'
                : 'status-failed'
        }">${payment.status}</span>
      </p>
      <p><span class="label">Transaction Date:</span> <span class="value">${new Date(
          payment.timestamp,
      ).toLocaleString()}</span></p>
    </div>

    <div class="section">
      <p><span class="label">Membership Start:</span> <span class="value">${new Date(
          userDetail?.subscribedAt,
      ).toLocaleDateString()}</span></p>
      <p><span class="label">Membership Ends:</span> <span class="value">${new Date(
          userDetail?.memberUntil,
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
                Alert.alert('Error', 'Sharing is not available on this device');
                setLoading(false);
                return;
            }

            await Sharing.shareAsync(uri);
        } catch (err) {
            console.error('Download failed', err);
            Alert.alert('Error', 'Failed to download transaction');
        } finally {
            setLoading(false);
        }
    };

    return { downloadTransaction, shareTransaction };
};
