import notifee, {
  RepeatFrequency,
  TriggerType
} from "@notifee/react-native";

const DAILY_NOTIFICATION_ID = "chefu-daily-reminder";

export async function scheduleDailyNotification() {
  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);
  date.setSeconds(0);

  // If it's already past 8AM today, schedule for tomorrow
  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  // Cancel existing notification with the same ID (if any)
  await notifee.cancelNotification(DAILY_NOTIFICATION_ID);

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id: DAILY_NOTIFICATION_ID,
      title: "Daily Reminder",
      body: "Time to continue learning on CheFu Academy!",
      android: {
        channelId: "default",
        pressAction: {
          id: "default",
        },
      },
    },
    trigger
  );

  console.log(
    "✅ Daily repeating notification scheduled for",
    date.toLocaleString()
  );
}
