// utils/toast.ts

import { ToastAndroid } from "react-native";

export const showToast = (message: string, duration = ToastAndroid.SHORT) =>
    ToastAndroid.show(message, duration);