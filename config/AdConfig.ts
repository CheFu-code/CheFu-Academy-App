import {
    INTERSTITIAL_AD_UNIT_ID,
    REWARDED_AD_UNIT_ID,
} from '@/constant/random';
import { InterstitialAd, RewardedAd } from 'react-native-google-mobile-ads';

export const rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
});

export const interstitial = InterstitialAd.createForAdRequest(
    INTERSTITIAL_AD_UNIT_ID,
    { requestNonPersonalizedAdsOnly: true },
);
