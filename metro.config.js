const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const path = require("path");

// Get the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Get Sentry's Metro config
const sentryConfig = getSentryExpoConfig(__dirname);

// Your custom additions (alias)
const customConfig = {
    resolver: {
        alias: {
            "@": path.resolve(__dirname),
        },
    },
};

// Merge defaultConfig and sentryConfig first, then merge your customConfig
module.exports = mergeConfig(
    mergeConfig(defaultConfig, sentryConfig),
    customConfig
);
