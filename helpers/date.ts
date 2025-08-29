import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const date = dayjs.extend(relativeTime);