export const DEFAULT_PREFS = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
};

export type PrefKey = keyof typeof DEFAULT_PREFS;
