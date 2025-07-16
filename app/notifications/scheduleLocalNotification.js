import notifee, { RepeatFrequency, TriggerType } from '@notifee/react-native';

export async function scheduleDailyNotification() {
  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);
  date.setSeconds(0);
  // If the time is already past today 8AM, schedule for tomorrow
  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // First fire time
    repeatFrequency: RepeatFrequency.DAILY, // Repeat every day
  };

  await notifee.createTriggerNotification(
    {
      title: 'Daily Reminder',
      body: 'Time to continue learning on CheFu Academy!',
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );

  console.log('✅ Daily repeating notification scheduled for', date.toLocaleString());
}
