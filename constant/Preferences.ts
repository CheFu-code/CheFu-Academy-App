export const DEFAULT_PREFS = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
};


export const PREF_KEY = 'email_preferences';

export type PrefKey = keyof typeof DEFAULT_PREFS;
